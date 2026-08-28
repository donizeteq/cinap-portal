import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as dataBR } from "./cinap-PoyC-pfo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CredencialMinisterial-BjVy1x3g.js
var import_jsx_runtime = require_jsx_runtime();
var retrato_obreiro_default = "./assets/retrato-obreiro-B1c_pLLK.jpg";
function CredencialMinisterial({ obreiro, congregacao }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex aspect-[1/1.58] w-[320px] flex-col items-center overflow-hidden rounded-xl border-8 border-primary/5 bg-surface p-6 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 top-0 h-1 w-full bg-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 size-28 overflow-hidden rounded-sm outline outline-1 outline-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: retrato_obreiro_default,
					alt: `Retrato de ${obreiro.nome}`,
					width: 512,
					height: 512,
					loading: "lazy",
					className: "size-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
				className: "mt-6 font-display text-xl leading-tight",
				children: obreiro.nome
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-primary",
				children: ["Cargo: ", obreiro.cargo]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 w-full space-y-3 border-t border-dashed border-border pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
						rotulo: "Congregação",
						valor: congregacao?.nome ?? "Sem vínculo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
						rotulo: "Validade",
						valor: dataBR(obreiro.validade)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
						rotulo: "Registro",
						valor: obreiro.registro
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex size-12 items-center justify-center rounded-full border border-primary/20 opacity-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-full border-4 border-double border-primary/30" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[8px] uppercase tracking-tighter text-muted-foreground",
					children: "Selo de autenticidade digital"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-8 -right-8 size-24 rounded-full bg-primary/5" })
		]
	});
}
function Linha({ rotulo, valor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3 font-mono text-[9px] uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: rotulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate font-bold",
			children: valor
		})]
	});
}
//#endregion
export { CredencialMinisterial as t };
