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
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"2f1-XQ9tbSqTdiDq4bDnkvgtEB/PFsI\"",
		"mtime": "2026-08-28T18:05:17.096Z",
		"size": 753,
		"path": "../public/favicon.svg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-28T18:05:17.096Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/CredencialMinisterial-C9uYscy1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a68-vDjK3MMmBQuRwh8EBitr55xC2Vc\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 2664,
		"path": "../public/assets/CredencialMinisterial-C9uYscy1.js"
	},
	"/assets/PortalShell-DTdLp6cy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a66a-wD76M1wDYtMq6nHsTIBKbk5vdsc\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 108138,
		"path": "../public/assets/PortalShell-DTdLp6cy.js"
	},
	"/assets/agentes-kz6poQ93.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1db7-PJfdNSnVhLp+SUItdr1k+KqL8DE\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 7607,
		"path": "../public/assets/agentes-kz6poQ93.js"
	},
	"/assets/alertas-WDVS1szP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e9d-VPSxBFeEx2uePGcMz2NLNrXWVxI\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 20125,
		"path": "../public/assets/alertas-WDVS1szP.js"
	},
	"/assets/alertas.functions-BoCFLF76.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ad-xo2N843qwueuhz0StpLUp1LtyqU\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 1453,
		"path": "../public/assets/alertas.functions-BoCFLF76.js"
	},
	"/assets/auditoria-6jXIIPjL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1abb-PnAME6wUPNhNdPgfsiNz0E0gxS0\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 6843,
		"path": "../public/assets/auditoria-6jXIIPjL.js"
	},
	"/assets/auth-DQp_b5HG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a7c-eykcy/WgBKnLu8u+9Zs7kSBfIXc\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 6780,
		"path": "../public/assets/auth-DQp_b5HG.js"
	},
	"/assets/auth-middleware-BvN2KJjw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-tK+ipIWqhEboWq2QdzGtSq6OObQ\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 77,
		"path": "../public/assets/auth-middleware-BvN2KJjw.js"
	},
	"/assets/browser-Bg25_sDh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bb5-e3s3wmPUZJZZ3aI9OoV3R4Ssaho\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 23477,
		"path": "../public/assets/browser-Bg25_sDh.js"
	},
	"/assets/callback-E0lOvkZ-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40d-vhJG/q6AINQ+/Lrq2sWnhUGD4Lk\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 1037,
		"path": "../public/assets/callback-E0lOvkZ-.js"
	},
	"/assets/cinap-TkpgxacE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34a-OucG44GaSIt27HPJraJBD3PQRXY\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 842,
		"path": "../public/assets/cinap-TkpgxacE.js"
	},
	"/assets/cinap-alertas-aatAzvb6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37f-wQqQu+phjNc7bY2l+H1UaUOpG0M\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 895,
		"path": "../public/assets/cinap-alertas-aatAzvb6.js"
	},
	"/assets/cinap-csv-rRoXtTqd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d2-RSWMANDBOATRc7E5wnxDRsyEFow\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 1746,
		"path": "../public/assets/cinap-csv-rRoXtTqd.js"
	},
	"/assets/cinap-filiacao-C9R45Soj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b9-KjbLvuMUJZiA5INUStanK1Pwnfo\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 953,
		"path": "../public/assets/cinap-filiacao-C9R45Soj.js"
	},
	"/assets/cinap-notificar-DYSJdDs4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-ZHgOiu4msyFLrfHGc9ewHsdUDqk\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 665,
		"path": "../public/assets/cinap-notificar-DYSJdDs4.js"
	},
	"/assets/cinap-pdf-B8rwS5Hq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"305b-snFcQXwUE2rh4ZzvqXIfbGZkEIU\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 12379,
		"path": "../public/assets/cinap-pdf-B8rwS5Hq.js"
	},
	"/assets/cinap-planilha-BUwOMUN5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fb-zPkhofnmelo0PDGMg771tsuM1a8\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 507,
		"path": "../public/assets/cinap-planilha-BUwOMUN5.js"
	},
	"/assets/configuracoes-BKprvpQz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1013-G2hvLuZGQUGmI7oP+pO3L50bWws\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 4115,
		"path": "../public/assets/configuracoes-BKprvpQz.js"
	},
	"/assets/congregacoes-BKDD8kkC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"198c-j0ooJ/UpjP6xUfEU068Tqf4zCYs\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 6540,
		"path": "../public/assets/congregacoes-BKDD8kkC.js"
	},
	"/assets/credenciais-CIh148bA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0e-/XjbOaRb+ttXdTC0dRs9WEt+QHc\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 3342,
		"path": "../public/assets/credenciais-CIh148bA.js"
	},
	"/assets/filiacao-DvxGi_0Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1150-eZeJ9YRNrZAM1vj8YdPpZCTr3QI\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 4432,
		"path": "../public/assets/filiacao-DvxGi_0Z.js"
	},
	"/assets/html2canvas-CA7kyov8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b46-1bD3NUT0o78L/KUDivNJ6s7fDy4\"",
		"mtime": "2026-08-28T18:05:16.035Z",
		"size": 199494,
		"path": "../public/assets/html2canvas-CA7kyov8.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"92b-QQNV3K/BFBhHdTzqOk1B2u918xk\"",
		"mtime": "2026-08-28T18:05:17.114Z",
		"size": 2347,
		"path": "../public/favicon.ico"
	},
	"/assets/index.es-CNHAvOs8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f83-uM3XoghEGgYVKaC3WGtIZse9Amc\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 151427,
		"path": "../public/assets/index.es-CNHAvOs8.js"
	},
	"/assets/jspdf.es.min-swb3xlsi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61698-kIXL8LyyshLCIJvJMcHv+ije2Mk\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 399e3,
		"path": "../public/assets/jspdf.es.min-swb3xlsi.js"
	},
	"/assets/minha-situacao-nUSw10Lo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2602-gK4UbqHPiDOut/RbQJ8oAyaFdZM\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 9730,
		"path": "../public/assets/minha-situacao-nUSw10Lo.js"
	},
	"/assets/obreiros-Db7QB-vW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bd6-gEIeBx25k2S9ZVb56ZQ0+d1/Kts\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 7126,
		"path": "../public/assets/obreiros-Db7QB-vW.js"
	},
	"/assets/pagamentos-B-_JqrG-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2867-lDGgx7KCeO+ScNfxruA58iHqpE8\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 10343,
		"path": "../public/assets/pagamentos-B-_JqrG-.js"
	},
	"/assets/painel-DY4VQHG5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63098-x35pe/6gAFUx+BTMFjzE0u44RA4\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 405656,
		"path": "../public/assets/painel-DY4VQHG5.js"
	},
	"/assets/perfis-D4m6X1VV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1001-wn1/Ou/w7LnOT2k32pj6I2Vx2Zw\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 4097,
		"path": "../public/assets/perfis-D4m6X1VV.js"
	},
	"/assets/purify.es-BVMDmQta.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ba-eN4IIuogHYJkQf/Tocsd/Egdkvc\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 26810,
		"path": "../public/assets/purify.es-BVMDmQta.js"
	},
	"/assets/react-dom-CMWFGuH-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e04-Oo3hkbBqAvs0wAc78JuNwb2hwvY\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 3588,
		"path": "../public/assets/react-dom-CMWFGuH-.js"
	},
	"/assets/redefinir-senha-CxSU0a8A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98c-85j6jSqnTAUq7MYAYVSQGnRRqmQ\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 2444,
		"path": "../public/assets/redefinir-senha-CxSU0a8A.js"
	},
	"/assets/retrato-obreiro-B1c_pLLK.jpg": {
		"type": "image/jpeg",
		"etag": "\"4555-afeW0X/DyLCOmtdknu3V6EaMTyI\"",
		"mtime": "2026-08-28T18:05:16.037Z",
		"size": 17749,
		"path": "../public/assets/retrato-obreiro-B1c_pLLK.jpg"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/route-DBE4c45w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-Us2jaQIi322t8KKxZyn378fRf3M\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 139,
		"path": "../public/assets/route-DBE4c45w.js"
	},
	"/assets/routes-ix5CV9Um.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6a-l+NVM9kscL9YWbS0MxSxxA6ftBI\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 2922,
		"path": "../public/assets/routes-ix5CV9Um.js"
	},
	"/assets/templates-email-EwrkCtn6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141c-2DrcLhEtvd/eINAjA6IlgyB8ijs\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 5148,
		"path": "../public/assets/templates-email-EwrkCtn6.js"
	},
	"/assets/styles-CWyn2qSR.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"144f4-4Yu3O29qAqTjRktcl//CLd9bumQ\"",
		"mtime": "2026-08-28T18:05:16.037Z",
		"size": 83188,
		"path": "../public/assets/styles-CWyn2qSR.css"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/useRouter-BP8vT1kh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f38-UAwyZ71XUq5pvhwLvcQ+ekWdEeM\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 7992,
		"path": "../public/assets/useRouter-BP8vT1kh.js"
	},
	"/assets/useServerFn-BL0m7cZM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19a-nU+IPP4nuEZU3iEA9qSD4gfqvI0\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 410,
		"path": "../public/assets/useServerFn-BL0m7cZM.js"
	},
	"/assets/useStore-Cne1crYO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac5-kbOzsIa7SSxDaqFh670ZR8UWgVw\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 19141,
		"path": "../public/assets/useStore-Cne1crYO.js"
	},
	"/assets/validar._registro-BlTSfTOY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-aJND5V4Jr9TfKgJwqJLqwJL8wCw\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 242,
		"path": "../public/assets/validar._registro-BlTSfTOY.js"
	},
	"/assets/validar._registro-BwV_CrRE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"183-50ZBQsdkN9TlHQTKAcpQaL4hSao\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 387,
		"path": "../public/assets/validar._registro-BwV_CrRE.js"
	},
	"/assets/validar._registro-DqQnGA_6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-RASuoLYgp15iBYJcbxKSSA2MvMQ\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 2470,
		"path": "../public/assets/validar._registro-DqQnGA_6.js"
	},
	"/assets/validar._registro-Dx2ljHfI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a0-244fT74r6We7FZYHBw4RTqmTKrw\"",
		"mtime": "2026-08-28T18:05:16.036Z",
		"size": 672,
		"path": "../public/assets/validar._registro-Dx2ljHfI.js"
	},
	"/assets/index-DpHvPrl3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cd49-GJ/UGqGAKJh4HbwSV1Y3Sz8cGsI\"",
		"mtime": "2026-08-28T18:05:16.034Z",
		"size": 576841,
		"path": "../public/assets/index-DpHvPrl3.js"
	},
	"/assets/xlsx-BivLitlN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67895-dC+M2iqlwnWyy5rqDFNMq/jNNIE\"",
		"mtime": "2026-08-28T18:05:16.036Z",
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
