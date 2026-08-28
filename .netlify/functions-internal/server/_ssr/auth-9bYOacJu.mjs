import { o as __toESM } from "../_runtime.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-9bYOacJu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [modo, setModo] = (0, import_react.useState)("entrar");
	const [nome, setNome] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [senha, setSenha] = (0, import_react.useState)("");
	const [enviando, setEnviando] = (0, import_react.useState)(false);
	const [aguardandoEmail, setAguardandoEmail] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({
				to: "/painel",
				replace: true
			});
		});
	}, [navigate]);
	async function enviar(e) {
		e.preventDefault();
		setEnviando(true);
		try {
			if (modo === "entrar") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password: senha
				});
				if (error) throw error;
				navigate({
					to: "/painel",
					replace: true
				});
			} else {
				const { data, error } = await supabase.auth.signUp({
					email,
					password: senha,
					options: {
						emailRedirectTo: window.location.origin,
						data: { nome }
					}
				});
				if (error) throw error;
				if (data.session) navigate({
					to: "/painel",
					replace: true
				});
				else setAguardandoEmail(true);
			}
		} catch (erro) {
			toast.error(erro instanceof Error ? erro.message : "Não foi possível concluir o acesso.");
		} finally {
			setEnviando(false);
		}
	}
	async function entrarComGoogle() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${window.location.origin}/auth/callback` }
		});
		if (error) {
			toast.error("Falha ao autenticar com o Google: " + error.message);
			return;
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold uppercase italic tracking-tight text-primary",
					children: "CINAP"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro mt-1",
					children: "Registro Nacional Nº 482-B"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl leading-tight",
						children: "Portal de Gestão da Convenção das Igrejas Nacionais Autônomas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: "Controle de congregações, contribuições estatutárias (Art. 7º) e emissão de credenciais ministeriais."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro",
					children: "Documento de acesso restrito"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6 lg:p-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm animate-registry",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "label-registro hover:text-primary",
						children: "← Voltar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-6 font-display text-3xl",
						children: modo === "entrar" ? "Acessar o portal" : "Criar acesso"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: modo === "entrar" ? "Informe suas credenciais institucionais." : "Cadastre-se com o e-mail registrado na secretaria."
					}),
					aguardandoEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 border border-border bg-surface p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								"Enviamos um e-mail de confirmação para ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: email }),
								". Confirme o cadastro para acessar o portal."
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: enviar,
						className: "mt-8 space-y-4",
						children: [
							modo === "cadastrar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
								rotulo: "Nome completo",
								value: nome,
								onChange: setNome,
								type: "text",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
								rotulo: "E-mail",
								value: email,
								onChange: setEmail,
								type: "email",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
								rotulo: "Senha",
								value: senha,
								onChange: setSenha,
								type: "password",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: enviando,
								className: "w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60",
								children: enviando ? "Processando…" : modo === "entrar" ? "Entrar" : "Cadastrar"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: entrarComGoogle,
						className: "mt-4 w-full border border-border bg-surface py-3 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary",
						children: "Continuar com Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setModo(modo === "entrar" ? "cadastrar" : "entrar");
							setAguardandoEmail(false);
						},
						className: "mt-6 w-full text-xs text-muted-foreground hover:text-primary",
						children: modo === "entrar" ? "Ainda não possui acesso? Cadastre-se" : "Já possui acesso? Entrar"
					})
				]
			})
		})]
	});
}
function Campo({ rotulo, value, onChange, type, required }) {
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
export { AuthPage as component };
