import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { CONFIG_PADRAO, VARIAVEIS_DISPONIVEIS } from "./cinap-alertas-DsjZy6q1.mjs";
import { l as previewEmailAviso, u as salvarConfigAlertas } from "./alertas.functions-DtO_z1x5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/templates-email-D7nuOkWU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var campo = "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function TemplatesEmail() {
	const { isAdmin, carregando } = usePapel();
	const queryClient = useQueryClient();
	const salvar = useServerFn(salvarConfigAlertas);
	const preview = useServerFn(previewEmailAviso);
	const [form, setForm] = (0, import_react.useState)(CONFIG_PADRAO);
	const [tipo, setTipo] = (0, import_react.useState)("vencimento");
	const [html, setHtml] = (0, import_react.useState)("");
	const [assuntoPreview, setAssuntoPreview] = (0, import_react.useState)("");
	const config = useQuery({
		queryKey: ["config-alertas"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("config_alertas").select("*").eq("id", true).maybeSingle();
			if (error) throw error;
			return {
				...CONFIG_PADRAO,
				...data ?? {}
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (config.data) setForm(config.data);
	}, [config.data]);
	const gravar = useMutation({
		mutationFn: async () => await salvar({ data: {
			assunto_vencimento: form.assunto_vencimento,
			corpo_vencimento: form.corpo_vencimento,
			assunto_atraso: form.assunto_atraso,
			corpo_atraso: form.corpo_atraso,
			rodape_email: form.rodape_email
		} }),
		onSuccess: () => {
			toast.success("Templates de e-mail salvos");
			queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const visualizar = useMutation({
		mutationFn: async () => await preview({ data: {
			tipo,
			assunto: tipo === "vencimento" ? form.assunto_vencimento : form.assunto_atraso,
			corpo: tipo === "vencimento" ? form.corpo_vencimento : form.corpo_atraso,
			rodape: form.rodape_email,
			remetente_nome: form.remetente_nome
		} }),
		onSuccess: (r) => {
			setHtml(r.html);
			setAssuntoPreview(r.assunto);
		},
		onError: (e) => toast.error(e.message)
	});
	if (carregando) return null;
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Templates de e-mail",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Área restrita à Secretaria Geral."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		titulo: "Templates dos e-mails de aviso",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "plate p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Qual aviso deseja editar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["vencimento", "atraso"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTipo(t),
							className: `border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest ${tipo === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`,
							children: t === "vencimento" ? "Vencimento" : "Atraso"
						}, t))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-widest text-muted-foreground",
							children: ["Assunto do e-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: campo,
								value: tipo === "vencimento" ? form.assunto_vencimento : form.assunto_atraso,
								onChange: (e) => setForm(tipo === "vencimento" ? {
									...form,
									assunto_vencimento: e.target.value
								} : {
									...form,
									assunto_atraso: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-widest text-muted-foreground",
							children: ["Corpo da mensagem (uma linha por parágrafo)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 6,
								className: `${campo} font-mono text-xs leading-relaxed`,
								value: tipo === "vencimento" ? form.corpo_vencimento : form.corpo_atraso,
								onChange: (e) => setForm(tipo === "vencimento" ? {
									...form,
									corpo_vencimento: e.target.value
								} : {
									...form,
									corpo_atraso: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-widest text-muted-foreground",
							children: ["Rodapé padrão", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: campo,
								value: form.rodape_email,
								onChange: (e) => setForm({
									...form,
									rodape_email: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Marcadores:"
					}), VARIAVEIS_DISPONIVEIS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "border border-border bg-background px-2 py-1 font-mono text-[10px]",
						children: v
					}, v))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => gravar.mutate(),
						disabled: gravar.isPending,
						className: "border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50",
						children: gravar.isPending ? "Salvando..." : "Salvar templates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => visualizar.mutate(),
						disabled: visualizar.isPending,
						className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50",
						children: visualizar.isPending ? "Gerando..." : "Pré-visualizar"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "plate p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-registro",
				children: "Pré-visualização"
			}), html ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-registro",
					children: "Assunto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block font-medium",
					children: assuntoPreview
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: "Pré-visualização do e-mail",
				srcDoc: html,
				className: "mt-4 h-[620px] w-full border border-border bg-white"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Clique em “Pré-visualizar” para ver o e-mail com dados de exemplo antes do envio."
			})]
		})]
	});
}
//#endregion
export { TemplatesEmail as component };
