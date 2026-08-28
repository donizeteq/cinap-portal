import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as brl, n as CATEGORIAS, o as categoriaClasses, r as MENSALIDADE_POR_CATEGORIA } from "./cinap-PoyC-pfo.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/congregacoes-D1wM815n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VAZIO = {
	nome: "",
	categoria: "Bronze",
	qdt_obreiros: 0,
	cidade: "",
	estado: "",
	ativa: true
};
function Congregacoes() {
	const { isAdmin, carregando } = usePapel();
	const queryClient = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({ ...VAZIO });
	const [editando, setEditando] = (0, import_react.useState)(null);
	const lista = useQuery({
		queryKey: ["congregacoes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("congregacoes").select("*").order("nome");
			if (error) throw error;
			return data;
		}
	});
	const salvar = useMutation({
		mutationFn: async () => {
			const payload = {
				...form,
				qdt_obreiros: Number(form.qdt_obreiros)
			};
			if (editando) {
				const { error } = await supabase.from("congregacoes").update(payload).eq("id", editando);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("congregacoes").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success(editando ? "Congregação atualizada." : "Congregação registrada.");
			setForm({ ...VAZIO });
			setEditando(null);
			queryClient.invalidateQueries({ queryKey: ["congregacoes"] });
			queryClient.invalidateQueries({ queryKey: ["painel"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const excluir = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("congregacoes").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Registro removido do arquivo.");
			queryClient.invalidateQueries({ queryKey: ["congregacoes"] });
			queryClient.invalidateQueries({ queryKey: ["painel"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!carregando && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Congregações",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "plate p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-registro",
				children: "Acesso restrito"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-2xl",
				children: "Somente a secretaria pode gerenciar"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Congregações Registradas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-10 lg:grid-cols-[1fr_340px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-6 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-sm font-semibold uppercase tracking-widest",
						children: [
							"Unidades filiadas (",
							lista.data?.length ?? 0,
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Nome" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Localidade" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Categoria" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Obreiros" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Mensalidade" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Ações" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "text-sm",
							children: (lista.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "transition-colors hover:bg-secondary/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
										className: "font-medium",
										children: [c.nome, !c.ativa && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 font-mono text-[9px] uppercase text-muted-foreground",
											children: "inativa"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
										className: "text-muted-foreground",
										children: [
											c.cidade,
											"/",
											c.estado
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 text-[10px] font-bold uppercase ${categoriaClasses(c.categoria)}`,
										children: c.categoria
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
										className: "text-muted-foreground",
										children: c.qdt_obreiros
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: brl(Number(c.valor_mensalidade)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "text-primary hover:underline",
											onClick: () => {
												setEditando(c.id);
												setForm({
													nome: c.nome,
													categoria: c.categoria,
													qdt_obreiros: c.qdt_obreiros,
													cidade: c.cidade,
													estado: c.estado,
													ativa: c.ativa
												});
											},
											children: "Editar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "text-destructive hover:underline",
											onClick: () => excluir.mutate(c.id),
											children: "Excluir"
										})]
									}) })
								]
							}, c.id))
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "h-fit border border-border bg-surface p-6",
				onSubmit: (e) => {
					e.preventDefault();
					salvar.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: editando ? "Editar registro" : "Novo registro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mt-1 font-display text-2xl",
						children: "Congregação"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
								rotulo: "Denominação",
								value: form.nome,
								onChange: (v) => setForm({
									...form,
									nome: v
								}),
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[1fr_80px] gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									rotulo: "Cidade",
									value: form.cidade,
									onChange: (v) => setForm({
										...form,
										cidade: v
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									rotulo: "UF",
									value: form.estado,
									onChange: (v) => setForm({
										...form,
										estado: v.toUpperCase().slice(0, 2)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-registro",
									children: "Categoria (Art. 7º)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: form.categoria,
									onChange: (e) => setForm({
										...form,
										categoria: e.target.value
									}),
									className: "border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary",
									children: CATEGORIAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c,
										children: [
											c,
											" — ",
											brl(MENSALIDADE_POR_CATEGORIA[c])
										]
									}, c))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
								rotulo: "Quantidade de obreiros",
								type: "number",
								value: String(form.qdt_obreiros),
								onChange: (v) => setForm({
									...form,
									qdt_obreiros: Number(v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.ativa,
									onChange: (e) => setForm({
										...form,
										ativa: e.target.checked
									})
								}), "Congregação ativa"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-dashed border-border pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label-registro",
										children: "Mensalidade automática"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-2xl",
										children: brl(MENSALIDADE_POR_CATEGORIA[form.categoria])
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: salvar.isPending,
								className: "w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60",
								children: editando ? "Salvar alterações" : "Registrar congregação"
							}),
							editando && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setEditando(null);
									setForm({ ...VAZIO });
								},
								className: "w-full text-xs text-muted-foreground hover:text-primary",
								children: "Cancelar edição"
							})
						]
					})
				]
			})]
		})
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
function Campo({ rotulo, value, onChange, type = "text", required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-registro",
			children: rotulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			required,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
		})]
	});
}
//#endregion
export { Congregacoes as component };
