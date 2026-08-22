import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as brl, n as CATEGORIAS, r as MENSALIDADE_POR_CATEGORIA } from "./cinap-PoyC-pfo.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DXAGqmyb.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none",
						children: "CINAP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro mt-1",
						children: "Secretaria Geral"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground",
						children: "Acessar portal"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-5xl px-6 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Documento institucional"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 max-w-3xl font-display text-5xl leading-tight md:text-6xl",
						children: "Convenção das Igrejas Nacionais Autônomas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-muted-foreground",
						children: "Portal de gestão administrativa para o registro das congregações filiadas, do corpo de obreiros, das contribuições mensais e da emissão da credencial ministerial digital."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-wrap gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/painel",
							className: "bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20",
							children: "Painel administrativo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/minha-situacao",
							className: "border border-border px-8 py-4 text-[11px] font-bold uppercase tracking-widest",
							children: "Área do obreiro"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-6 py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Art. 7º — Tabela de contribuição"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-6 sm:grid-cols-3",
						children: CATEGORIAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-registro",
									children: "Categoria"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-3xl",
									children: c
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 font-display text-4xl text-primary",
									children: brl(MENSALIDADE_POR_CATEGORIA[c])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "mensalidade por congregação"
								})
							]
						}, c))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-5xl px-6 py-10 text-xs text-muted-foreground",
				children: "CINAP — Convenção das Igrejas Nacionais Autônomas · Secretaria Geral"
			})
		]
	});
}
//#endregion
export { Index as component };
