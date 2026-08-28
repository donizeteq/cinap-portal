import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C2B7HPJD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validar._registro-CsTGeqtN.js
var validarCredencial = createServerFn({ method: "GET" }).inputValidator((input) => {
	const registro = (input?.registro ?? "").trim();
	if (!registro || registro.length > 40) throw new Error("Registro inválido.");
	return { registro };
}).handler(createSsrRpc("fe4e5468035db65065b13fe27a195741c5f18e3d6c52437836572a82933af7ba"));
var $$splitComponentImporter = () => import("./validar2._registro-dGUckcxB.mjs");
var $$splitNotFoundComponentImporter = () => import("./validar._registro-DS2KJeKD.mjs");
var $$splitErrorComponentImporter = () => import("./validar._registro-dwb3aqET.mjs");
var Route = createFileRoute("/validar/$registro")({
	loader: async ({ params }) => await validarCredencial({ data: { registro: params.registro } }),
	head: ({ params }) => ({ meta: [
		{ title: `Validação da credencial ${params.registro} | CINAP` },
		{
			name: "description",
			content: "Confira a autenticidade de uma credencial ministerial da CINAP pelo número de registro impresso no QR Code."
		},
		{
			property: "og:title",
			content: "Validação de credencial ministerial | CINAP"
		},
		{
			property: "og:description",
			content: "Consulta pública de autenticidade das credenciais ministeriais da Convenção."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
