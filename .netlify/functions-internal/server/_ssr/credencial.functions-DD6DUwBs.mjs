import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-DYxxyguE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/credencial.functions-DD6DUwBs.js
var validarCredencial_createServerFn_handler = createServerRpc({
	id: "fe4e5468035db65065b13fe27a195741c5f18e3d6c52437836572a82933af7ba",
	name: "validarCredencial",
	filename: "src/lib/credencial.functions.ts"
}, (opts) => validarCredencial.__executeServer(opts));
var validarCredencial = createServerFn({ method: "GET" }).inputValidator((input) => {
	const registro = (input?.registro ?? "").trim();
	if (!registro || registro.length > 40) throw new Error("Registro inválido.");
	return { registro };
}).handler(validarCredencial_createServerFn_handler, async ({ data }) => {
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "";
	const { data: linhas, error } = await createClient(process.env["SUPABASE_URL"], key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
			h.set("apikey", key);
			return fetch(input, {
				...init,
				headers: h
			});
		} }
	}).rpc("validar_credencial", { _registro: data.registro });
	if (error) throw new Error("Não foi possível consultar a credencial no momento.");
	const registro = linhas?.[0];
	if (!registro) return { encontrada: false };
	return {
		encontrada: true,
		credencial: registro
	};
});
//#endregion
export { validarCredencial_createServerFn_handler };
