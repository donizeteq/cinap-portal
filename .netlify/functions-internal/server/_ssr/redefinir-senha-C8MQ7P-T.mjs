import { o as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/redefinir-senha-C8MQ7P-T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RedefinirSenha() {
	const navigate = useNavigate();
	const [pronto, setPronto] = (0, import_react.useState)(false);
	const [senha, setSenha] = (0, import_react.useState)("");
	const [confirmacao, setConfirmacao] = (0, import_react.useState)("");
	const [enviando, setEnviando] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setPronto(Boolean(data.session)));
		const { data } = supabase.auth.onAuthStateChange((_e, s) => setPronto(Boolean(s)));
		return () => data.subscription.unsubscribe();
	}, []);
	async function salvar(e) {
		e.preventDefault();
		if (senha.length < 6) {
			toast.error("A senha deve ter ao menos 6 caracteres.");
			return;
		}
		if (senha !== confirmacao) {
			toast.error("As senhas não coincidem.");
			return;
		}
		setEnviando(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: senha });
			if (error) throw error;
			toast.success("Senha redefinida com sucesso.");
			navigate({
				to: "/painel",
				replace: true
			});
		} catch (erro) {
			toast.error(erro instanceof Error ? erro.message : "Não foi possível redefinir a senha.");
		} finally {
			setEnviando(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold uppercase italic tracking-tight text-primary",
					children: "CINAP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 font-display text-3xl",
					children: "Nova senha"
				}),
				pronto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: salvar,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-registro",
								children: "Nova senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: senha,
								onChange: (e) => setSenha(e.target.value),
								className: "w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-registro",
								children: "Confirmar senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: confirmacao,
								onChange: (e) => setConfirmacao(e.target.value),
								className: "w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: enviando,
							className: "w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60",
							children: enviando ? "Salvando…" : "Salvar nova senha"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Abra esta página pelo link enviado ao seu e-mail para redefinir a senha. Se o link expirou, solicite uma nova recuperação na tela de acesso."
				})
			]
		})
	});
}
//#endregion
export { RedefinirSenha as component };
