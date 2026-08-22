import { i as __toESM } from "../_runtime.mjs";
import { k as isRedirect, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-UH_Jp6hR.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-xGsVRDVx.mjs";
import { s as dataBR } from "./cinap-PoyC-pfo.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-DW99jdga.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agentes-BxWU9yvY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listarChavesAgente = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4dacb3b552407cc8f7269dec5dae4a7340e932142bec4540d0d1d9287c39727c"));
var criarChaveAgente = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("c7cdd08b96f03e3bf2a72bbc061fc55d7ed63ce62f0176da731015a049cc7a78"));
var alternarChaveAgente = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("154c5f42472fa31a4d736e577763fc4c30f442f6e467787a5e3aabc828772f93"));
var excluirChaveAgente = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("30590d93081144bdc7679df9de369857ded610ac106c8047f3a81620d8c235f5"));
function Agentes() {
	const { isAdmin, carregando } = usePapel();
	const queryClient = useQueryClient();
	const [nome, setNome] = (0, import_react.useState)("");
	const [permissoes, setPermissoes] = (0, import_react.useState)(["read"]);
	const [chaveGerada, setChaveGerada] = (0, import_react.useState)(null);
	const listar = useServerFn(listarChavesAgente);
	const criar = useServerFn(criarChaveAgente);
	const alternar = useServerFn(alternarChaveAgente);
	const excluir = useServerFn(excluirChaveAgente);
	const chaves = useQuery({
		queryKey: ["agent-keys"],
		queryFn: () => listar(),
		enabled: isAdmin
	});
	const criarMutation = useMutation({
		mutationFn: async () => criar({ data: {
			nome,
			permissoes
		} }),
		onSuccess: (dados) => {
			setChaveGerada(dados);
			setNome("");
			setPermissoes(["read"]);
			queryClient.invalidateQueries({ queryKey: ["agent-keys"] });
			toast.success("Chave de API gerada. Copie-a agora — ela não será exibida novamente.");
		},
		onError: (e) => toast.error(e.message)
	});
	const alternarMutation = useMutation({
		mutationFn: async ({ id, ativa }) => alternar({ data: {
			id,
			ativa
		} }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agent-keys"] });
			toast.success("Status da chave atualizado.");
		},
		onError: (e) => toast.error(e.message)
	});
	const excluirMutation = useMutation({
		mutationFn: async (id) => excluir({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agent-keys"] });
			toast.success("Chave removida.");
		},
		onError: (e) => toast.error(e.message)
	});
	function togglePermissao(p) {
		setPermissoes((atuais) => atuais.includes(p) ? atuais.filter((x) => x !== p) : [...atuais, p]);
	}
	async function copiar(texto) {
		await navigator.clipboard.writeText(texto);
		toast.success("Chave copiada para a área de transferência.");
	}
	if (!carregando && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Agentes Externos",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "plate p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-registro",
				children: "Acesso restrito"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-2xl",
				children: "Somente a secretaria pode gerenciar chaves de API"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Agentes Externos",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-10 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-6 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-sm font-semibold uppercase tracking-widest",
						children: [
							"Chaves de API (",
							chaves.data?.length ?? 0,
							")"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-[10px] font-semibold uppercase tracking-widest",
									children: "Nome"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-[10px] font-semibold uppercase tracking-widest",
									children: "Permissões"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-[10px] font-semibold uppercase tracking-widest",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-[10px] font-semibold uppercase tracking-widest",
									children: "Último uso"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-[10px] font-semibold uppercase tracking-widest",
									children: "Criada em"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-[10px] font-semibold uppercase tracking-widest",
									children: "Ações"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [chaves.data?.map((chave) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-sm font-medium",
									children: chave.nome
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-sm",
									children: chave.permissoes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-1 inline-block border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider",
										children: p === "read" ? "Leitura" : "Escrita"
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: chave.ativa ? "inline-block bg-success/10 px-2 py-0.5 text-[10px] text-success" : "inline-block bg-muted px-2 py-0.5 text-[10px] text-muted-foreground",
										children: chave.ativa ? "Ativa" : "Desativada"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-sm text-muted-foreground",
									children: chave.ultimo_uso ? dataBR(chave.ultimo_uso) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-sm text-muted-foreground",
									children: dataBR(chave.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => alternarMutation.mutate({
												id: chave.id,
												ativa: !chave.ativa
											}),
											disabled: alternarMutation.isPending,
											className: "text-[10px] uppercase tracking-widest text-primary hover:underline",
											children: chave.ativa ? "Desativar" : "Ativar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => excluirMutation.mutate(chave.id),
											disabled: excluirMutation.isPending,
											className: "text-[10px] uppercase tracking-widest text-destructive hover:underline",
											children: "Remover"
										})]
									})
								})
							]
						}, chave.id)), chaves.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-6 py-10 text-center text-sm text-muted-foreground",
							children: "Nenhuma chave de API registrada."
						}) })] })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold uppercase tracking-widest",
							children: "Nova chave"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Crie uma chave para o agente Hermes ou outro sistema integrado."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label-registro",
										children: "Identificação"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: nome,
										onChange: (e) => setNome(e.target.value),
										placeholder: "Ex: Hermes Produção",
										className: "w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-registro",
									children: "Permissões"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: permissoes.includes("read"),
											onChange: () => togglePermissao("read"),
											className: "h-4 w-4 accent-primary"
										}), "Leitura (consultar dados e relatórios)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: permissoes.includes("write"),
											onChange: () => togglePermissao("write"),
											className: "h-4 w-4 accent-primary"
										}), "Escrita (criar congregações, obreiros e registrar pagamentos)"]
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => criarMutation.mutate(),
									disabled: !nome || permissoes.length === 0 || criarMutation.isPending,
									className: "w-full bg-primary py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60",
									children: criarMutation.isPending ? "Gerando…" : "Gerar chave"
								})
							]
						})
					]
				}), chaveGerada && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-primary/30 bg-primary/5 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold uppercase tracking-widest text-primary",
							children: "Chave gerada"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Copie e armazene em segurança. A chave só é exibida uma vez."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 break-all rounded border border-border bg-background p-3 font-mono text-xs",
							children: chaveGerada.chave
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => copiar(chaveGerada.chave),
							className: "mt-4 w-full border border-border bg-surface py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary",
							children: "Copiar chave"
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { Agentes as component };
