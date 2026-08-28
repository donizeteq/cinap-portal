import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as brl, i as STATUS_LABEL, l as statusClasses, s as dataBR } from "./cinap-PoyC-pfo.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { r as useSessao, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { t as CredencialMinisterial } from "./CredencialMinisterial-BjVy1x3g.mjs";
import { t as gerarReciboPDF } from "./cinap-pdf-FdMTTRNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/minha-situacao-DChQosMR.js
var import_jsx_runtime = require_jsx_runtime();
function MinhaSituacao() {
	const { session } = useSessao();
	const usuario = session?.user ?? null;
	const obreiro = useQuery({
		queryKey: ["meu-obreiro", usuario?.id],
		enabled: Boolean(usuario?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("obreiros").select("*").eq("user_id", usuario.id).maybeSingle();
			if (error) throw error;
			return data ?? null;
		}
	});
	const congregacao = useQuery({
		queryKey: ["minha-congregacao", obreiro.data?.congregacao_id],
		enabled: Boolean(obreiro.data?.congregacao_id),
		queryFn: async () => {
			const { data, error } = await supabase.from("congregacoes").select("*").eq("id", obreiro.data.congregacao_id).maybeSingle();
			if (error) throw error;
			return data ?? null;
		}
	});
	const pagamentos = useQuery({
		queryKey: ["meus-pagamentos", obreiro.data?.id],
		enabled: Boolean(obreiro.data?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("pagamentos").select("*").eq("obreiro_id", obreiro.data.id).order("data", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	if (obreiro.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Minha Situação",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Consultando arquivo…"
		})
	});
	if (!obreiro.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Minha Situação",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "plate p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro",
					children: "Registro não localizado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 font-display text-3xl",
					children: "Seu cadastro ainda não foi vinculado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground",
					children: [
						"Procure a secretaria da convenção para vincular seu e-mail de acesso",
						usuario?.email ? ` (${usuario.email})` : "",
						" ao seu registro ministerial."
					]
				})
			]
		})
	});
	const o = obreiro.data;
	const total = (pagamentos.data ?? []).filter((p) => p.status === "pago").reduce((s, p) => s + Number(p.valor), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Minha Situação",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-10 lg:grid-cols-[340px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-6 area-impressao",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredencialMinisterial, {
					obreiro: o,
					congregacao: congregacao.data ?? void 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => window.print(),
					className: "no-print w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5",
					children: "Salvar credencial em PDF"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8 no-print",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cartao, {
							rotulo: "Situação",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2 py-1 text-xs uppercase ${statusClasses(o.status_pagamento)}`,
								children: STATUS_LABEL[o.status_pagamento]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cartao, {
							rotulo: "Total contribuído",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-3xl",
								children: brl(total)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cartao, {
							rotulo: "Validade da credencial",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-3xl",
								children: dataBR(o.validade)
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-6 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold uppercase tracking-widest",
							children: "Histórico de contribuições"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "label-registro border-b border-border px-6 py-3 font-normal",
									children: "Referência"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "label-registro border-b border-border px-6 py-3 font-normal",
									children: "Data"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "label-registro border-b border-border px-6 py-3 font-normal",
									children: "Valor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "label-registro border-b border-border px-6 py-3 font-normal",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "label-registro border-b border-border px-6 py-3 font-normal",
									children: "Recibo"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(pagamentos.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border/60 px-6 py-4 font-mono text-xs",
								children: p.referencia
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border/60 px-6 py-4 text-muted-foreground",
								children: dataBR(p.data)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border/60 px-6 py-4",
								children: brl(Number(p.valor))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border/60 px-6 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2 py-0.5 text-[10px] uppercase ${statusClasses(p.status)}`,
									children: STATUS_LABEL[p.status]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border/60 px-6 py-4",
								children: p.status === "pago" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void gerarReciboPDF(p, o, congregacao.data ?? void 0),
									className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary",
									children: "Baixar PDF"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "—"
								})
							})
						] }, p.id)), pagamentos.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-6 py-10 text-center text-muted-foreground",
							children: "Nenhuma contribuição registrada até o momento."
						}) })] })]
					})]
				})]
			})]
		})
	});
}
function Cartao({ rotulo, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-registro",
			children: rotulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children
		})]
	});
}
//#endregion
export { MinhaSituacao as component };
