import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as brl, c as referenciaAtual, i as STATUS_LABEL, l as statusClasses, s as dataBR } from "./cinap-PoyC-pfo.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as gerarRelatorioMensalPDF, r as resumoPorCategoria } from "./cinap-pdf-FdMTTRNB.mjs";
import { a as CircleCheckBig, i as Clock, n as Eye, o as Briefcase, r as Download, t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as CartesianGrid, c as Cell, d as Legend, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel-DvdP-AD3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Painel() {
	const { isAdmin, carregando } = usePapel();
	const refAtual = referenciaAtual();
	const [mesAno, setMesAno] = (0, import_react.useState)(refAtual);
	const [categoriaFiltro, setCategoriaFiltro] = (0, import_react.useState)("Todas");
	const [altoContraste, setAltoContraste] = (0, import_react.useState)(false);
	const dados = useQuery({
		queryKey: ["painel"],
		enabled: isAdmin,
		queryFn: async () => {
			const [c, o, p] = await Promise.all([
				supabase.from("congregacoes").select("*").order("nome"),
				supabase.from("obreiros").select("*").order("nome"),
				supabase.from("pagamentos").select("*").order("data", { ascending: false })
			]);
			if (c.error) throw c.error;
			if (o.error) throw o.error;
			if (p.error) throw p.error;
			return {
				congregacoes: c.data,
				obreiros: o.data,
				pagamentos: p.data
			};
		}
	});
	const { congregacoes, obreiros, pagamentos } = dados.data ?? {
		congregacoes: [],
		obreiros: [],
		pagamentos: []
	};
	const congregacoesFiltradas = (0, import_react.useMemo)(() => {
		return categoriaFiltro === "Todas" ? congregacoes : congregacoes.filter((c) => c.categoria === categoriaFiltro);
	}, [congregacoes, categoriaFiltro]);
	const obreirosFiltrados = (0, import_react.useMemo)(() => {
		const idsCongs = new Set(congregacoesFiltradas.map((c) => c.id));
		return obreiros.filter((o) => o.congregacao_id && idsCongs.has(o.congregacao_id));
	}, [obreiros, congregacoesFiltradas]);
	const pagamentosDoMes = (0, import_react.useMemo)(() => {
		const idsObreiros = new Set(obreirosFiltrados.map((o) => o.id));
		return pagamentos.filter((p) => p.referencia === mesAno && idsObreiros.has(p.obreiro_id));
	}, [
		pagamentos,
		mesAno,
		obreirosFiltrados
	]);
	const obreirosInadimplentes = (0, import_react.useMemo)(() => {
		const idsPagos = new Set(pagamentosDoMes.filter((p) => p.status === "pago").map((p) => p.obreiro_id));
		return obreirosFiltrados.filter((o) => !idsPagos.has(o.id));
	}, [obreirosFiltrados, pagamentosDoMes]);
	const resumo = (0, import_react.useMemo)(() => {
		return resumoPorCategoria(mesAno, congregacoes, obreiros, pagamentos, (o) => {
			const c = congregacoes.find((c) => c.id === o.congregacao_id);
			if (!c) return 0;
			switch (c.categoria) {
				case "Ouro": return 60;
				case "Prata": return 50;
				case "Bronze": return 40;
				default: return 0;
			}
		}).filter((r) => categoriaFiltro === "Todas" || r.categoria === categoriaFiltro);
	}, [
		mesAno,
		congregacoes,
		obreiros,
		pagamentos,
		categoriaFiltro
	]);
	const totalArrecadado = resumo.reduce((acc, r) => acc + r.arrecadado, 0);
	const totalPrevisto = resumo.reduce((acc, r) => acc + r.previsto, 0);
	const adimplenciaMedia = totalPrevisto > 0 ? totalArrecadado / totalPrevisto * 100 : 0;
	const colors = altoContraste ? {
		primary: "#000000",
		secondary: "#444444",
		alert: "#E60000",
		success: "#008A00",
		background: "#FFFFFF",
		text: "#000000"
	} : {
		primary: "#743621",
		secondary: "#E2B185",
		alert: "#B72A2A",
		success: "#2E8B57",
		background: "#F9F8F3",
		text: "#333333"
	};
	const pieData = resumo.map((r) => ({
		name: r.categoria,
		value: r.arrecadado
	}));
	const PIE_COLORS = altoContraste ? [
		"#000",
		"#444",
		"#777"
	] : [
		"#E2B185",
		"#A64A2F",
		"#522617"
	];
	if (!carregando && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Painel de Controle Institucional",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "plate p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro",
					children: "Acesso restrito"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 font-display text-2xl",
					children: "Área exclusiva da secretaria"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
					children: "Seu acesso é de obreiro. Consulte sua situação cadastral e financeira na área pessoal."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/minha-situacao",
					className: "mt-6 inline-flex bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground",
					children: "Minha situação"
				})
			]
		})
	});
	const exportarRelatorio = () => {
		gerarRelatorioMensalPDF(mesAno, resumo);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		titulo: "Painel de Controle Institucional",
		acoes: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row gap-4 items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border border-border bg-surface px-3 py-1.5 rounded-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase font-bold text-muted-foreground tracking-widest",
						children: "Referência:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "month",
						value: mesAno.replace("/", "-").split("-").reverse().join("-"),
						onChange: (e) => {
							const parts = e.target.value.split("-");
							if (parts.length === 2) setMesAno(`${parts[1]}/${parts[0]}`);
						},
						className: "bg-transparent text-sm font-mono outline-none text-foreground"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: categoriaFiltro,
					onChange: (e) => setCategoriaFiltro(e.target.value),
					className: "border border-border bg-surface px-3 py-2 text-sm uppercase tracking-wider font-semibold rounded-sm outline-none focus:border-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Todas",
							children: "Todas as Categorias"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Bronze",
							children: "Congregações Bronze"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Prata",
							children: "Congregações Prata"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Ouro",
							children: "Congregações Ouro"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: exportarRelatorio,
					className: "inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors rounded-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " Relatório PDF"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAltoContraste(!altoContraste),
					className: "inline-flex items-center gap-2 bg-surface border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary/20 transition-colors rounded-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 }), " Contraste"]
				})
			]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-3 mb-6",
				style: { color: colors.text },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plate flex flex-col p-6",
						style: { backgroundColor: colors.background },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-registro",
								children: "TOTAL ARRECADADO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-4xl font-display font-medium",
								style: { color: colors.primary },
								children: dados.isPending ? "..." : brl(totalArrecadado)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									"de ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: brl(totalPrevisto)
									}),
									" previsto"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto pt-6 flex items-center justify-between border-t border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: "Adimplência Geral"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `px-2 py-1 text-xs font-bold ${adimplenciaMedia >= 80 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`,
									children: [adimplenciaMedia.toFixed(1), "%"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plate flex flex-col p-6",
						style: { backgroundColor: colors.background },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-registro",
								children: "CONGREGAÇÕES ATIVAS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-4xl font-display font-medium",
								style: { color: colors.primary },
								children: dados.isPending ? "..." : congregacoesFiltradas.length
							}),
							categoriaFiltro === "Todas" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground flex gap-3 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [congregacoesFiltradas.filter((c) => c.categoria === "Bronze").length, " Bronze"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [congregacoesFiltradas.filter((c) => c.categoria === "Prata").length, " Prata"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [congregacoesFiltradas.filter((c) => c.categoria === "Ouro").length, " Ouro"] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-auto pt-6 border-t border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/congregacoes",
									className: "text-sm font-semibold hover:underline flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { size: 16 }), " Gerenciar"]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plate flex flex-col p-6",
						style: { backgroundColor: colors.background },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "label-registro text-red-700 font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 16 }), " INADIMPLENTES DO MÊS"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-4xl font-display font-medium",
								style: { color: colors.alert },
								children: dados.isPending ? "..." : obreirosInadimplentes.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs uppercase text-red-700/80",
								children: ["obreiros pendentes em ", mesAno]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-auto pt-6 border-t border-red-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/pagamentos",
									className: "text-sm font-bold text-red-700 hover:underline flex items-center gap-2",
									children: "Regularizar Pendências"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "plate p-6",
					style: { backgroundColor: colors.background },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold uppercase tracking-widest",
						style: { color: colors.text },
						children: "Arrecadação por Categoria"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 300,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: resumo,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 20
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									opacity: .3
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "categoria",
									tick: {
										fill: colors.text,
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
									fill: colors.text,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "transparent" },
									contentStyle: {
										backgroundColor: colors.background,
										borderColor: colors.primary,
										color: colors.text
									},
									formatter: (v) => brl(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
									iconType: "circle",
									wrapperStyle: { paddingTop: 20 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "arrecadado",
									name: "Arrecadado",
									fill: colors.primary,
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "previsto",
									name: "Previsto (Meta)",
									fill: colors.secondary,
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "plate p-6",
					style: { backgroundColor: colors.background },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold uppercase tracking-widest",
						style: { color: colors.text },
						children: "Distribuição Arrecadatória"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 300,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: pieData,
								cx: "50%",
								cy: "50%",
								innerRadius: 60,
								outerRadius: 100,
								paddingAngle: 5,
								dataKey: "value",
								labelLine: false,
								children: pieData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								formatter: (v) => brl(v),
								contentStyle: {
									backgroundColor: colors.background,
									borderColor: colors.primary,
									color: colors.text
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								verticalAlign: "bottom",
								height: 36,
								iconType: "square"
							})
						] })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-surface mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-6 py-4 flex items-center gap-2 text-red-600 bg-red-50/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-sm font-bold uppercase tracking-widest",
						children: [
							"Atenção: Obreiros Inadimplentes (",
							mesAno,
							")"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: obreirosInadimplentes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center text-sm text-green-700 bg-green-50 flex flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { size: 32 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nenhuma inadimplência detectada no período selecionado." })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-secondary/30 text-xs text-muted-foreground uppercase tracking-widest",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Obreiro" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Congregação" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Registro Ministerial" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Ação Direta" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "text-sm",
							children: obreirosInadimplentes.map((o) => {
								const c = congregacoes.find((c) => c.id === o.congregacao_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "transition-colors hover:bg-secondary/50 border-b border-border/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
											className: "font-medium flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2 rounded-full bg-red-500 animate-pulse" }), o.nome]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c?.nome ?? "Não Vinculada" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
											className: "font-mono text-[11px] text-muted-foreground",
											children: o.registro
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/pagamentos",
											search: { obreiroId: o.id },
											className: "px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-200 transition-colors",
											children: "Lançar Pagamento"
										}) })
									]
								}, o.id);
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-6 py-4 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						size: 16,
						className: "text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold uppercase tracking-widest",
						children: "Últimas contribuições registradas"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Obreiro" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Referência" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Data" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Valor" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "text-sm",
							children: pagamentos.slice(0, 10).map((p) => {
								const obreiro = obreiros.find((o) => o.id === p.obreiro_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "transition-colors hover:bg-secondary/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
											className: "font-medium",
											children: obreiro?.nome ?? "—"
										}),
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
											className: `px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${statusClasses(p.status)}`,
											children: STATUS_LABEL[p.status]
										}) })
									]
								}, p.id);
							})
						})]
					})
				})]
			})
		]
	});
}
function Th({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "label-registro border-b border-border px-6 py-3 font-normal text-xs",
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
export { Painel as component };
