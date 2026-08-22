import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-keys-oVnL2XVT.js
function hashChave(chave) {
	return createHash("sha256").update(chave).digest("hex");
}
function gerarChaveAgente() {
	return `cinap-agent_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`;
}
//#endregion
export { hashChave as n, gerarChaveAgente as t };
