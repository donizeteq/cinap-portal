globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as toEventHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
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
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"92b-QQNV3K/BFBhHdTzqOk1B2u918xk\"",
		"mtime": "2026-08-28T18:38:58.489Z",
		"size": 2347,
		"path": "../public/favicon.ico"
	},
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"2f1-XQ9tbSqTdiDq4bDnkvgtEB/PFsI\"",
		"mtime": "2026-08-28T18:38:58.485Z",
		"size": 753,
		"path": "../public/favicon.svg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-28T18:38:58.485Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/CredencialMinisterial-D_SeblVo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a68-1MmiR+2Eq0l7pvciiSbLHtf0lt0\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 2664,
		"path": "../public/assets/CredencialMinisterial-D_SeblVo.js"
	},
	"/assets/PortalShell-Cm4o_Yf4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a678-CjlB6YF0Ku0GyCY/w9QNtAsP44k\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 108152,
		"path": "../public/assets/PortalShell-Cm4o_Yf4.js"
	},
	"/assets/agentes-jIUeMnAe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1db7-6wpUJwwvwZ4XWHYaRmHug/uN98k\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 7607,
		"path": "../public/assets/agentes-jIUeMnAe.js"
	},
	"/assets/alertas-tdIqAzvK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e9d-MORhHs9CkpHS0plbNzvwcQF+RnQ\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 20125,
		"path": "../public/assets/alertas-tdIqAzvK.js"
	},
	"/assets/alertas.functions-DmYG9LMW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ad-RPP4VL/VfppTT+ED2KsgO3W1cvg\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 1453,
		"path": "../public/assets/alertas.functions-DmYG9LMW.js"
	},
	"/assets/auditoria-DkMh64vP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1abb-QaZEml6O26Cb3kgLBXZNvLtG5rE\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 6843,
		"path": "../public/assets/auditoria-DkMh64vP.js"
	},
	"/assets/auth-flqJZfqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a7c-Ca6GzBQnVUKxwkImnB8WDK4xfns\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 6780,
		"path": "../public/assets/auth-flqJZfqa.js"
	},
	"/assets/auth-middleware-8fIrMnn0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-Md63PpFMZcqdVUkDxGD3Mcu1tIM\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 77,
		"path": "../public/assets/auth-middleware-8fIrMnn0.js"
	},
	"/assets/browser-Bg25_sDh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bb5-e3s3wmPUZJZZ3aI9OoV3R4Ssaho\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 23477,
		"path": "../public/assets/browser-Bg25_sDh.js"
	},
	"/assets/cinap-TkpgxacE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34a-OucG44GaSIt27HPJraJBD3PQRXY\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 842,
		"path": "../public/assets/cinap-TkpgxacE.js"
	},
	"/assets/cinap-alertas-aatAzvb6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37f-wQqQu+phjNc7bY2l+H1UaUOpG0M\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 895,
		"path": "../public/assets/cinap-alertas-aatAzvb6.js"
	},
	"/assets/callback-CLJ9oMe8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40d-WHy9MtVAKvVmYlINE5/VyKF+jl0\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 1037,
		"path": "../public/assets/callback-CLJ9oMe8.js"
	},
	"/assets/cinap-csv-rRoXtTqd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d2-RSWMANDBOATRc7E5wnxDRsyEFow\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 1746,
		"path": "../public/assets/cinap-csv-rRoXtTqd.js"
	},
	"/assets/cinap-filiacao-C9R45Soj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b9-KjbLvuMUJZiA5INUStanK1Pwnfo\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 953,
		"path": "../public/assets/cinap-filiacao-C9R45Soj.js"
	},
	"/assets/cinap-notificar-B2DrExlD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-o/PdPeINlOo8hUNxm2AYxmF+ZRs\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 665,
		"path": "../public/assets/cinap-notificar-B2DrExlD.js"
	},
	"/assets/cinap-planilha-BInf8KxE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fb-+IKLyt3jPQUAYIgHUo9Ues3hkzQ\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 507,
		"path": "../public/assets/cinap-planilha-BInf8KxE.js"
	},
	"/assets/cinap-pdf-CJiM9Ny6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"305b-PePpKJZnYcq+f0ueezNZ7lAbyiA\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 12379,
		"path": "../public/assets/cinap-pdf-CJiM9Ny6.js"
	},
	"/assets/configuracoes-DYHfB1xS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1013-v4nrgVbBmhwFoB4h9BYyWSiTw3M\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 4115,
		"path": "../public/assets/configuracoes-DYHfB1xS.js"
	},
	"/assets/credenciais-CkrTFQEB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0e-1W1Mo5N+1H590uF4xXHWe5X/Uqw\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 3342,
		"path": "../public/assets/credenciais-CkrTFQEB.js"
	},
	"/assets/congregacoes-BByEL5tp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"198c-idnyEUORiT6RN4Et8uydOtPFl40\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 6540,
		"path": "../public/assets/congregacoes-BByEL5tp.js"
	},
	"/assets/filiacao-BJCT-3uQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1150-8Ob2w2OT3uqYRNAk5qQYXbXB/Ew\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 4432,
		"path": "../public/assets/filiacao-BJCT-3uQ.js"
	},
	"/assets/html2canvas-CA7kyov8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b46-1bD3NUT0o78L/KUDivNJ6s7fDy4\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 199494,
		"path": "../public/assets/html2canvas-CA7kyov8.js"
	},
	"/assets/index.es-CNHAvOs8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f83-uM3XoghEGgYVKaC3WGtIZse9Amc\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 151427,
		"path": "../public/assets/index.es-CNHAvOs8.js"
	},
	"/assets/jspdf.es.min-BLVved40.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61698-SkqbBIodeVCF0Ch4przI+NqUeOQ\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 399e3,
		"path": "../public/assets/jspdf.es.min-BLVved40.js"
	},
	"/assets/minha-situacao-D67LtgON.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2602-Q9esdoWnpM8yTntLQz6yOyru54A\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 9730,
		"path": "../public/assets/minha-situacao-D67LtgON.js"
	},
	"/assets/obreiros-Diiuu9lS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bd6-UXJwTPKokUxD1vXs4ujfowdqSk4\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 7126,
		"path": "../public/assets/obreiros-Diiuu9lS.js"
	},
	"/assets/pagamentos-BfnxZvLI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2867-eg72ArvamyfkrRxf7I+GyYDCm3I\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 10343,
		"path": "../public/assets/pagamentos-BfnxZvLI.js"
	},
	"/assets/painel-Dp1xXZC4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63098-JD2sRXSkc99dzoJJWSKLlWNDwz0\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 405656,
		"path": "../public/assets/painel-Dp1xXZC4.js"
	},
	"/assets/perfis-DaimLpcY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1001-JP2B8WfMvgUyUHKFsx2KxpRTOXw\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 4097,
		"path": "../public/assets/perfis-DaimLpcY.js"
	},
	"/assets/purify.es-BVMDmQta.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ba-eN4IIuogHYJkQf/Tocsd/Egdkvc\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 26810,
		"path": "../public/assets/purify.es-BVMDmQta.js"
	},
	"/assets/react-dom-CMWFGuH-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e04-Oo3hkbBqAvs0wAc78JuNwb2hwvY\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 3588,
		"path": "../public/assets/react-dom-CMWFGuH-.js"
	},
	"/assets/redefinir-senha-CZ5SiqRP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98c-cejYwoJRwMJKj28l+jNifyW1Aqs\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 2444,
		"path": "../public/assets/redefinir-senha-CZ5SiqRP.js"
	},
	"/assets/retrato-obreiro-B1c_pLLK.jpg": {
		"type": "image/jpeg",
		"etag": "\"4555-afeW0X/DyLCOmtdknu3V6EaMTyI\"",
		"mtime": "2026-08-28T18:38:57.357Z",
		"size": 17749,
		"path": "../public/assets/retrato-obreiro-B1c_pLLK.jpg"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/route-CY9hl1lW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-jp8uOnJC8C001/r0k5qCTzJcRgU\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 139,
		"path": "../public/assets/route-CY9hl1lW.js"
	},
	"/assets/routes-DINvlh7i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6a-JOkZ8zbqFEdBmh0ywnbfS+K7bhA\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 2922,
		"path": "../public/assets/routes-DINvlh7i.js"
	},
	"/assets/styles-CWyn2qSR.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"144f4-4Yu3O29qAqTjRktcl//CLd9bumQ\"",
		"mtime": "2026-08-28T18:38:57.357Z",
		"size": 83188,
		"path": "../public/assets/styles-CWyn2qSR.css"
	},
	"/assets/templates-email-BvidUuhp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141c-cZBPBQwS9nZrMfVpWliXvFtbTBY\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 5148,
		"path": "../public/assets/templates-email-BvidUuhp.js"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/useRouter-BP8vT1kh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f38-UAwyZ71XUq5pvhwLvcQ+ekWdEeM\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 7992,
		"path": "../public/assets/useRouter-BP8vT1kh.js"
	},
	"/assets/useServerFn-Bw3ouZSf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19a-vA/Dr/tmqEciVFd/8W8DniwUQ7c\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 410,
		"path": "../public/assets/useServerFn-Bw3ouZSf.js"
	},
	"/assets/useStore-Cne1crYO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac5-kbOzsIa7SSxDaqFh670ZR8UWgVw\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 19141,
		"path": "../public/assets/useStore-Cne1crYO.js"
	},
	"/assets/validar._registro-BwYV-G7B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-otR6PiwinBbNQgnT0p+2Yw96nsM\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 2470,
		"path": "../public/assets/validar._registro-BwYV-G7B.js"
	},
	"/assets/validar._registro-CY13ubMl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"183-EhATz+tPNEeC63mvwrClpJCOm4Q\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 387,
		"path": "../public/assets/validar._registro-CY13ubMl.js"
	},
	"/assets/validar._registro-DQ38c1dc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-OOhQLZcnSLDC1bCh2GRDKB7F4jA\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 242,
		"path": "../public/assets/validar._registro-DQ38c1dc.js"
	},
	"/assets/validar._registro-DdZrc_Pk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a0-Fg3Oqo/0qkx2im4H2YYRiy/Ay9M\"",
		"mtime": "2026-08-28T18:38:57.356Z",
		"size": 672,
		"path": "../public/assets/validar._registro-DdZrc_Pk.js"
	},
	"/assets/index-BFdmIO-F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cd49-+7LEGk3DeCTVDVK6M9GXC4Gq0jk\"",
		"mtime": "2026-08-28T18:38:57.355Z",
		"size": 576841,
		"path": "../public/assets/index-BFdmIO-F.js"
	},
	"/assets/xlsx-BivLitlN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67895-dC+M2iqlwnWyy5rqDFNMq/jNNIE\"",
		"mtime": "2026-08-28T18:38:57.356Z",
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
