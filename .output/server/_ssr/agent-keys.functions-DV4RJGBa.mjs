import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-UH_Jp6hR.mjs";
import { n as hashChave, t as gerarChaveAgente } from "./agent-keys-oVnL2XVT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-keys.functions-DV4RJGBa.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function garantirAdmin(context) {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden: admin only");
}
var listarChavesAgente_createServerFn_handler = createServerRpc({
	id: "4dacb3b552407cc8f7269dec5dae4a7340e932142bec4540d0d1d9287c39727c",
	name: "listarChavesAgente",
	filename: "src/lib/agent-keys.functions.ts"
}, (opts) => listarChavesAgente.__executeServer(opts));
var listarChavesAgente = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listarChavesAgente_createServerFn_handler, async ({ context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { data, error } = await supabaseAdmin.from("agent_keys").select("id, nome, permissoes, ativa, ultimo_uso, created_at").order("created_at", { ascending: false });
	if (error) throw error;
	return data;
});
var criarChaveAgente_createServerFn_handler = createServerRpc({
	id: "c7cdd08b96f03e3bf2a72bbc061fc55d7ed63ce62f0176da731015a049cc7a78",
	name: "criarChaveAgente",
	filename: "src/lib/agent-keys.functions.ts"
}, (opts) => criarChaveAgente.__executeServer(opts));
var criarChaveAgente = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(criarChaveAgente_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const chave = gerarChaveAgente();
	const { data: agent, error } = await supabaseAdmin.from("agent_keys").insert({
		nome: data.nome,
		chave_hash: hashChave(chave),
		permissoes: data.permissoes,
		ativa: true
	}).select("id, nome, permissoes, ativa, ultimo_uso, created_at").single();
	if (error) throw error;
	return {
		chave,
		agent
	};
});
var alternarChaveAgente_createServerFn_handler = createServerRpc({
	id: "154c5f42472fa31a4d736e577763fc4c30f442f6e467787a5e3aabc828772f93",
	name: "alternarChaveAgente",
	filename: "src/lib/agent-keys.functions.ts"
}, (opts) => alternarChaveAgente.__executeServer(opts));
var alternarChaveAgente = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(alternarChaveAgente_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { error } = await supabaseAdmin.from("agent_keys").update({ ativa: data.ativa }).eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var excluirChaveAgente_createServerFn_handler = createServerRpc({
	id: "30590d93081144bdc7679df9de369857ded610ac106c8047f3a81620d8c235f5",
	name: "excluirChaveAgente",
	filename: "src/lib/agent-keys.functions.ts"
}, (opts) => excluirChaveAgente.__executeServer(opts));
var excluirChaveAgente = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(excluirChaveAgente_createServerFn_handler, async ({ data, context }) => {
	await garantirAdmin(context);
	const { supabaseAdmin } = await import("./client.server-DqzlzxEm.mjs").then((n) => n.t);
	const { error } = await supabaseAdmin.from("agent_keys").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { alternarChaveAgente_createServerFn_handler, criarChaveAgente_createServerFn_handler, excluirChaveAgente_createServerFn_handler, listarChavesAgente_createServerFn_handler };
