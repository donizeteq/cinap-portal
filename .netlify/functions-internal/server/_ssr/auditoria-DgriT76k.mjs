import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as baixarPlanilha } from "./cinap-planilha-CvVruSKt.mjs";
import { s as listarAuditoria } from "./alertas.functions-DtO_z1x5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditoria-DgriT76k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROTULOS = {
	"aviso.previa": "Prévia de avisos",
	"aviso.aprovar": "Aprovação de avisos",
	"aviso.agendar": "Agendamento de avisos",
	"aviso.cancelar": "Cancelamento de avisos",
	"aviso.envio": "Envio de avisos",
	"congregacao.criar": "Congregação criada",
	"congregacao.editar": "Congregação editada",
	"congregacao.excluir": "Congregação excluída",
	"obreiro.criar": "Obreiro registrado",
	"obreiro.editar": "Obreiro editado",
	"obreiro.excluir": "Obreiro excluído",
	"pagamento.registrar": "Pagamento registrado",
	"config.salvar": "Configurações alteradas",
	"papel.alterar": "Perfil de acesso alterado"
};
function Auditoria() {
	const { isAdmin, carregando } = usePapel();
	const listar = useServerFn(listarAuditoria);
	const [busca, setBusca] = (0, import_react.useState)("");
	const [acao, setAcao] = (0, import_react.useState)("todas");
	const [usuario, setUsuario] = (0, import_react.useState)("todos");
	const [de, setDe] = (0, import_react.useState)("");
	const [ate, setAte] = (0, import_react.useState)("");
	const registros = useQuery({
		queryKey: ["auditoria"],
		enabled: isAdmin,
		queryFn: async () => await listar({ data: { limite: 300 } })
	});
	const usuarios = (0, import_react.useMemo)(() => {
		const mapa = /* @__PURE__ */ new Map();
		for (const r of registros.data ?? []) {
			const chave = r.usuario_email || r.usuario_nome || "sistema";
			mapa.set(chave, r.usuario_nome || r.usuario_email || "Sistema");
		}
		return [...mapa.entries()].sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
	}, [registros.data]);
	const filtrados = (0, import_react.useMemo)(() => {
		const termo = busca.trim().toLowerCase();
		return (registros.data ?? []).filter((r) => {
			if (acao !== "todas" && !r.acao.startsWith(acao)) return false;
			if (usuario !== "todos" && (r.usuario_email || r.usuario_nome || "sistema") !== usuario) return false;
			const dia = r.created_at.slice(0, 10);
			if (de && dia < de) return false;
			if (ate && dia > ate) return false;
			if (!termo) return true;
			return `${r.usuario_nome} ${r.usuario_email} ${r.acao} ${r.entidade} ${r.descricao}`.toLowerCase().includes(termo);
		});
	}, [
		registros.data,
		busca,
		acao,
		usuario,
		de,
		ate
	]);
	if (carregando) return null;
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Auditoria",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Área restrita à Secretaria Geral."
		})
	});
	async function exportar(formato) {
		const linhas = [
			["CINAP - Auditoria da Secretaria Geral"],
			["Emitido em", (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")],
			[],
			[
				"Data",
				"Usuario",
				"E-mail",
				"Acao",
				"Area",
				"Descricao",
				"Detalhes"
			],
			...filtrados.map((r) => [
				new Date(r.created_at).toLocaleString("pt-BR"),
				r.usuario_nome || "-",
				r.usuario_email || "-",
				ROTULOS[r.acao] ?? r.acao,
				r.entidade,
				r.descricao,
				JSON.stringify(r.detalhes ?? {})
			])
		];
		await baixarPlanilha(formato, `cinap-auditoria-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`, "Auditoria", linhas);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Auditoria da Secretaria Geral",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "plate p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro",
					children: "Livro de registros"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Cada criação, edição, aprovação e envio realizado pela Secretaria Geral fica registrado com data, usuário responsável e detalhes da operação."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: acao,
							onChange: (e) => setAcao(e.target.value),
							className: "border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "todas",
									children: "Todas as ações"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "aviso",
									children: "Avisos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "congregacao",
									children: "Congregações"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "obreiro",
									children: "Obreiros"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pagamento",
									children: "Pagamentos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "config",
									children: "Configurações"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "papel",
									children: "Perfis de acesso"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: usuario,
							onChange: (e) => setUsuario(e.target.value),
							className: "border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "todos",
								children: "Todos os usuários"
							}), usuarios.map(([chave, nome]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: chave,
								children: nome
							}, chave))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: de,
							onChange: (e) => setDe(e.target.value),
							"aria-label": "Período inicial",
							className: "border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: ate,
							onChange: (e) => setAte(e.target.value),
							"aria-label": "Período final",
							className: "border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: busca,
							onChange: (e) => setBusca(e.target.value),
							placeholder: "Buscar obreiro, congregação ou descrição",
							className: "w-56 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void exportar("csv"),
							className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary",
							children: "CSV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void exportar("xlsx"),
							className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary",
							children: "XLSX"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Responsável"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Ação"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Área"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Detalhes"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtrados.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4 font-mono text-[11px] text-muted-foreground",
								children: new Date(r.created_at).toLocaleString("pt-BR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-3 pr-4",
								children: [r.usuario_nome || "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-[10px] text-muted-foreground",
									children: r.usuario_email || "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "border border-border px-2 py-1 text-[10px] uppercase tracking-widest",
									children: ROTULOS[r.acao] ?? r.acao
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4 text-xs uppercase tracking-widest text-muted-foreground",
								children: r.entidade
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-3 text-sm",
								children: [r.descricao, r.detalhes && Object.keys(r.detalhes).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-1 max-w-xl overflow-x-auto bg-secondary/40 p-2 font-mono text-[10px] text-muted-foreground",
									children: JSON.stringify(r.detalhes, null, 2)
								})]
							})
						]
					}, r.id)), filtrados.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "py-8 text-center text-sm text-muted-foreground",
						children: registros.isLoading ? "Consultando o livro…" : "Nenhum registro encontrado."
					}) })] })]
				})
			})]
		})
	});
}
//#endregion
export { Auditoria as component };
