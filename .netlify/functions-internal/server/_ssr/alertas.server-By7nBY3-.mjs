import { a as brl, r as MENSALIDADE_POR_CATEGORIA } from "./cinap-PoyC-pfo.mjs";
import { CONFIG_PADRAO, aplicarVariaveis, indiceRef, paragrafosDoTemplate, refDe, refDoIndice } from "./cinap-alertas-DsjZy6q1.mjs";
import { n as supabaseAdmin } from "./client.server-DqzlzxEm.mjs";
import { enviarEmailCinap, montarEmailAviso } from "./email-cinap.server-80CD97Qp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alertas.server-By7nBY3-.js
async function carregarConfig() {
	const { data } = await supabaseAdmin.from("config_alertas").select("*").eq("id", true).maybeSingle();
	return {
		...CONFIG_PADRAO,
		...data ?? {}
	};
}
async function despachar(config, email, assunto, dados, chave) {
	if (config.__previa === true) return {
		enviado: false,
		erro: null,
		message_id: null,
		em: (/* @__PURE__ */ new Date()).toISOString(),
		tentativas: 0
	};
	if (!email) return {
		enviado: false,
		erro: "Obreiro sem e-mail cadastrado.",
		message_id: null,
		em: (/* @__PURE__ */ new Date()).toISOString(),
		tentativas: 0
	};
	const conteudo = montarEmailAviso(config, dados);
	return {
		...await enviarEmailCinap(config, email, assunto, conteudo, chave),
		tentativas: 1
	};
}
async function executarAlertas(opcoes = {}) {
	const apenasPrevia = opcoes.apenasPrevia === true;
	const agendarPara = apenasPrevia ? opcoes.agendarPara ?? null : null;
	const situacaoBase = apenasPrevia ? agendarPara ? "agendado" : "rascunho" : "enviado";
	const config = {
		...await carregarConfig(),
		__previa: apenasPrevia
	};
	const hoje = /* @__PURE__ */ new Date();
	const refAtual = refDe(hoje.getMonth() + 1, hoje.getFullYear());
	const idxAtual = indiceRef(refAtual);
	const [{ data: congregacoes }, { data: obreiros }, { data: pagamentos }] = await Promise.all([
		supabaseAdmin.from("congregacoes").select("*"),
		supabaseAdmin.from("obreiros").select("*"),
		supabaseAdmin.from("pagamentos").select("*").eq("status", "pago")
	]);
	const catPorCong = new Map((congregacoes ?? []).map((c) => [c.id, c.categoria]));
	const pagosPorObreiro = /* @__PURE__ */ new Map();
	for (const p of pagamentos ?? []) {
		const set = pagosPorObreiro.get(p.obreiro_id) ?? /* @__PURE__ */ new Set();
		set.add(p.referencia);
		pagosPorObreiro.set(p.obreiro_id, set);
	}
	const diasParaVencer = config.dia_vencimento - hoje.getDate();
	const avisarVencimento = diasParaVencer >= 0 && diasParaVencer <= config.dias_antes_aviso;
	const novas = [];
	let enviados = 0;
	let ultimoStatus = "Nenhum e-mail necessário.";
	for (const o of obreiros ?? []) {
		const categoria = o.congregacao_id ? catPorCong.get(o.congregacao_id) : void 0;
		const valor = MENSALIDADE_POR_CATEGORIA[categoria ?? "Bronze"];
		const pagos = pagosPorObreiro.get(o.id) ?? /* @__PURE__ */ new Set();
		const nome = o.nome;
		const email = o.email ?? null;
		if (avisarVencimento && !pagos.has(refAtual)) {
			const titulo = `Mensalidade vence em ${diasParaVencer === 0 ? "hoje" : `${diasParaVencer} dia(s)`}`;
			const mensagem = `Prezado(a) ${nome}, a contribuição de ${refAtual} no valor de ${brl(valor)} vence no dia ${config.dia_vencimento}. Regularize para manter sua credencial ativa.`;
			const varsVenc = {
				nome,
				referencia: refAtual,
				valor: brl(valor),
				dia_vencimento: config.dia_vencimento,
				meses: 0
			};
			const r = await despachar(config, email, aplicarVariaveis(config.assunto_vencimento, varsVenc), {
				titulo,
				saudacao: `Prezado(a) ${nome},`,
				paragrafos: paragrafosDoTemplate(config.corpo_vencimento, varsVenc),
				referencia: refAtual,
				valor: brl(valor),
				rodape: aplicarVariaveis(config.rodape_email, varsVenc)
			}, `venc-${o.id}-${refAtual}`);
			if (r.enviado) enviados += 1;
			else if (r.erro) ultimoStatus = r.erro;
			novas.push({
				obreiro_id: o.id,
				tipo: "vencimento",
				referencia: refAtual,
				meses_atraso: 0,
				titulo,
				mensagem,
				email_enviado: r.enviado,
				email_erro: r.erro,
				destinatario: email,
				tentativas: r.tentativas,
				enviado_em: r.enviado ? r.em : null,
				ultima_tentativa_em: r.tentativas > 0 ? r.em : null,
				valor,
				message_id: r.message_id,
				situacao: situacaoBase,
				agendado_para: agendarPara
			});
		}
		let maisAntigaEmAberto = null;
		for (let i = 1; i <= 24; i += 1) {
			const idx = idxAtual - i;
			if (!pagos.has(refDoIndice(idx))) maisAntigaEmAberto = idx;
			else break;
		}
		if (maisAntigaEmAberto !== null) {
			const meses = idxAtual - maisAntigaEmAberto;
			if (meses % config.meses_intervalo_atraso === 0) {
				const titulo = `Inadimplência de ${meses} mês(es)`;
				const mensagem = `Prezado(a) ${nome}, constam ${meses} mensalidade(s) em aberto (desde ${refDoIndice(maisAntigaEmAberto)}), totalizando ${brl(meses * valor)}. Procure a tesouraria para regularização.`;
				const desde = refDoIndice(maisAntigaEmAberto);
				const varsAtraso = {
					nome,
					referencia: desde,
					valor: brl(meses * valor),
					dia_vencimento: config.dia_vencimento,
					meses
				};
				const r = await despachar(config, email, aplicarVariaveis(config.assunto_atraso, varsAtraso), {
					titulo,
					saudacao: `Prezado(a) ${nome},`,
					paragrafos: paragrafosDoTemplate(config.corpo_atraso, varsAtraso),
					referencia: desde,
					valor: brl(meses * valor),
					rodape: aplicarVariaveis(config.rodape_email, varsAtraso)
				}, `atraso-${o.id}-${desde}-${meses}`);
				if (r.enviado) enviados += 1;
				else if (r.erro) ultimoStatus = r.erro;
				novas.push({
					obreiro_id: o.id,
					tipo: "atraso",
					referencia: desde,
					meses_atraso: meses,
					titulo,
					mensagem,
					email_enviado: r.enviado,
					email_erro: r.erro,
					destinatario: email,
					tentativas: r.tentativas,
					enviado_em: r.enviado ? r.em : null,
					ultima_tentativa_em: r.tentativas > 0 ? r.em : null,
					valor: meses * valor,
					message_id: r.message_id,
					situacao: situacaoBase,
					agendado_para: agendarPara
				});
			}
		}
	}
	let inseridas = 0;
	if (novas.length > 0) {
		const { data, error } = await supabaseAdmin.from("notificacoes").upsert(novas, {
			onConflict: "obreiro_id,tipo,referencia,meses_atraso",
			ignoreDuplicates: true
		}).select("id");
		if (error) throw error;
		inseridas = data?.length ?? 0;
	}
	const executadoEm = (/* @__PURE__ */ new Date()).toISOString();
	await supabaseAdmin.from("config_alertas").update({ ultima_execucao: executadoEm }).eq("id", true);
	return {
		executado_em: executadoEm,
		referencia: refAtual,
		vencimento: novas.filter((n) => n.tipo === "vencimento").length,
		atraso: novas.filter((n) => n.tipo === "atraso").length,
		emails_enviados: enviados,
		email_status: apenasPrevia ? "Prévia gerada: nenhum e-mail foi disparado." : enviados > 0 ? "E-mails enviados." : ultimoStatus,
		novas: inseridas
	};
}
/** Envia os avisos já aprovados e os agendados cuja data chegou. */
async function despacharAvisosAprovados(ids) {
	const config = await carregarConfig();
	const agora = (/* @__PURE__ */ new Date()).toISOString();
	let consulta = supabaseAdmin.from("notificacoes").select("*").neq("situacao", "enviado").neq("situacao", "cancelado").neq("situacao", "rascunho");
	if (ids && ids.length > 0) consulta = supabaseAdmin.from("notificacoes").select("*").in("id", ids);
	const { data: pendentes, error } = await consulta;
	if (error) throw error;
	const fila = (pendentes ?? []).filter((n) => {
		const situacao = n.situacao;
		if (situacao === "enviado" || situacao === "cancelado" || situacao === "rascunho") return false;
		if (situacao === "agendado") return Boolean(n.agendado_para) && n.agendado_para <= agora;
		return true;
	});
	let enviados = 0;
	let falhas = 0;
	let ultimo = "Nenhum aviso pendente de envio.";
	for (const n of fila) {
		const email = n.destinatario ?? null;
		const vars = {
			nome: n.titulo ?? "",
			referencia: n.referencia,
			valor: brl(Number(n.valor ?? 0)),
			dia_vencimento: config.dia_vencimento,
			meses: Number(n.meses_atraso ?? 0)
		};
		const atraso = n.tipo === "atraso";
		const r = await despachar(config, email, aplicarVariaveis(atraso ? config.assunto_atraso : config.assunto_vencimento, vars), {
			titulo: n.titulo,
			saudacao: "Prezado(a) obreiro(a),",
			paragrafos: paragrafosDoTemplate(atraso ? config.corpo_atraso : config.corpo_vencimento, vars),
			referencia: n.referencia,
			valor: brl(Number(n.valor ?? 0)),
			rodape: aplicarVariaveis(config.rodape_email, vars)
		}, `aviso-${n.id}`);
		if (r.enviado) enviados += 1;
		else {
			falhas += 1;
			if (r.erro) ultimo = r.erro;
		}
		await supabaseAdmin.from("notificacoes").update({
			situacao: r.enviado ? "enviado" : "falhou",
			email_enviado: r.enviado,
			email_erro: r.erro,
			message_id: r.message_id,
			tentativas: Number(n.tentativas ?? 0) + 1,
			enviado_em: r.enviado ? r.em : null,
			ultima_tentativa_em: r.em
		}).eq("id", n.id);
	}
	return {
		processados: fila.length,
		enviados,
		falhas,
		status: enviados > 0 ? `${enviados} aviso(s) enviado(s).` : ultimo
	};
}
//#endregion
export { despacharAvisosAprovados, executarAlertas };
