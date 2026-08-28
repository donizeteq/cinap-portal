import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as dataBR } from "./cinap-PoyC-pfo.mjs";
import { t as Route } from "./validar._registro-CsTGeqtN.mjs";
import { t as Moldura } from "./validar._registro-BodtTyyJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validar2._registro-dGUckcxB.js
var import_jsx_runtime = require_jsx_runtime();
function Validar() {
	const resultado = Route.useLoaderData();
	const { registro } = Route.useParams();
	if (!resultado.encontrada) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Moldura, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-block border border-destructive px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive",
		children: "Credencial não localizada"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-6 text-sm text-muted-foreground",
		children: [
			"Nenhum obreiro registrado sob o número",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-foreground",
				children: registro
			}),
			" no quadro da Convenção."
		]
	})] });
	const c = resultado.credencial;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Moldura, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `inline-block border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${c.valida ? "border-primary text-primary" : "border-destructive text-destructive"}`,
			children: c.valida ? "Credencial autêntica e vigente" : "Credencial irregular"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-6 font-display text-3xl leading-tight",
			children: c.nome
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-[11px] uppercase tracking-widest text-primary",
			children: c.cargo
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-8 divide-y divide-border border border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
					rotulo: "Registro",
					valor: c.registro
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
					rotulo: "Congregação",
					valor: c.congregacao
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
					rotulo: "Localidade",
					valor: c.cidade ? `${c.cidade}/${c.estado}` : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
					rotulo: "Validade",
					valor: dataBR(c.validade)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
					rotulo: "Contribuição",
					valor: c.status_pagamento === "pago" ? "Em dia" : c.status_pagamento === "pendente" ? "Pendente" : "Em atraso"
				})
			]
		}),
		!c.valida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 border-l-2 border-destructive pl-4 text-sm text-destructive",
			children: "A credencial perde a validade quando a contribuição mensal está em atraso ou o prazo de vigência expirou. Procure a Secretaria Geral para regularização."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-8 text-xs text-muted-foreground",
			children: [
				"Consulta pública emitida pela Secretaria Geral da CINAP em",
				" ",
				(/* @__PURE__ */ new Date()).toLocaleString("pt-BR"),
				"."
			]
		})
	] });
}
function Linha({ rotulo, valor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-6 px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] uppercase tracking-widest text-muted-foreground",
			children: rotulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right text-sm font-semibold",
			children: valor
		})]
	});
}
//#endregion
export { Validar as component };
