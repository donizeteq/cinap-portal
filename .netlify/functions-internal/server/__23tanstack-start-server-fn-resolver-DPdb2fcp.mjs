//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DPdb2fcp.js
var manifest = {
	"10fcaad296a6d120d9a603308fe0d5862bc7d03234f88482feb9563f53d49fac": {
		functionName: "listarAuditoria_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"154c5f42472fa31a4d736e577763fc4c30f442f6e467787a5e3aabc828772f93": {
		functionName: "alternarChaveAgente_createServerFn_handler",
		importer: () => import("./_ssr/agent-keys.functions-BWBO6Cti.mjs")
	},
	"30590d93081144bdc7679df9de369857ded610ac106c8047f3a81620d8c235f5": {
		functionName: "excluirChaveAgente_createServerFn_handler",
		importer: () => import("./_ssr/agent-keys.functions-BWBO6Cti.mjs")
	},
	"49018b8ca8659ee3774ee309323d443e73d3b3d69a1061c0c5293c2df488dc37": {
		functionName: "executarAlertasAgora_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"4a202fb3441f49709ca8a8ee5cb24c95d01ecc2a724cf092938e976c899763ec": {
		functionName: "decidirAvisos_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"4cba85d62c263c24f23710beabc7285230765df848eb14cb789603f889dd3fb3": {
		functionName: "salvarConfigAlertas_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"4dacb3b552407cc8f7269dec5dae4a7340e932142bec4540d0d1d9287c39727c": {
		functionName: "listarChavesAgente_createServerFn_handler",
		importer: () => import("./_ssr/agent-keys.functions-BWBO6Cti.mjs")
	},
	"6d656478ebb90d8372bff8f729691d44799cf573c336eb8da3b7686d200c8ac7": {
		functionName: "gerarPreviaAvisos_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"6f8cd21515d02442bf92835fc24d0a8289f362a173484ede67da052ae657fcd8": {
		functionName: "despacharAvisos_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"721c4b8769af64f54313e463f244a720a7b2ea731010483499ce0542268cc8eb": {
		functionName: "registrarAcaoSecretaria_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"8117230d6ee767213a57cf9e2a80a5bb57674aee3f17b73726f477a963d792c8": {
		functionName: "previewEmailAviso_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"9ad7363866483d40ea6b84449bcaccb9b8c588c72d166bb93a288dffc577935f": {
		functionName: "listarPerfisAcesso_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"9bba6c06ce0979300fe1d81d63a8be58c778a167cb21574019a42c94f5e5a7ca": {
		functionName: "definirPapelAcesso_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"c7cdd08b96f03e3bf2a72bbc061fc55d7ed63ce62f0176da731015a049cc7a78": {
		functionName: "criarChaveAgente_createServerFn_handler",
		importer: () => import("./_ssr/agent-keys.functions-BWBO6Cti.mjs")
	},
	"e64bfc9342fa31cd0c744b5c86bd590c3747f301b46afb6cf81fe71047bfc2e1": {
		functionName: "enviarEmailTeste_createServerFn_handler",
		importer: () => import("./_ssr/alertas.functions-0WKnLtTJ.mjs")
	},
	"fe4e5468035db65065b13fe27a195741c5f18e3d6c52437836572a82933af7ba": {
		functionName: "validarCredencial_createServerFn_handler",
		importer: () => import("./_ssr/credencial.functions-DD6DUwBs.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
