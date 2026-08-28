import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { CONFIG_PADRAO } from "./cinap-alertas-DsjZy6q1.mjs";
import { u as salvarConfigAlertas } from "./alertas.functions-DtO_z1x5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-FygNKvhb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var campo = "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Configuracoes() {
	const { isAdmin, carregando } = usePapel();
	const queryClient = useQueryClient();
	const salvar = useServerFn(salvarConfigAlertas);
	const [form, setForm] = (0, import_react.useState)(CONFIG_PADRAO);
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
			dia_vencimento: Number(form.dia_vencimento),
			dias_antes_aviso: Number(form.dias_antes_aviso),
			meses_intervalo_atraso: Number(form.meses_intervalo_atraso)
		} }),
		onSuccess: () => {
			toast.success("Parâmetros de cobrança salvos");
			queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (carregando) return null;
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Configurações",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Área restrita à Secretaria Geral."
		})
	});
	const niveis = [
		1,
		2,
		3
	].map((n) => Number(form.meses_intervalo_atraso || 1) * n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		titulo: "Configurações de cobrança",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plate p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Vencimento das contribuições"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-widest text-muted-foreground",
							children: ["Dia do vencimento (1 a 28)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 28,
								className: campo,
								value: form.dia_vencimento,
								onChange: (e) => setForm({
									...form,
									dia_vencimento: Number(e.target.value)
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-widest text-muted-foreground",
							children: ["Avisar quantos dias antes do vencimento", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								max: 20,
								className: campo,
								value: form.dias_antes_aviso,
								onChange: (e) => setForm({
									...form,
									dias_antes_aviso: Number(e.target.value)
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: [
							"A mensalidade estatutária (Art. 7º) vence todo dia ",
							form.dia_vencimento,
							" e o aviso prévio é emitido ",
							form.dias_antes_aviso,
							" dia(s) antes."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plate p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Níveis de atraso"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-widest text-muted-foreground",
							children: ["Repetir cobrança a cada X meses de atraso", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 12,
								className: campo,
								value: form.meses_intervalo_atraso,
								onChange: (e) => setForm({
									...form,
									meses_intervalo_atraso: Number(e.target.value)
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-3 md:grid-cols-3",
						children: niveis.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-background p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "label-registro",
									children: ["Nível ", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-display text-2xl",
									children: [
										m,
										" ",
										m === 1 ? "mês" : "meses"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: i === 0 ? "Primeiro aviso de inadimplência." : i === 1 ? "Reforço de cobrança à congregação." : "Situação crítica — avaliar suspensão da credencial."
								})
							]
						}, m))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "plate p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => gravar.mutate(),
						disabled: gravar.isPending,
						className: "border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50",
						children: gravar.isPending ? "Salvando..." : "Salvar parâmetros"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Remetente de e-mail, disparo e auditoria continuam na tela de Alertas."
					})]
				})
			})
		]
	});
}
//#endregion
export { Configuracoes as component };
