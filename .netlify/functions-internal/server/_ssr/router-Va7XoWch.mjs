import { o as __toESM } from "../_runtime.mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as hashChave } from "./agent-keys-Bg_SZTln.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as referenciaAtual, r as MENSALIDADE_POR_CATEGORIA } from "./cinap-PoyC-pfo.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as supabaseAdmin } from "./client.server-DqzlzxEm.mjs";
import { t as Route$26 } from "./validar._registro-CsTGeqtN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Va7XoWch.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "./assets/styles-jfygbj8o.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-registro",
					children: "Erro 404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-3xl text-foreground",
					children: "Página não localizada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "O documento solicitado não existe ou foi movido do arquivo."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl text-foreground",
					children: "Esta página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Ocorreu uma falha no sistema. Tente novamente ou retorne ao início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "border border-border px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-foreground",
						children: "Início"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "author",
				content: "CINAP"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((evento) => {
			if (evento !== "SIGNED_IN" && evento !== "SIGNED_OUT" && evento !== "USER_UPDATED") return;
			router.invalidate();
			if (evento !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-right" })]
	});
}
var $$splitComponentImporter$17 = () => import("./routes-DXAGqmyb.mjs");
var Route$24 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "CINAP — Convenção das Igrejas Nacionais Autônomas" },
		{
			name: "description",
			content: "Portal institucional da CINAP: registro de congregações, corpo de obreiros, credencial ministerial digital e controle de contribuições."
		},
		{
			property: "og:title",
			content: "CINAP — Convenção das Igrejas Nacionais Autônomas"
		},
		{
			property: "og:description",
			content: "Secretaria digital da convenção: congregações, obreiros, credenciais e mensalidades do Art. 7º."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./route-Di7iQBCH.mjs");
var Route$23 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/auth" });
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./auth-9bYOacJu.mjs");
var Route$22 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Acesso ao Portal | CINAP" },
		{
			name: "description",
			content: "Acesso restrito ao portal administrativo da Convenção das Igrejas Nacionais Autônomas."
		},
		{
			property: "og:title",
			content: "Acesso ao Portal | CINAP"
		},
		{
			property: "og:description",
			content: "Área de autenticação de obreiros e da secretaria da CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./filiacao-D-HSPbiB.mjs");
var Route$21 = createFileRoute("/filiacao")({
	head: () => ({ meta: [
		{ title: "Filiação de Obreiro — Taxas e Documentos | CINAP" },
		{
			name: "description",
			content: "Como se filiar à CINAP: taxa de inscrição de R$ 50,00, credencial de R$ 20,00, chave PIX oficial e a lista de documentos obrigatórios."
		},
		{
			property: "og:title",
			content: "Filiação de Obreiro — Taxas e Documentos | CINAP"
		},
		{
			property: "og:description",
			content: "Forma de pagamento, chave PIX e documentação exigida para o cadastro de obreiros."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./redefinir-senha-C8MQ7P-T.mjs");
var Route$20 = createFileRoute("/redefinir-senha")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Redefinir Senha | CINAP" },
		{
			name: "description",
			content: "Defina uma nova senha de acesso ao portal da Convenção das Igrejas Nacionais Autônomas."
		},
		{
			property: "og:title",
			content: "Redefinir Senha | CINAP"
		},
		{
			property: "og:description",
			content: "Recuperação de acesso ao portal CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./agentes-BqKkcZPG.mjs");
var Route$19 = createFileRoute("/_authenticated/agentes")({
	head: () => ({ meta: [
		{ title: "Agentes Externos | CINAP" },
		{
			name: "description",
			content: "Gerenciamento de chaves de API para agentes externos integrados ao portal CINAP."
		},
		{
			property: "og:title",
			content: "Agentes Externos | CINAP"
		},
		{
			property: "og:description",
			content: "Controle de acesso de agentes automatizados à Convenção das Igrejas Nacionais Autônomas."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./alertas-B-k-am1E.mjs");
var Route$18 = createFileRoute("/_authenticated/alertas")({
	head: () => ({ meta: [
		{ title: "Alertas e Avisos | CINAP" },
		{
			name: "description",
			content: "Configuração do remetente de e-mail, prazo de vencimento e intervalo de cobrança dos obreiros inadimplentes da CINAP."
		},
		{
			property: "og:title",
			content: "Alertas e Avisos | CINAP"
		},
		{
			property: "og:description",
			content: "Central de alertas automáticos de inadimplência da CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./auditoria-DgriT76k.mjs");
var Route$17 = createFileRoute("/_authenticated/auditoria")({
	head: () => ({ meta: [
		{ title: "Auditoria da Secretaria | CINAP" },
		{
			name: "description",
			content: "Livro de auditoria das ações da Secretaria Geral: criações, edições e envios com data, usuário e detalhes."
		},
		{
			property: "og:title",
			content: "Auditoria da Secretaria | CINAP"
		},
		{
			property: "og:description",
			content: "Rastreabilidade completa das ações administrativas da Convenção."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./configuracoes-FygNKvhb.mjs");
var Route$16 = createFileRoute("/_authenticated/configuracoes")({
	head: () => ({ meta: [
		{ title: "Configurações de Cobrança | CINAP" },
		{
			name: "description",
			content: "Defina o dia de vencimento das contribuições e os níveis de atraso que disparam avisos aos obreiros da CINAP."
		},
		{
			property: "og:title",
			content: "Configurações de Cobrança | CINAP"
		},
		{
			property: "og:description",
			content: "Parâmetros de vencimento e níveis de atraso dos avisos da CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./congregacoes-D1wM815n.mjs");
var Route$15 = createFileRoute("/_authenticated/congregacoes")({
	head: () => ({ meta: [
		{ title: "Congregações | CINAP" },
		{
			name: "description",
			content: "Cadastro e manutenção das congregações filiadas, com mensalidade calculada pelo Art. 7º."
		},
		{
			property: "og:title",
			content: "Congregações | CINAP"
		},
		{
			property: "og:description",
			content: "Gestão das unidades filiadas à Convenção das Igrejas Nacionais Autônomas."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./credenciais-BzSlo9UN.mjs");
var Route$14 = createFileRoute("/_authenticated/credenciais")({
	head: () => ({ meta: [
		{ title: "Credencial Ministerial | CINAP" },
		{
			name: "description",
			content: "Emissão da credencial ministerial digital dos obreiros, pronta para impressão em PDF."
		},
		{
			property: "og:title",
			content: "Credencial Ministerial | CINAP"
		},
		{
			property: "og:description",
			content: "Gere e imprima a credencial ministerial digital de cada obreiro filiado."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./minha-situacao-DChQosMR.mjs");
var Route$13 = createFileRoute("/_authenticated/minha-situacao")({
	head: () => ({ meta: [
		{ title: "Minha Situação | CINAP" },
		{
			name: "description",
			content: "Área exclusiva do obreiro para consultar sua situação de contribuição e credencial ministerial."
		},
		{
			property: "og:title",
			content: "Minha Situação | CINAP"
		},
		{
			property: "og:description",
			content: "Consulte sua credencial ministerial e o histórico de contribuições na CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./obreiros-BSuY-FhK.mjs");
var Route$12 = createFileRoute("/_authenticated/obreiros")({
	head: () => ({ meta: [
		{ title: "Corpo de Obreiros | CINAP" },
		{
			name: "description",
			content: "Cadastro dos obreiros filiados, cargos ministeriais e situação de contribuição."
		},
		{
			property: "og:title",
			content: "Corpo de Obreiros | CINAP"
		},
		{
			property: "og:description",
			content: "Registro ministerial dos obreiros da Convenção das Igrejas Nacionais Autônomas."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./pagamentos-BJEj6iaI.mjs");
var Route$11 = createFileRoute("/_authenticated/pagamentos")({
	head: () => ({ meta: [
		{ title: "Mensalidades e Pagamentos | CINAP" },
		{
			name: "description",
			content: "Controle das mensalidades dos obreiros filiados: vencimentos, quitações e histórico de contribuições."
		},
		{
			property: "og:title",
			content: "Mensalidades e Pagamentos | CINAP"
		},
		{
			property: "og:description",
			content: "Tesouraria da Convenção das Igrejas Nacionais Autônomas."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./painel-DvdP-AD3.mjs");
var Route$10 = createFileRoute("/_authenticated/painel")({
	head: () => ({ meta: [{ title: "Painel de Controle | CINAP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./perfis-C5cfxJHh.mjs");
var Route$9 = createFileRoute("/_authenticated/perfis")({
	head: () => ({ meta: [
		{ title: "Perfis de Acesso | CINAP" },
		{
			name: "description",
			content: "Gestão dos perfis de acesso da Convenção: conceda o perfil de Secretaria Geral ou mantenha o acesso restrito de obreiro."
		},
		{
			property: "og:title",
			content: "Perfis de Acesso | CINAP"
		},
		{
			property: "og:description",
			content: "Controle de quem administra o portal da CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./templates-email-D7nuOkWU.mjs");
var Route$8 = createFileRoute("/_authenticated/templates-email")({
	head: () => ({ meta: [
		{ title: "Templates de E-mail | CINAP" },
		{
			name: "description",
			content: "Personalize o assunto e o texto dos avisos de vencimento e de inadimplência enviados aos obreiros da CINAP."
		},
		{
			property: "og:title",
			content: "Templates de E-mail | CINAP"
		},
		{
			property: "og:description",
			content: "Editor e pré-visualização dos e-mails institucionais de aviso da CINAP."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./callback-B3MvO_0Y.mjs");
var Route$7 = createFileRoute("/auth/callback")({
	loader: async () => {
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
async function verificarChaveAgente(chave, permissaoRequerida) {
	if (!chave) throw new Error("Unauthorized: Missing X-Agent-Key header");
	const hash = hashChave(chave);
	const { data, error } = await supabaseAdmin.from("agent_keys").select("*").eq("chave_hash", hash).single();
	if (error || !data) throw new Error("Unauthorized: Invalid agent key");
	const agent = data;
	if (!agent.ativa) throw new Error("Unauthorized: Agent key is disabled");
	if (!agent.permissoes.includes(permissaoRequerida)) throw new Error(`Forbidden: Agent key lacks ${permissaoRequerida} permission`);
	supabaseAdmin.from("agent_keys").update({ ultimo_uso: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", agent.id);
	return agent;
}
var Route$6 = createFileRoute("/api/public/agent/relatorio-mensal")({ server: { handlers: { GET: async ({ request }) => {
	try {
		await verificarChaveAgente(request.headers.get("x-agent-key"), "read");
		const referencia = new URL(request.url).searchParams.get("referencia") ?? referenciaAtual();
		const [{ data: congregacoes }, { data: obreiros }, { data: pagamentos }] = await Promise.all([
			supabaseAdmin.from("congregacoes").select("*"),
			supabaseAdmin.from("obreiros").select("*"),
			supabaseAdmin.from("pagamentos").select("*").eq("referencia", referencia).eq("status", "pago")
		]);
		const resumo = [
			"Bronze",
			"Prata",
			"Ouro"
		].map((categoria) => {
			const congs = (congregacoes ?? []).filter((c) => c.categoria === categoria);
			const idsCong = new Set(congs.map((c) => c.id));
			const doGrupo = (obreiros ?? []).filter((o) => o.congregacao_id && idsCong.has(o.congregacao_id));
			const idsObreiros = new Set(doGrupo.map((o) => o.id));
			const pagosGrupo = (pagamentos ?? []).filter((p) => idsObreiros.has(p.obreiro_id));
			return {
				categoria,
				congregacoes: congs.length,
				obreiros: doGrupo.length,
				quitados: pagosGrupo.length,
				arrecadado: pagosGrupo.reduce((s, p) => s + Number(p.valor), 0),
				previsto: doGrupo.length * MENSALIDADE_POR_CATEGORIA[categoria]
			};
		});
		const totalArrecadado = resumo.reduce((s, r) => s + r.arrecadado, 0);
		const totalPrevisto = resumo.reduce((s, r) => s + r.previsto, 0);
		const totalObreiros = resumo.reduce((s, r) => s + r.obreiros, 0);
		const totalQuitados = resumo.reduce((s, r) => s + r.quitados, 0);
		return Response.json({
			referencia,
			categorias: resumo,
			total: {
				arrecadado: totalArrecadado,
				previsto: totalPrevisto,
				obreiros: totalObreiros,
				quitados: totalQuitados,
				inadimplencia: totalPrevisto - totalArrecadado,
				indiceAdimplencia: totalObreiros ? Math.round(totalQuitados / totalObreiros * 100) : 0
			}
		});
	} catch (erro) {
		const mensagem = erro instanceof Error ? erro.message : "Erro interno";
		const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
		return Response.json({ error: mensagem }, { status });
	}
} } } });
var Route$5 = createFileRoute("/api/public/hooks/alertas")({ server: { handlers: { POST: async ({ request }) => {
	const apikey = request.headers.get("apikey") ?? request.headers.get("authorization")?.replace(/^Bearer /i, "") ?? "";
	const aceitos = [process.env["SUPABASE_ANON_KEY"], process.env["SUPABASE_PUBLISHABLE_KEY"]].filter((v) => Boolean(v));
	if (!apikey || !aceitos.includes(apikey)) return new Response("Unauthorized", { status: 401 });
	try {
		const { executarAlertas, despacharAvisosAprovados } = await import("./alertas.server-By7nBY3-.mjs");
		const resultado = await executarAlertas();
		const despacho = await despacharAvisosAprovados();
		return Response.json({
			...resultado,
			despacho
		});
	} catch (erro) {
		return Response.json({ erro: erro instanceof Error ? erro.message : "Falha ao executar alertas" }, { status: 500 });
	}
} } } });
var Route$4 = createFileRoute("/api/public/agent/congregacoes/")({ server: { handlers: {
	GET: async ({ request }) => {
		try {
			await verificarChaveAgente(request.headers.get("x-agent-key"), "read");
			const { data, error } = await supabaseAdmin.from("congregacoes").select("*").order("nome");
			if (error) throw error;
			return Response.json({ data });
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro interno";
			const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
			return Response.json({ error: mensagem }, { status });
		}
	},
	POST: async ({ request }) => {
		try {
			await verificarChaveAgente(request.headers.get("x-agent-key"), "write");
			const body = await request.json();
			const payload = {
				nome: String(body["nome"] ?? ""),
				categoria: String(body["categoria"] ?? "Bronze"),
				qdt_obreiros: Number(body["qdt_obreiros"] ?? 0),
				cidade: String(body["cidade"] ?? ""),
				estado: String(body["estado"] ?? ""),
				ativa: Boolean(body["ativa"] ?? true)
			};
			if (!payload.nome) return Response.json({ error: "Nome é obrigatório" }, { status: 400 });
			const { data, error } = await supabaseAdmin.from("congregacoes").insert(payload).select().single();
			if (error) throw error;
			return Response.json({ data }, { status: 201 });
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro interno";
			const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
			return Response.json({ error: mensagem }, { status });
		}
	}
} } });
var Route$3 = createFileRoute("/api/public/agent/congregacoes/$id")({ server: { handlers: { PATCH: async ({ request, params }) => {
	try {
		await verificarChaveAgente(request.headers.get("x-agent-key"), "write");
		const body = await request.json();
		const payload = {};
		if ("nome" in body) payload["nome"] = String(body["nome"]);
		if ("categoria" in body) payload["categoria"] = String(body["categoria"]);
		if ("qdt_obreiros" in body) payload["qdt_obreiros"] = Number(body["qdt_obreiros"]);
		if ("cidade" in body) payload["cidade"] = String(body["cidade"]);
		if ("estado" in body) payload["estado"] = String(body["estado"]);
		if ("ativa" in body) payload["ativa"] = Boolean(body["ativa"]);
		if (Object.keys(payload).length === 0) return Response.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
		const { data, error } = await supabaseAdmin.from("congregacoes").update(payload).eq("id", params.id).select().single();
		if (error) throw error;
		if (!data) return Response.json({ error: "Congregação não encontrada" }, { status: 404 });
		return Response.json({ data });
	} catch (erro) {
		const mensagem = erro instanceof Error ? erro.message : "Erro interno";
		const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
		return Response.json({ error: mensagem }, { status });
	}
} } } });
var Route$2 = createFileRoute("/api/public/agent/obreiros/")({ server: { handlers: {
	GET: async ({ request }) => {
		try {
			await verificarChaveAgente(request.headers.get("x-agent-key"), "read");
			const { data, error } = await supabaseAdmin.from("obreiros").select("*").order("nome");
			if (error) throw error;
			return Response.json({ data });
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro interno";
			const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
			return Response.json({ error: mensagem }, { status });
		}
	},
	POST: async ({ request }) => {
		try {
			await verificarChaveAgente(request.headers.get("x-agent-key"), "write");
			const body = await request.json();
			const payload = {
				nome: String(body["nome"] ?? ""),
				congregacao_id: body["congregacao_id"] ? String(body["congregacao_id"]) : null,
				cargo: String(body["cargo"] ?? "Obreiro"),
				cpf: body["cpf"] ? String(body["cpf"]) : null,
				email: body["email"] ? String(body["email"]) : null,
				status_pagamento: String(body["status_pagamento"] ?? "pendente")
			};
			if (!payload.nome) return Response.json({ error: "Nome é obrigatório" }, { status: 400 });
			const { data, error } = await supabaseAdmin.from("obreiros").insert(payload).select().single();
			if (error) throw error;
			return Response.json({ data }, { status: 201 });
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro interno";
			const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
			return Response.json({ error: mensagem }, { status });
		}
	}
} } });
var Route$1 = createFileRoute("/api/public/agent/obreiros/$id")({ server: { handlers: { PATCH: async ({ request, params }) => {
	try {
		await verificarChaveAgente(request.headers.get("x-agent-key"), "write");
		const body = await request.json();
		const payload = {};
		if ("nome" in body) payload["nome"] = String(body["nome"]);
		if ("congregacao_id" in body) payload["congregacao_id"] = body["congregacao_id"] ? String(body["congregacao_id"]) : null;
		if ("cargo" in body) payload["cargo"] = String(body["cargo"]);
		if ("cpf" in body) payload["cpf"] = body["cpf"] ? String(body["cpf"]) : null;
		if ("email" in body) payload["email"] = body["email"] ? String(body["email"]) : null;
		if ("status_pagamento" in body) payload["status_pagamento"] = String(body["status_pagamento"]);
		if (Object.keys(payload).length === 0) return Response.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
		const { data, error } = await supabaseAdmin.from("obreiros").update(payload).eq("id", params.id).select().single();
		if (error) throw error;
		if (!data) return Response.json({ error: "Obreiro não encontrado" }, { status: 404 });
		return Response.json({ data });
	} catch (erro) {
		const mensagem = erro instanceof Error ? erro.message : "Erro interno";
		const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
		return Response.json({ error: mensagem }, { status });
	}
} } } });
var Route = createFileRoute("/api/public/agent/pagamentos/")({ server: { handlers: {
	GET: async ({ request }) => {
		try {
			await verificarChaveAgente(request.headers.get("x-agent-key"), "read");
			const { data, error } = await supabaseAdmin.from("pagamentos").select("*").order("data", { ascending: false });
			if (error) throw error;
			return Response.json({ data });
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro interno";
			const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
			return Response.json({ error: mensagem }, { status });
		}
	},
	POST: async ({ request }) => {
		try {
			await verificarChaveAgente(request.headers.get("x-agent-key"), "write");
			const body = await request.json();
			const obreiroId = String(body["obreiro_id"] ?? "");
			const referencia = String(body["referencia"] ?? referenciaAtual());
			const dataPagamento = String(body["data"] ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
			if (!obreiroId) return Response.json({ error: "obreiro_id é obrigatório" }, { status: 400 });
			const { data: obreiro, error: erroObreiro } = await supabaseAdmin.from("obreiros").select("*, congregacao:congregacoes(valor_mensalidade, categoria)").eq("id", obreiroId).single();
			if (erroObreiro || !obreiro) return Response.json({ error: "Obreiro não encontrado" }, { status: 404 });
			const congregacao = obreiro["congregacao"];
			const valor = Number(body["valor"] ?? congregacao?.valor_mensalidade ?? {
				Bronze: 40,
				Prata: 50,
				Ouro: 60
			}[congregacao?.categoria ?? "Bronze"]);
			const [{ data: pagamento, error: erroPagamento }] = await Promise.all([supabaseAdmin.from("pagamentos").insert({
				obreiro_id: obreiroId,
				valor,
				data: dataPagamento,
				status: "pago",
				referencia
			}).select().single(), supabaseAdmin.from("obreiros").update({ status_pagamento: "pago" }).eq("id", obreiroId)]);
			if (erroPagamento) throw erroPagamento;
			return Response.json({ data: pagamento }, { status: 201 });
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro interno";
			const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
			return Response.json({ error: mensagem }, { status });
		}
	}
} } });
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var AuthenticatedRouteRoute = Route$23.update({
	id: "/_authenticated",
	getParentRoute: () => Route$25
});
var AuthRoute = Route$22.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$25
});
var FiliacaoRoute = Route$21.update({
	id: "/filiacao",
	path: "/filiacao",
	getParentRoute: () => Route$25
});
var RedefinirSenhaRoute = Route$20.update({
	id: "/redefinir-senha",
	path: "/redefinir-senha",
	getParentRoute: () => Route$25
});
var AuthenticatedAgentesRoute = Route$19.update({
	id: "/agentes",
	path: "/agentes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAlertasRoute = Route$18.update({
	id: "/alertas",
	path: "/alertas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAuditoriaRoute = Route$17.update({
	id: "/auditoria",
	path: "/auditoria",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedConfiguracoesRoute = Route$16.update({
	id: "/configuracoes",
	path: "/configuracoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCongregacoesRoute = Route$15.update({
	id: "/congregacoes",
	path: "/congregacoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCredenciaisRoute = Route$14.update({
	id: "/credenciais",
	path: "/credenciais",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMinhaSituacaoRoute = Route$13.update({
	id: "/minha-situacao",
	path: "/minha-situacao",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedObreirosRoute = Route$12.update({
	id: "/obreiros",
	path: "/obreiros",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPagamentosRoute = Route$11.update({
	id: "/pagamentos",
	path: "/pagamentos",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPainelRoute = Route$10.update({
	id: "/painel",
	path: "/painel",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPerfisRoute = Route$9.update({
	id: "/perfis",
	path: "/perfis",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTemplatesEmailRoute = Route$8.update({
	id: "/templates-email",
	path: "/templates-email",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthCallbackRoute = Route$7.update({
	id: "/callback",
	path: "/callback",
	getParentRoute: () => AuthRoute
});
var ValidarRegistroRoute = Route$26.update({
	id: "/validar/$registro",
	path: "/validar/$registro",
	getParentRoute: () => Route$25
});
var ApiPublicAgentRelatorioMensalRoute = Route$6.update({
	id: "/api/public/agent/relatorio-mensal",
	path: "/api/public/agent/relatorio-mensal",
	getParentRoute: () => Route$25
});
var ApiPublicHooksAlertasRoute = Route$5.update({
	id: "/api/public/hooks/alertas",
	path: "/api/public/hooks/alertas",
	getParentRoute: () => Route$25
});
var ApiPublicAgentCongregacoesIndexRoute = Route$4.update({
	id: "/api/public/agent/congregacoes/",
	path: "/api/public/agent/congregacoes/",
	getParentRoute: () => Route$25
});
var ApiPublicAgentCongregacoesIdRoute = Route$3.update({
	id: "/api/public/agent/congregacoes/$id",
	path: "/api/public/agent/congregacoes/$id",
	getParentRoute: () => Route$25
});
var ApiPublicAgentObreirosIndexRoute = Route$2.update({
	id: "/api/public/agent/obreiros/",
	path: "/api/public/agent/obreiros/",
	getParentRoute: () => Route$25
});
var ApiPublicAgentObreirosIdRoute = Route$1.update({
	id: "/api/public/agent/obreiros/$id",
	path: "/api/public/agent/obreiros/$id",
	getParentRoute: () => Route$25
});
var ApiPublicAgentPagamentosIndexRoute = Route.update({
	id: "/api/public/agent/pagamentos/",
	path: "/api/public/agent/pagamentos/",
	getParentRoute: () => Route$25
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAgentesRoute,
	AuthenticatedAlertasRoute,
	AuthenticatedAuditoriaRoute,
	AuthenticatedConfiguracoesRoute,
	AuthenticatedCongregacoesRoute,
	AuthenticatedCredenciaisRoute,
	AuthenticatedMinhaSituacaoRoute,
	AuthenticatedObreirosRoute,
	AuthenticatedPagamentosRoute,
	AuthenticatedPainelRoute,
	AuthenticatedPerfisRoute,
	AuthenticatedTemplatesEmailRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AuthRouteChildren = { AuthCallbackRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AuthRoute: AuthRoute._addFileChildren(AuthRouteChildren),
	FiliacaoRoute,
	RedefinirSenhaRoute,
	ValidarRegistroRoute,
	ApiPublicAgentRelatorioMensalRoute,
	ApiPublicHooksAlertasRoute,
	ApiPublicAgentCongregacoesIdRoute,
	ApiPublicAgentObreirosIdRoute,
	ApiPublicAgentCongregacoesIndexRoute,
	ApiPublicAgentObreirosIndexRoute,
	ApiPublicAgentPagamentosIndexRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
