import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as brl, c as referenciaAtual, i as STATUS_LABEL, l as statusClasses, r as MENSALIDADE_POR_CATEGORIA, s as dataBR } from "./cinap-PoyC-pfo.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as gerarRelatorioMensalPDF, r as resumoPorCategoria, t as gerarReciboPDF } from "./cinap-pdf-FdMTTRNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pagamentos-BJEj6iaI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Art. 8º — vencimento no dia 10 do mês de referência. */
function vencimentoDaReferencia(referencia) {
	const [mes, ano] = referencia.split("/");
	return `${ano}-${mes}-10`;
}
var SITUACAO_LABEL = {
	pago: "Pago",
	pendente: "Pendente",
	vencido: "Vencido"
};
function situacaoClasses(s) {
	if (s === "pago") return "bg-success/10 text-success";
	if (s === "pendente") return "bg-warning/15 text-warning-foreground";
	return "bg-destructive/10 text-destructive";
}
function Pagamentos() {
	const { isAdmin, carregando } = usePapel();
	const queryClient = useQueryClient();
	const [busca, setBusca] = (0, import_react.useState)("");
	const [historico, setHistorico] = (0, import_react.useState)(null);
	const referencia = referenciaAtual();
	const vencimento = vencimentoDaReferencia(referencia);
	const dados = useQuery({
		queryKey: ["tesouraria"],
		enabled: isAdmin,
		queryFn: async () => {
			const [o, c, p] = await Promise.all([
				supabase.from("obreiros").select("*").order("nome"),
				supabase.from("congregacoes").select("*"),
				supabase.from("pagamentos").select("*").order("data", { ascending: false })
			]);
			if (o.error) throw o.error;
			if (c.error) throw c.error;
			if (p.error) throw p.error;
			return {
				obreiros: o.data,
				congregacoes: c.data,
				pagamentos: p.data
			};
		}
	});
	const obreiros = dados.data?.obreiros ?? [];
	const congregacoes = dados.data?.congregacoes ?? [];
	const pagamentos = dados.data?.pagamentos ?? [];
	function mensalidadeDe(obreiro) {
		const cong = congregacoes.find((c) => c.id === obreiro.congregacao_id);
		return cong ? Number(cong.valor_mensalidade || MENSALIDADE_POR_CATEGORIA[cong.categoria]) : MENSALIDADE_POR_CATEGORIA.Bronze;
	}
	function quitadoNoMes(obreiroId) {
		return pagamentos.find((p) => p.obreiro_id === obreiroId && p.referencia === referencia && p.status === "pago");
	}
	function situacaoDe(obreiro) {
		if (quitadoNoMes(obreiro.id)) return "pago";
		return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) > vencimento ? "vencido" : "pendente";
	}
	const registrar = useMutation({
		mutationFn: async (obreiro) => {
			const valor = mensalidadeDe(obreiro);
			const { error } = await supabase.from("pagamentos").insert({
				obreiro_id: obreiro.id,
				valor,
				data: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				status: "pago",
				referencia
			});
			if (error) throw error;
			const { error: erroObreiro } = await supabase.from("obreiros").update({ status_pagamento: "pago" }).eq("id", obreiro.id);
			if (erroObreiro) throw erroObreiro;
		},
		onSuccess: () => {
			toast.success("Pagamento registrado e mensalidade quitada.");
			queryClient.invalidateQueries({ queryKey: ["tesouraria"] });
			queryClient.invalidateQueries({ queryKey: ["painel"] });
			queryClient.invalidateQueries({ queryKey: ["obreiros"] });
		},
		onError: (e) => toast.error(e.message)
	});
	async function exportarRelatorio() {
		try {
			const resumo = resumoPorCategoria(referencia, congregacoes, obreiros, pagamentos, mensalidadeDe);
			await gerarRelatorioMensalPDF(referencia, resumo);
			toast.success("Relatório mensal gerado em PDF.");
		} catch (erro) {
			toast.error(erro.message);
		}
	}
	async function emitirRecibo(pagamento, obreiro) {
		try {
			const cong = congregacoes.find((c) => c.id === obreiro.congregacao_id);
			await gerarReciboPDF(pagamento, obreiro, cong);
			toast.success("Recibo emitido em PDF.");
		} catch (erro) {
			toast.error(erro.message);
		}
	}
	if (!carregando && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Mensalidades e Pagamentos",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "plate p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-registro",
				children: "Acesso restrito"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-2xl",
				children: "Somente a tesouraria pode lançar baixas"
			})]
		})
	});
	const filtrados = obreiros.filter((o) => o.nome.toLowerCase().includes(busca.toLowerCase()));
	const inadimplentes = obreiros.filter((o) => situacaoDe(o) !== "pago");
	const arrecadadoMes = pagamentos.filter((p) => p.referencia === referencia && p.status === "pago").reduce((soma, p) => soma + Number(p.valor), 0);
	const obreiroHistorico = obreiros.find((o) => o.id === historico);
	const listaHistorico = pagamentos.filter((p) => p.obreiro_id === historico);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		titulo: "Mensalidades e Pagamentos",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-6 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plate p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "label-registro",
								children: ["Referência ", referencia]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-3xl",
								children: brl(arrecadadoMes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-[10px] text-muted-foreground",
								children: ["Vencimento em ", dataBR(vencimento)]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plate p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-registro",
								children: "Inadimplentes do mês"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-3xl",
								children: inadimplentes.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-[10px] text-muted-foreground",
								children: [
									"de ",
									obreiros.length,
									" obreiros filiados"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plate p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-registro",
								children: "Previsto no mês"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-3xl",
								children: brl(obreiros.reduce((s, o) => s + mensalidadeDe(o), 0))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-[10px] text-muted-foreground",
								children: "Conforme Art. 7º"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-sm font-semibold uppercase tracking-widest",
						children: [
							"Mensalidades (",
							filtrados.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: exportarRelatorio,
							className: "border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground",
							children: "Relatório mensal (PDF)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: busca,
							onChange: (e) => setBusca(e.target.value),
							placeholder: "Buscar obreiro",
							className: "w-48 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Obreiro" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Registro" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Referência" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Vencimento" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Valor" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Situação" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Ações" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "text-sm",
							children: [filtrados.map((o) => {
								const situacao = situacaoDe(o);
								const quitado = quitadoNoMes(o.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "transition-colors hover:bg-secondary/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
											className: "font-medium",
											children: o.nome
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
											className: "font-mono text-[11px] text-muted-foreground",
											children: o.registro
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
											className: "font-mono text-[11px]",
											children: referencia
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
											className: "text-muted-foreground",
											children: dataBR(vencimento)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: brl(mensalidadeDe(o)) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2 py-0.5 text-[10px] uppercase ${situacaoClasses(situacao)}`,
											children: SITUACAO_LABEL[situacao]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [quitado ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] uppercase tracking-widest text-muted-foreground",
												children: ["Quitado em ", dataBR(quitado.data)]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => void emitirRecibo(quitado, o),
												className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary",
												children: "Recibo"
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => registrar.mutate(o),
												disabled: registrar.isPending,
												className: "bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50",
												children: "Registrar pagamento"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setHistorico(o.id),
												className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary",
												children: "Histórico"
											})]
										}) })
									]
								}, o.id);
							}), filtrados.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "px-6 py-10 text-center text-sm text-muted-foreground",
								children: "Nenhum obreiro encontrado."
							}) })]
						})]
					})
				})]
			}),
			obreiroHistorico && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Histórico de contribuições"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mt-1 font-display text-xl",
						children: obreiroHistorico.nome
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setHistorico(null),
						className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary",
						children: "Fechar"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Referência" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Data" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Valor" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "text-sm",
							children: [listaHistorico.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "transition-colors hover:bg-secondary/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
										className: "font-mono text-[11px]",
										children: p.referencia
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
										className: "text-muted-foreground",
										children: dataBR(p.data)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: brl(Number(p.valor)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 text-[10px] uppercase ${statusClasses(p.status)}`,
										children: STATUS_LABEL[p.status]
									}) })
								]
							}, p.id)), listaHistorico.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 4,
								className: "px-6 py-10 text-center text-sm text-muted-foreground",
								children: "Nenhuma contribuição registrada."
							}) })]
						})]
					})
				})]
			})
		]
	});
}
function Th({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "label-registro border-b border-border px-6 py-3 font-normal",
		children
	});
}
function Td({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: `border-b border-border/60 px-6 py-4 ${className}`,
		children
	});
}
//#endregion
export { Pagamentos as component };
