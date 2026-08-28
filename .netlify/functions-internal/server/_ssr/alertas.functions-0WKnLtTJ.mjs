import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-DYxxyguE.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-C9ScP8Ku.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alertas.functions-0WKnLtTJ.js
async function garantirAdmin(context) {
	const ctx = context;
	const { data: isAdmin } = await ctx.supabase.rpc("has_role", {
		_user_id: ctx.userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden: admin only");
}
var salvarConfigAlertas_createServerFn_handler = createServerRpc({
	id: "4cba85d62c263c24f23710beabc7285230765df848eb14cb789603f889dd3fb3",
	name: "salvarConfigAlertas",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => salvarConfigAlertas.__executeServer(opts));
var salvarConfigAlertas = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(salvarConfigAlertas_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { error } = await supabaseAdmin.from("config_alertas").update({
		...data,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", true);
	if (error) throw error;
	return { ok: true };
});
var executarAlertasAgora_createServerFn_handler = createServerRpc({
	id: "49018b8ca8659ee3774ee309323d443e73d3b3d69a1061c0c5293c2df488dc37",
	name: "executarAlertasAgora",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => executarAlertasAgora.__executeServer(opts));
var executarAlertasAgora = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(executarAlertasAgora_createServerFn_handler, async ({ context }) => {
	await garantirAdmin(context);
	const { executarAlertas } = await import("./alertas.server-By7nBY3-.mjs");
	return await executarAlertas();
});
var enviarEmailTeste_createServerFn_handler = createServerRpc({
	id: "e64bfc9342fa31cd0c744b5c86bd590c3747f301b46afb6cf81fe71047bfc2e1",
	name: "enviarEmailTeste",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => enviarEmailTeste.__executeServer(opts));
var enviarEmailTeste = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const destinatario = (input?.destinatario ?? "").trim();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinatario)) throw new Error("E-mail inválido");
	return { destinatario };
}).handler(enviarEmailTeste_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { CONFIG_PADRAO } = await import("./cinap-alertas-DsjZy6q1.mjs");
	const { enviarEmailCinap, montarEmailAviso } = await import("./email-cinap.server-80CD97Qp.mjs");
	const { data: row } = await supabaseAdmin.from("config_alertas").select("*").eq("id", true).maybeSingle();
	const config = {
		...CONFIG_PADRAO,
		...row ?? {}
	};
	const conteudo = montarEmailAviso(config, {
		titulo: "E-mail de teste",
		saudacao: "Prezado(a) responsável,",
		paragrafos: [
			"Esta é uma mensagem de teste enviada pelo portal da CINAP.",
			`Remetente configurado: ${config.remetente_nome} <${config.remetente_email || "não definido"}>.`,
			"Se você recebeu esta mensagem, o disparo automático dos avisos está operacional."
		],
		referencia: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR"),
		rodape: "Nenhuma ação é necessária."
	});
	return await enviarEmailCinap(config, data.destinatario, "CINAP · E-mail de teste", conteudo, `teste-${Date.now()}`);
});
var previewEmailAviso_createServerFn_handler = createServerRpc({
	id: "8117230d6ee767213a57cf9e2a80a5bb57674aee3f17b73726f477a963d792c8",
	name: "previewEmailAviso",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => previewEmailAviso.__executeServer(opts));
var previewEmailAviso = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(previewEmailAviso_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { CONFIG_PADRAO, aplicarVariaveis, paragrafosDoTemplate } = await import("./cinap-alertas-DsjZy6q1.mjs");
	const { montarEmailAviso } = await import("./email-cinap.server-80CD97Qp.mjs");
	const agora = /* @__PURE__ */ new Date();
	const vars = {
		nome: "Pr. João da Silva",
		referencia: `${String(agora.getMonth() + 1).padStart(2, "0")}/${agora.getFullYear()}`,
		valor: "R$ 50,00",
		dia_vencimento: 10,
		meses: data.tipo === "atraso" ? 3 : 0,
		congregacao: "Congregação Central"
	};
	const conteudo = montarEmailAviso({
		...CONFIG_PADRAO,
		remetente_nome: data.remetente_nome || CONFIG_PADRAO.remetente_nome
	}, {
		titulo: data.tipo === "vencimento" ? `Mensalidade vence em ${vars.dia_vencimento}` : `Inadimplência de ${vars.meses} mês(es)`,
		saudacao: `Prezado(a) ${vars.nome},`,
		paragrafos: paragrafosDoTemplate(data.corpo, vars),
		referencia: vars.referencia,
		valor: vars.valor,
		rodape: aplicarVariaveis(data.rodape, vars)
	});
	return {
		assunto: aplicarVariaveis(data.assunto, vars),
		html: conteudo.html
	};
});
var listarPerfisAcesso_createServerFn_handler = createServerRpc({
	id: "9ad7363866483d40ea6b84449bcaccb9b8c588c72d166bb93a288dffc577935f",
	name: "listarPerfisAcesso",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => listarPerfisAcesso.__executeServer(opts));
var listarPerfisAcesso = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listarPerfisAcesso_createServerFn_handler, async ({ context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { data: usuarios } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
	const { data: papeis } = await supabaseAdmin.from("user_roles").select("user_id, role");
	const { data: perfis } = await supabaseAdmin.from("profiles").select("id, nome");
	const { data: obreiros } = await supabaseAdmin.from("obreiros").select("user_id, nome, registro");
	return (usuarios?.users ?? []).map((u) => ({
		id: u.id,
		email: u.email ?? "",
		confirmado: Boolean(u.email_confirmed_at),
		criado_em: u.created_at,
		ultimo_acesso: u.last_sign_in_at ?? null,
		nome: (perfis ?? []).find((p) => p.id === u.id)?.nome || (obreiros ?? []).find((o) => o.user_id === u.id)?.nome || "",
		registro: (obreiros ?? []).find((o) => o.user_id === u.id)?.registro ?? null,
		papeis: (papeis ?? []).filter((p) => p.user_id === u.id).map((p) => p.role)
	}));
});
var definirPapelAcesso_createServerFn_handler = createServerRpc({
	id: "9bba6c06ce0979300fe1d81d63a8be58c778a167cb21574019a42c94f5e5a7ca",
	name: "definirPapelAcesso",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => definirPapelAcesso.__executeServer(opts));
var definirPapelAcesso = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(definirPapelAcesso_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const ctx = context;
	if (data.userId === ctx.userId && data.papel === "admin" && !data.conceder) throw new Error("Você não pode remover o seu próprio perfil de Secretaria Geral.");
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	if (data.conceder) {
		const { error } = await supabaseAdmin.from("user_roles").upsert({
			user_id: data.userId,
			role: data.papel
		}, { onConflict: "user_id,role" });
		if (error) throw error;
	} else {
		const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", data.papel);
		if (error) throw error;
	}
	return { ok: true };
});
var gerarPreviaAvisos_createServerFn_handler = createServerRpc({
	id: "6d656478ebb90d8372bff8f729691d44799cf573c336eb8da3b7686d200c8ac7",
	name: "gerarPreviaAvisos",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => gerarPreviaAvisos.__executeServer(opts));
var gerarPreviaAvisos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({ agendarPara: input?.agendarPara ?? null })).handler(gerarPreviaAvisos_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { executarAlertas } = await import("./alertas.server-By7nBY3-.mjs");
	const { registrarAuditoria } = await import("./auditoria.server-BIIhtbuA.mjs");
	const resultado = await executarAlertas({
		apenasPrevia: true,
		agendarPara: data.agendarPara
	});
	await registrarAuditoria({
		usuarioId: context.userId,
		acao: "aviso.previa",
		entidade: "notificacoes",
		descricao: data.agendarPara ? `Prévia gerada e agendada para ${new Date(data.agendarPara).toLocaleString("pt-BR")}` : "Prévia de avisos gerada para aprovação",
		detalhes: {
			...resultado,
			agendado_para: data.agendarPara
		}
	});
	return resultado;
});
var decidirAvisos_createServerFn_handler = createServerRpc({
	id: "4a202fb3441f49709ca8a8ee5cb24c95d01ecc2a724cf092938e976c899763ec",
	name: "decidirAvisos",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => decidirAvisos.__executeServer(opts));
var decidirAvisos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const ids = (input?.ids ?? []).filter((id) => typeof id === "string" && id.length > 0);
	if (ids.length === 0) throw new Error("Selecione ao menos um aviso.");
	if (![
		"aprovar",
		"agendar",
		"cancelar"
	].includes(input.acao)) throw new Error("Ação inválida.");
	if (input.acao === "agendar" && !input.agendarPara) throw new Error("Informe a data do agendamento.");
	return {
		ids,
		acao: input.acao,
		agendarPara: input.agendarPara ?? null
	};
}).handler(decidirAvisos_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { registrarAuditoria } = await import("./auditoria.server-BIIhtbuA.mjs");
	const userId = context.userId;
	const agora = (/* @__PURE__ */ new Date()).toISOString();
	const patch = data.acao === "cancelar" ? {
		situacao: "cancelado",
		agendado_para: null
	} : data.acao === "agendar" ? {
		situacao: "agendado",
		agendado_para: new Date(data.agendarPara).toISOString(),
		aprovado_por: userId,
		aprovado_em: agora
	} : {
		situacao: "aprovado",
		agendado_para: null,
		aprovado_por: userId,
		aprovado_em: agora
	};
	const { error } = await supabaseAdmin.from("notificacoes").update(patch).in("id", data.ids);
	if (error) throw error;
	await registrarAuditoria({
		usuarioId: userId,
		acao: `aviso.${data.acao}`,
		entidade: "notificacoes",
		descricao: `${data.ids.length} aviso(s) ${data.acao === "cancelar" ? "cancelado(s)" : data.acao === "agendar" ? "agendado(s)" : "aprovado(s)"}`,
		detalhes: {
			ids: data.ids,
			agendado_para: data.agendarPara
		}
	});
	return {
		ok: true,
		total: data.ids.length
	};
});
var despacharAvisos_createServerFn_handler = createServerRpc({
	id: "6f8cd21515d02442bf92835fc24d0a8289f362a173484ede67da052ae657fcd8",
	name: "despacharAvisos",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => despacharAvisos.__executeServer(opts));
var despacharAvisos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({ ids: input?.ids ?? [] })).handler(despacharAvisos_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { despacharAvisosAprovados } = await import("./alertas.server-By7nBY3-.mjs");
	const { registrarAuditoria } = await import("./auditoria.server-BIIhtbuA.mjs");
	const resultado = await despacharAvisosAprovados(data.ids.length > 0 ? data.ids : void 0);
	await registrarAuditoria({
		usuarioId: context.userId,
		acao: "aviso.envio",
		entidade: "notificacoes",
		descricao: `Envio manual: ${resultado.enviados} enviado(s), ${resultado.falhas} falha(s)`,
		detalhes: {
			...resultado,
			ids: data.ids
		}
	});
	return resultado;
});
var listarAuditoria_createServerFn_handler = createServerRpc({
	id: "10fcaad296a6d120d9a603308fe0d5862bc7d03234f88482feb9563f53d49fac",
	name: "listarAuditoria",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => listarAuditoria.__executeServer(opts));
var listarAuditoria = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({ limite: Math.min(Math.max(input?.limite ?? 200, 1), 500) })).handler(listarAuditoria_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { data: linhas, error } = await supabaseAdmin.from("auditoria").select("*").order("created_at", { ascending: false }).limit(data.limite);
	if (error) throw error;
	return linhas ?? [];
});
var registrarAcaoSecretaria_createServerFn_handler = createServerRpc({
	id: "721c4b8769af64f54313e463f244a720a7b2ea731010483499ce0542268cc8eb",
	name: "registrarAcaoSecretaria",
	filename: "src/lib/alertas.functions.ts"
}, (opts) => registrarAcaoSecretaria.__executeServer(opts));
var registrarAcaoSecretaria = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.acao || !input?.entidade) throw new Error("Ação inválida.");
	return {
		acao: input.acao.slice(0, 60),
		entidade: input.entidade.slice(0, 60),
		entidadeId: input.entidadeId ?? null,
		descricao: (input.descricao ?? "").slice(0, 400),
		detalhes: input.detalhes ?? {}
	};
}).handler(registrarAcaoSecretaria_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { registrarAuditoria } = await import("./auditoria.server-BIIhtbuA.mjs");
	await registrarAuditoria({
		usuarioId: context.userId,
		...data
	});
	return { ok: true };
});
//#endregion
export { decidirAvisos_createServerFn_handler, definirPapelAcesso_createServerFn_handler, despacharAvisos_createServerFn_handler, enviarEmailTeste_createServerFn_handler, executarAlertasAgora_createServerFn_handler, gerarPreviaAvisos_createServerFn_handler, listarAuditoria_createServerFn_handler, listarPerfisAcesso_createServerFn_handler, previewEmailAviso_createServerFn_handler, registrarAcaoSecretaria_createServerFn_handler, salvarConfigAlertas_createServerFn_handler };
