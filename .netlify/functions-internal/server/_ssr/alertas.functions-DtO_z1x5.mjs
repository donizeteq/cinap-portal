import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-C9ScP8Ku.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C2B7HPJD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alertas.functions-DtO_z1x5.js
var salvarConfigAlertas = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("4cba85d62c263c24f23710beabc7285230765df848eb14cb789603f889dd3fb3"));
var executarAlertasAgora = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("49018b8ca8659ee3774ee309323d443e73d3b3d69a1061c0c5293c2df488dc37"));
var enviarEmailTeste = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const destinatario = (input?.destinatario ?? "").trim();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinatario)) throw new Error("E-mail inválido");
	return { destinatario };
}).handler(createSsrRpc("e64bfc9342fa31cd0c744b5c86bd590c3747f301b46afb6cf81fe71047bfc2e1"));
var previewEmailAviso = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("8117230d6ee767213a57cf9e2a80a5bb57674aee3f17b73726f477a963d792c8"));
var listarPerfisAcesso = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9ad7363866483d40ea6b84449bcaccb9b8c588c72d166bb93a288dffc577935f"));
var definirPapelAcesso = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("9bba6c06ce0979300fe1d81d63a8be58c778a167cb21574019a42c94f5e5a7ca"));
var gerarPreviaAvisos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({ agendarPara: input?.agendarPara ?? null })).handler(createSsrRpc("6d656478ebb90d8372bff8f729691d44799cf573c336eb8da3b7686d200c8ac7"));
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
}).handler(createSsrRpc("4a202fb3441f49709ca8a8ee5cb24c95d01ecc2a724cf092938e976c899763ec"));
var despacharAvisos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({ ids: input?.ids ?? [] })).handler(createSsrRpc("6f8cd21515d02442bf92835fc24d0a8289f362a173484ede67da052ae657fcd8"));
var listarAuditoria = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({ limite: Math.min(Math.max(input?.limite ?? 200, 1), 500) })).handler(createSsrRpc("10fcaad296a6d120d9a603308fe0d5862bc7d03234f88482feb9563f53d49fac"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input?.acao || !input?.entidade) throw new Error("Ação inválida.");
	return {
		acao: input.acao.slice(0, 60),
		entidade: input.entidade.slice(0, 60),
		entidadeId: input.entidadeId ?? null,
		descricao: (input.descricao ?? "").slice(0, 400),
		detalhes: input.detalhes ?? {}
	};
}).handler(createSsrRpc("721c4b8769af64f54313e463f244a720a7b2ea731010483499ce0542268cc8eb"));
//#endregion
export { executarAlertasAgora as a, listarPerfisAcesso as c, enviarEmailTeste as i, previewEmailAviso as l, definirPapelAcesso as n, gerarPreviaAvisos as o, despacharAvisos as r, listarAuditoria as s, decidirAvisos as t, salvarConfigAlertas as u };
