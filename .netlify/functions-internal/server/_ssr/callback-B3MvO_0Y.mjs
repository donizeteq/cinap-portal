import { o as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-B3MvO_0Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallbackComponent() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const handleCallback = async () => {
			try {
				const { data: { session }, error } = await supabase.auth.getSession();
				if (error) throw error;
				if (session) {
					toast.success("Login realizado com sucesso!");
					navigate({
						to: "/painel",
						replace: true
					});
				} else {
					toast.error("Falha ao validar sessão. Tente novamente.");
					navigate({
						to: "/auth",
						replace: true
					});
				}
			} catch (err) {
				console.error("Erro no callback:", err);
				toast.error("Erro durante o processamento do login.");
				navigate({
					to: "/auth",
					replace: true
				});
			}
		};
		handleCallback();
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-surface text-primary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm uppercase tracking-widest",
				children: "Processando autenticação..."
			})]
		})
	});
}
//#endregion
export { AuthCallbackComponent as component };
