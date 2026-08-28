globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { i as toEventHandler, n as defineHandler, o as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
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
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-28T17:53:55.744Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-28T17:53:55.744Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/CredencialMinisterial-Cg9ZFF0j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ad-zfhQ9EbGyk8v9h/QhE9XVSYYdUw\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 1965,
		"path": "../public/assets/CredencialMinisterial-Cg9ZFF0j.js"
	},
	"/assets/PortalShell-Bw6cOi6m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ebb-rzflPJ0nvgdVFYLJBwtGKsSdT7o\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 11963,
		"path": "../public/assets/PortalShell-Bw6cOi6m.js"
	},
	"/assets/agentes-M5jSiP43.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1db7-MhdFqYQaPEq1XdPfNyRy6ddlLXc\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 7607,
		"path": "../public/assets/agentes-M5jSiP43.js"
	},
	"/assets/alertas-DPuSbVq7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ea3-GDSq8Y7BHdmki3KnHFI7U1HZh94\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 20131,
		"path": "../public/assets/alertas-DPuSbVq7.js"
	},
	"/assets/alertas.functions-C53q6LZW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ad-RYM/OVS4k+Vx4d/D3WUox/oNkIc\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 1453,
		"path": "../public/assets/alertas.functions-C53q6LZW.js"
	},
	"/assets/auditoria-CVHIxCe2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1abf-U3NDuiSDgVRC4vihZMabxYCIaus\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 6847,
		"path": "../public/assets/auditoria-CVHIxCe2.js"
	},
	"/assets/auth-B0ATo9ro.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"111a-vj6eenDr/rs71MhCQrvvzqHhDLs\"",
		"mtime": "2026-08-28T17:53:53.559Z",
		"size": 4378,
		"path": "../public/assets/auth-B0ATo9ro.js"
	},
	"/assets/auth-middleware-Ds8ReTfx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c3-e9K0i/Ft4p6b/ahtMpyBXYNPvKQ\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 451,
		"path": "../public/assets/auth-middleware-Ds8ReTfx.js"
	},
	"/assets/callback-9-uiNaH-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40d-vWqt+wDJmlg/QkvATIZVyYlKPdU\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 1037,
		"path": "../public/assets/callback-9-uiNaH-.js"
	},
	"/assets/cinap-TkpgxacE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34a-OucG44GaSIt27HPJraJBD3PQRXY\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 842,
		"path": "../public/assets/cinap-TkpgxacE.js"
	},
	"/assets/cinap-alertas-aatAzvb6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37f-wQqQu+phjNc7bY2l+H1UaUOpG0M\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 895,
		"path": "../public/assets/cinap-alertas-aatAzvb6.js"
	},
	"/assets/cinap-pdf-Cmhdk4OH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17a5-h7TZnUJ7Mm5N0tls+UTNVObSyOo\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 6053,
		"path": "../public/assets/cinap-pdf-Cmhdk4OH.js"
	},
	"/assets/cinap-planilha-Dm8VTPuX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"360-r9hqnmpz6kc1cO60THcNvgi36VQ\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 864,
		"path": "../public/assets/cinap-planilha-Dm8VTPuX.js"
	},
	"/assets/configuracoes-C1egcyHy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103e-MEEG53TjChedwxxeNZqZ/d0QNsw\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 4158,
		"path": "../public/assets/configuracoes-C1egcyHy.js"
	},
	"/assets/congregacoes-DvnPeOA5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19b3-tUFVwS/HN9fIlSdX/MUvi6HKgr4\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 6579,
		"path": "../public/assets/congregacoes-DvnPeOA5.js"
	},
	"/assets/credenciais-Ct_HEOPb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce7-Lo0KaXXtxZ54TxjRg2QMEsYoLWw\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 3303,
		"path": "../public/assets/credenciais-Ct_HEOPb.js"
	},
	"/assets/filiacao-1ZZacS3r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1331-/iqCzHtjXvBuLX1ThEObVqSXZT4\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 4913,
		"path": "../public/assets/filiacao-1ZZacS3r.js"
	},
	"/assets/html2canvas-CA7kyov8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b46-1bD3NUT0o78L/KUDivNJ6s7fDy4\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 199494,
		"path": "../public/assets/html2canvas-CA7kyov8.js"
	},
	"/assets/index.es-CNHAvOs8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f83-uM3XoghEGgYVKaC3WGtIZse9Amc\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 151427,
		"path": "../public/assets/index.es-CNHAvOs8.js"
	},
	"/assets/jspdf.es.min-xysumNdC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61698-I856k/NKElb0V8RczG2da6S4yyM\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 399e3,
		"path": "../public/assets/jspdf.es.min-xysumNdC.js"
	},
	"/assets/obreiros-BuKxX_gU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bfd-PfOQcPM/MliWrLBP3JYb1gFaBZw\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 7165,
		"path": "../public/assets/obreiros-BuKxX_gU.js"
	},
	"/assets/minha-situacao-CxW1-xIT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f9-M9ubTJMOjCDz5FZuhQT1vjKZFJg\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 5369,
		"path": "../public/assets/minha-situacao-CxW1-xIT.js"
	},
	"/assets/index-Dq0yONEj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d5c3-dhxxIA98ezOEqiF/E5qyPK3+k5o\"",
		"mtime": "2026-08-28T17:53:53.558Z",
		"size": 579011,
		"path": "../public/assets/index-Dq0yONEj.js"
	},
	"/assets/pagamentos-DfJMbgWN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d1-MGbE8nAK/3PUD+su59OwHKYLD1U\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 8913,
		"path": "../public/assets/pagamentos-DfJMbgWN.js"
	},
	"/assets/painel-CAMk79-m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63cd3-1h9CkBSA0XSOZJe7XiNV7tXeTIA\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 408787,
		"path": "../public/assets/painel-CAMk79-m.js"
	},
	"/assets/perfis-CpwH69m1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102c-GhS4rAxgDzttNIVaGaBYR6KY/kI\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 4140,
		"path": "../public/assets/perfis-CpwH69m1.js"
	},
	"/assets/purify.es-BVMDmQta.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ba-eN4IIuogHYJkQf/Tocsd/Egdkvc\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 26810,
		"path": "../public/assets/purify.es-BVMDmQta.js"
	},
	"/assets/react-dom-CMWFGuH-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e04-Oo3hkbBqAvs0wAc78JuNwb2hwvY\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 3588,
		"path": "../public/assets/react-dom-CMWFGuH-.js"
	},
	"/assets/redefinir-senha-DWv6WqGf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98c-/ae8NfPaVXRO6x4fWFePELIOJtg\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 2444,
		"path": "../public/assets/redefinir-senha-DWv6WqGf.js"
	},
	"/assets/retrato-obreiro-B1c_pLLK.jpg": {
		"type": "image/jpeg",
		"etag": "\"4555-afeW0X/DyLCOmtdknu3V6EaMTyI\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 17749,
		"path": "../public/assets/retrato-obreiro-B1c_pLLK.jpg"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/route-Dxjssi01.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-hrJ8MT4l9Ub1nQfQ0ILZupYp1TY\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 139,
		"path": "../public/assets/route-Dxjssi01.js"
	},
	"/assets/routes-BXYdHtQE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5a-muOkY+fo9sz0xYji/uA3yr0Hm2w\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 2650,
		"path": "../public/assets/routes-BXYdHtQE.js"
	},
	"/assets/styles-C52wcP7l.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14c78-HEexJ5i66Z04jJhvG37naPDHXVU\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 85112,
		"path": "../public/assets/styles-C52wcP7l.css"
	},
	"/assets/templates-email-CW_qEWb3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1447-q/VoI54lHPiHmQzSScYrztsEb9k\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 5191,
		"path": "../public/assets/templates-email-CW_qEWb3.js"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-08-28T17:53:53.560Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/useMutation-jY16a92h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"951-fjSeukcNOv5zT/9aMXOXA26RE68\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 2385,
		"path": "../public/assets/useMutation-jY16a92h.js"
	},
	"/assets/useRouter-BP8vT1kh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f38-UAwyZ71XUq5pvhwLvcQ+ekWdEeM\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 7992,
		"path": "../public/assets/useRouter-BP8vT1kh.js"
	},
	"/assets/useStore-BwSHE53Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab8-cuasdSS+rcBlWpxs+uSM3EFnJPQ\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 19128,
		"path": "../public/assets/useStore-BwSHE53Q.js"
	},
	"/assets/validar._registro-C2-O47BT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a0-tBEOhOH+IJPsWKDPqXkvr0n3Q4E\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 672,
		"path": "../public/assets/validar._registro-C2-O47BT.js"
	},
	"/assets/validar._registro-CC8lWtNz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-g/GTq1uyzBSCUb2R5P0rjLJon0g\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 242,
		"path": "../public/assets/validar._registro-CC8lWtNz.js"
	},
	"/assets/validar._registro-CyVUuxu8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"183-/QIi+FL7uETAqBmdtYh5Wjp7LrE\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 387,
		"path": "../public/assets/validar._registro-CyVUuxu8.js"
	},
	"/assets/validar._registro-D6zFGg5K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-ultYWrV54pXBMhX1W2jTRwmKFcA\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 2470,
		"path": "../public/assets/validar._registro-D6zFGg5K.js"
	},
	"/assets/xlsx-BivLitlN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67895-dC+M2iqlwnWyy5rqDFNMq/jNNIE\"",
		"mtime": "2026-08-28T17:53:53.561Z",
		"size": 424085,
		"path": "../public/assets/xlsx-BivLitlN.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
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
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
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
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
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
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
