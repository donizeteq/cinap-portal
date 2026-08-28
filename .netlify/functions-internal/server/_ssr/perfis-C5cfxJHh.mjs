import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as listarPerfisAcesso, n as definirPapelAcesso } from "./alertas.functions-DtO_z1x5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfis-C5cfxJHh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Perfis() {
	const { isAdmin, carregando, userId } = usePapel();
	const queryClient = useQueryClient();
	const listar = useServerFn(listarPerfisAcesso);
	const definir = useServerFn(definirPapelAcesso);
	const [busca, setBusca] = (0, import_react.useState)("");
	const usuarios = useQuery({
		queryKey: ["perfis-acesso"],
		enabled: isAdmin,
		queryFn: async () => await listar({ data: void 0 })
	});
	const alterar = useMutation({
		mutationFn: async (v) => await definir({ data: v }),
		onSuccess: () => {
			toast.success("Perfil de acesso atualizado");
			queryClient.invalidateQueries({ queryKey: ["perfis-acesso"] });
			queryClient.invalidateQueries({ queryKey: ["papel"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (carregando) return null;
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Perfis de acesso",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Área restrita à Secretaria Geral."
		})
	});
	const termo = busca.trim().toLowerCase();
	const lista = (usuarios.data ?? []).filter((u) => !termo || `${u.nome} ${u.email} ${u.registro ?? ""}`.toLowerCase().includes(termo));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Perfis de acesso",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "plate p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro",
					children: "Secretaria Geral e obreiros"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "A Secretaria Geral visualiza e gerencia avisos, obreiros, congregações e a tesouraria de toda a Convenção. O obreiro acessa apenas o próprio registro, sua congregação e seus avisos."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full max-w-xs border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
					placeholder: "Buscar por nome, e-mail ou registro",
					value: busca,
					onChange: (e) => setBusca(e.target.value)
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
								children: "Usuário"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "E-mail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Verificado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Perfil"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Último acesso"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Ação"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [lista.map((u) => {
						const admin = u.papeis.includes("admin");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 pr-4",
									children: [u.nome || "—", u.registro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block font-mono text-[10px] text-muted-foreground",
										children: u.registro
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-xs",
									children: u.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-xs",
									children: u.confirmado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "Sim"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "Pendente"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "border border-border px-2 py-1 text-[10px] uppercase tracking-widest",
										children: admin ? "Secretaria Geral" : "Obreiro"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 font-mono text-[11px] text-muted-foreground",
									children: u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleString("pt-BR") : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: alterar.isPending || admin && u.id === userId,
										onClick: () => alterar.mutate({
											userId: u.id,
											papel: "admin",
											conceder: !admin
										}),
										className: "border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40",
										children: admin ? "Remover Secretaria" : "Tornar Secretaria"
									})
								})
							]
						}, u.id);
					}), lista.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "py-6 text-sm text-muted-foreground",
						children: usuarios.isLoading ? "Consultando arquivo…" : "Nenhum usuário encontrado."
					}) })] })]
				})
			})]
		})
	});
}
//#endregion
export { Perfis as component };
