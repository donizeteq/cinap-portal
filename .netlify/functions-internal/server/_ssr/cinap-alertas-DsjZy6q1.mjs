//#region node_modules/.nitro/vite/services/ssr/assets/cinap-alertas-DsjZy6q1.js
var CONFIG_PADRAO = {
	id: true,
	remetente_nome: "CINAP - Secretaria Geral",
	remetente_email: "",
	dominio_email: "",
	dia_vencimento: 10,
	dias_antes_aviso: 3,
	meses_intervalo_atraso: 1,
	emails_ativos: false,
	copia_admin: "",
	ultima_execucao: null,
	updated_at: (/* @__PURE__ */ new Date()).toISOString(),
	assunto_vencimento: "CINAP · Mensalidade de {{referencia}} a vencer",
	corpo_vencimento: "A contribuição referente a {{referencia}} vence no dia {{dia_vencimento}}.\nRegularize a mensalidade para manter sua credencial ministerial ativa.",
	assunto_atraso: "CINAP · {{meses}} mensalidade(s) em aberto",
	corpo_atraso: "Constam {{meses}} mensalidade(s) em aberto, desde a competência {{referencia}}.\nProcure a tesouraria da sua congregação para regularização.",
	rodape_email: "Em caso de dúvida, procure a tesouraria da sua congregação."
};
var VARIAVEIS_DISPONIVEIS = [
	"{{nome}}",
	"{{referencia}}",
	"{{valor}}",
	"{{dia_vencimento}}",
	"{{meses}}",
	"{{congregacao}}"
];
/** Substitui os marcadores {{...}} do template configurado pela secretaria. */
function aplicarVariaveis(texto, v) {
	return texto.replace(/\{\{\s*nome\s*\}\}/g, v.nome).replace(/\{\{\s*referencia\s*\}\}/g, v.referencia).replace(/\{\{\s*valor\s*\}\}/g, v.valor).replace(/\{\{\s*dia_vencimento\s*\}\}/g, String(v.dia_vencimento)).replace(/\{\{\s*meses\s*\}\}/g, String(v.meses)).replace(/\{\{\s*congregacao\s*\}\}/g, v.congregacao ?? "");
}
/** Quebra o corpo configurado em parágrafos já com variáveis aplicadas. */
function paragrafosDoTemplate(texto, v) {
	return aplicarVariaveis(texto, v).split("\n").map((l) => l.trim()).filter(Boolean);
}
/** Referência de competência no formato MM/AAAA. */
function refDe(mes, ano) {
	return `${String(mes).padStart(2, "0")}/${ano}`;
}
/** Converte MM/AAAA em índice absoluto de meses, para calcular atrasos. */
function indiceRef(referencia) {
	const [mes, ano] = referencia.split("/").map(Number);
	return (ano ?? 0) * 12 + (mes ?? 1) - 1;
}
function refDoIndice(indice) {
	return refDe(indice % 12 + 1, Math.floor(indice / 12));
}
//#endregion
export { CONFIG_PADRAO, VARIAVEIS_DISPONIVEIS, aplicarVariaveis, indiceRef, paragrafosDoTemplate, refDe, refDoIndice };
