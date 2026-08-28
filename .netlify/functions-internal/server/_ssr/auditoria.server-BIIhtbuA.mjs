import { n as supabaseAdmin } from "./client.server-DqzlzxEm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditoria.server-BIIhtbuA.js
/** Grava uma ação da Secretaria Geral no livro de auditoria. */
async function registrarAuditoria(registro) {
	let email = "";
	let nome = "";
	if (registro.usuarioId) {
		const { data } = await supabaseAdmin.auth.admin.getUserById(registro.usuarioId);
		email = data?.user?.email ?? "";
		const { data: perfil } = await supabaseAdmin.from("profiles").select("nome").eq("id", registro.usuarioId).maybeSingle();
		nome = perfil?.nome ?? "";
	}
	await supabaseAdmin.from("auditoria").insert({
		usuario_id: registro.usuarioId,
		usuario_email: email,
		usuario_nome: nome,
		acao: registro.acao,
		entidade: registro.entidade,
		entidade_id: registro.entidadeId ?? null,
		descricao: registro.descricao,
		detalhes: JSON.parse(JSON.stringify(registro.detalhes ?? {}))
	});
}
//#endregion
export { registrarAuditoria };
