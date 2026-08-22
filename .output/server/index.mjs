globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-22T02:57:33.876Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-22T02:57:33.876Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/CredencialMinisterial-D6ms3HDX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ad-Hutunnt78eQRWCYeeKgRrBOH8Rg\"",
		"mtime": "2026-08-22T02:57:33.274Z",
		"size": 1965,
		"path": "../public/assets/CredencialMinisterial-D6ms3HDX.js"
	},
	"/assets/PortalShell-kiKSDcBp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3103-yNEvnOT97IK6iyM85Js6gVroXSc\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 12547,
		"path": "../public/assets/PortalShell-kiKSDcBp.js"
	},
	"/assets/agentes-BRQjGSxo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f7e-fDPpYw/lNwDy/Y0/1s3iF+G7lTw\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 12158,
		"path": "../public/assets/agentes-BRQjGSxo.js"
	},
	"/assets/auth-CmBHDT0V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"111a-xGtRoKb8EXu0d5pbZOvgxnWpqb8\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 4378,
		"path": "../public/assets/auth-CmBHDT0V.js"
	},
	"/assets/callback-BdhuMh5N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40d-sy4UcRisbGK7P5V16d4o5+HHVtE\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 1037,
		"path": "../public/assets/callback-BdhuMh5N.js"
	},
	"/assets/cinap-TkpgxacE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34a-OucG44GaSIt27HPJraJBD3PQRXY\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 842,
		"path": "../public/assets/cinap-TkpgxacE.js"
	},
	"/assets/cinap-pdf-czpnJE63.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1789-P/Stuz9k1RgafBY8epiklEQ5IyA\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 6025,
		"path": "../public/assets/cinap-pdf-czpnJE63.js"
	},
	"/assets/congregacoes-BzccTYAa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19b3-Wcn1exYvYBEwXMZd/XPzxvWU6+k\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 6579,
		"path": "../public/assets/congregacoes-BzccTYAa.js"
	},
	"/assets/credenciais-qGWZ9Vov.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce7-Wn1Q6O+kePq68HyvFJzUK1lF32c\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 3303,
		"path": "../public/assets/credenciais-qGWZ9Vov.js"
	},
	"/assets/html2canvas-ydWbLPCJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b46-IP/zQEbfXqt4Hk0jNBNNzCpjikQ\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 199494,
		"path": "../public/assets/html2canvas-ydWbLPCJ.js"
	},
	"/assets/index.es-BnroMYBe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f83-vnKSXULGtHDg+qU8/IJp9xkvDKo\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 151427,
		"path": "../public/assets/index.es-BnroMYBe.js"
	},
	"/assets/matchContext-Otmwrph7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b8-jjYtK1oR55z6MYsvhYmoZTTc8CQ\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 184,
		"path": "../public/assets/matchContext-Otmwrph7.js"
	},
	"/assets/minha-situacao-VEqMnrRd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f9-0/yeMSHVC1lJ3Uzn0p9NxRRoFRU\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 5369,
		"path": "../public/assets/minha-situacao-VEqMnrRd.js"
	},
	"/assets/obreiros-PE015koK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bfd-TSZgsUghHCXYKonfBLESso5RM5g\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 7165,
		"path": "../public/assets/obreiros-PE015koK.js"
	},
	"/assets/pagamentos-Cahm-Jhh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d1-s9BVQd2XjiJsWsMqSN7BxNYN5mU\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 8913,
		"path": "../public/assets/pagamentos-Cahm-Jhh.js"
	},
	"/assets/painel-Dc7RmI1H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c5d-dFLSkeDkBlG/jEdDwXg0T8NetwU\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 7261,
		"path": "../public/assets/painel-Dc7RmI1H.js"
	},
	"/assets/purify.es-BVMDmQta.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ba-eN4IIuogHYJkQf/Tocsd/Egdkvc\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 26810,
		"path": "../public/assets/purify.es-BVMDmQta.js"
	},
	"/assets/retrato-obreiro-B1c_pLLK.jpg": {
		"type": "image/jpeg",
		"etag": "\"4555-afeW0X/DyLCOmtdknu3V6EaMTyI\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 17749,
		"path": "../public/assets/retrato-obreiro-B1c_pLLK.jpg"
	},
	"/assets/rolldown-runtime-CbXtAM7H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24d-+aXgvbJ1Wwcp2A8AXKIBByksYC8\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 589,
		"path": "../public/assets/rolldown-runtime-CbXtAM7H.js"
	},
	"/assets/route-CUQdb3m7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-wX9zWyYFN3A4D1w1JmkDomQDs5M\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 139,
		"path": "../public/assets/route-CUQdb3m7.js"
	},
	"/assets/routes-Ba4VCZpM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5a-zaJ9mHN/8L8bKX6TLxHcaZxg00I\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 2650,
		"path": "../public/assets/routes-Ba4VCZpM.js"
	},
	"/assets/jspdf.es.min-Cfwd_oju.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61693-YDZhfLwwNOXpGpqV9peMAy2Ccvs\"",
		"mtime": "2026-08-22T02:57:33.275Z",
		"size": 398995,
		"path": "../public/assets/jspdf.es.min-Cfwd_oju.js"
	},
	"/assets/index-B8yeloZO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8bdc7-3b0gko6a0t9syJprAk+iFfZh+Ic\"",
		"mtime": "2026-08-22T02:57:33.272Z",
		"size": 572871,
		"path": "../public/assets/index-B8yeloZO.js"
	},
	"/assets/styles-tJEW0pLq.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"135b4-3HCxVwNp2LQW5E/nlTSvZYEjV1s\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 79284,
		"path": "../public/assets/styles-tJEW0pLq.css"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/useMutation-Dm8Y0M__.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f4-73eIMXLZwMUjovyh7BNaQLSmdoA\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 2292,
		"path": "../public/assets/useMutation-Dm8Y0M__.js"
	},
	"/assets/useRouter-P4PaR9MS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f38-JeuRZo+y+piGPymlEbWpp6OPhZo\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 7992,
		"path": "../public/assets/useRouter-P4PaR9MS.js"
	},
	"/assets/useStore-BzcQ8ZCW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab8-r7CosghPbDNTy8iKqZe3Ywqc95w\"",
		"mtime": "2026-08-22T02:57:33.276Z",
		"size": 19128,
		"path": "../public/assets/useStore-BzcQ8ZCW.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy__y_gYF = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy__y_gYF
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
