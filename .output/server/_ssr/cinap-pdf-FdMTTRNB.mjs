import { a as brl, s as dataBR } from "./cinap-PoyC-pfo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cinap-pdf-FdMTTRNB.js
var MARGEM = 48;
async function novoDocumento() {
	const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => n.t);
	return new jsPDF({
		unit: "pt",
		format: "a4"
	});
}
function cabecalho(doc, titulo, subtitulo) {
	const largura = doc.internal.pageSize.getWidth();
	doc.setDrawColor(30, 41, 59);
	doc.setLineWidth(1.2);
	doc.line(MARGEM, 96, largura - MARGEM, 96);
	doc.setFont("times", "bolditalic");
	doc.setFontSize(22);
	doc.setTextColor(30, 41, 59);
	doc.text("CINAP", MARGEM, 66);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(7.5);
	doc.setTextColor(110, 118, 132);
	doc.text("CONVENÇÃO DAS IGREJAS NACIONAIS AUTÔNOMAS", MARGEM, 80);
	doc.text("REGISTRO NACIONAL Nº 482-B", largura - MARGEM, 80, { align: "right" });
	doc.setFont("times", "bold");
	doc.setFontSize(16);
	doc.setTextColor(30, 41, 59);
	doc.text(titulo, MARGEM, 130);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(110, 118, 132);
	doc.text(subtitulo, MARGEM, 146);
}
function rodape(doc, nota) {
	const largura = doc.internal.pageSize.getWidth();
	const altura = doc.internal.pageSize.getHeight();
	doc.setDrawColor(210, 214, 220);
	doc.setLineWidth(.6);
	doc.line(MARGEM, altura - 62, largura - MARGEM, altura - 62);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(7.5);
	doc.setTextColor(130, 136, 148);
	doc.text(nota, MARGEM, altura - 46);
	doc.text(`Emitido em ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}`, largura - MARGEM, altura - 46, { align: "right" });
}
function linhaTabela(doc, y, colunas, negrito = false) {
	doc.setFont("helvetica", negrito ? "bold" : "normal");
	doc.setFontSize(9.5);
	doc.setTextColor(negrito ? 30 : 60, negrito ? 41 : 68, negrito ? 59 : 82);
	for (const col of colunas) doc.text(col.texto, col.x, y, { align: col.align ?? "left" });
}
function resumoPorCategoria(referencia, congregacoes, obreiros, pagamentos, mensalidadeDe) {
	const categorias = [
		"Bronze",
		"Prata",
		"Ouro"
	];
	const pagosMes = pagamentos.filter((p) => p.referencia === referencia && p.status === "pago");
	return categorias.map((categoria) => {
		const idsCong = new Set(congregacoes.filter((c) => c.categoria === categoria).map((c) => c.id));
		const doGrupo = obreiros.filter((o) => o.congregacao_id && idsCong.has(o.congregacao_id));
		const idsObreiros = new Set(doGrupo.map((o) => o.id));
		const pagosGrupo = pagosMes.filter((p) => idsObreiros.has(p.obreiro_id));
		return {
			categoria,
			congregacoes: idsCong.size,
			obreiros: doGrupo.length,
			quitados: pagosGrupo.length,
			arrecadado: pagosGrupo.reduce((s, p) => s + Number(p.valor), 0),
			previsto: doGrupo.reduce((s, o) => s + mensalidadeDe(o), 0)
		};
	});
}
async function gerarRelatorioMensalPDF(referencia, resumo) {
	const doc = await novoDocumento();
	const direita = doc.internal.pageSize.getWidth() - MARGEM;
	cabecalho(doc, "Relatório Mensal de Arrecadação", `Referência ${referencia} — apuração por categoria de congregação (Art. 7º)`);
	const colX = {
		cat: MARGEM,
		cong: 190,
		obr: 265,
		quit: 340,
		arr: 430,
		prev: direita
	};
	let y = 186;
	doc.setFillColor(240, 241, 244);
	doc.rect(MARGEM, y - 14, direita - MARGEM, 22, "F");
	linhaTabela(doc, y, [
		{
			texto: "CATEGORIA",
			x: colX.cat
		},
		{
			texto: "IGREJAS",
			x: colX.cong,
			align: "right"
		},
		{
			texto: "OBREIROS",
			x: colX.obr,
			align: "right"
		},
		{
			texto: "QUITADOS",
			x: colX.quit,
			align: "right"
		},
		{
			texto: "ARRECADADO",
			x: colX.arr,
			align: "right"
		},
		{
			texto: "PREVISTO",
			x: colX.prev,
			align: "right"
		}
	], true);
	y += 30;
	for (const linha of resumo) {
		linhaTabela(doc, y, [
			{
				texto: linha.categoria,
				x: colX.cat
			},
			{
				texto: String(linha.congregacoes),
				x: colX.cong,
				align: "right"
			},
			{
				texto: String(linha.obreiros),
				x: colX.obr,
				align: "right"
			},
			{
				texto: String(linha.quitados),
				x: colX.quit,
				align: "right"
			},
			{
				texto: brl(linha.arrecadado),
				x: colX.arr,
				align: "right"
			},
			{
				texto: brl(linha.previsto),
				x: colX.prev,
				align: "right"
			}
		]);
		doc.setDrawColor(226, 229, 234);
		doc.setLineWidth(.5);
		doc.line(MARGEM, y + 10, direita, y + 10);
		y += 28;
	}
	const totalArrecadado = resumo.reduce((s, l) => s + l.arrecadado, 0);
	const totalPrevisto = resumo.reduce((s, l) => s + l.previsto, 0);
	const totalCongregacoes = resumo.reduce((s, l) => s + l.congregacoes, 0);
	const totalObreiros = resumo.reduce((s, l) => s + l.obreiros, 0);
	const totalQuitados = resumo.reduce((s, l) => s + l.quitados, 0);
	y += 6;
	doc.setFillColor(30, 41, 59);
	doc.rect(MARGEM, y - 14, direita - MARGEM, 24, "F");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9.5);
	doc.setTextColor(255, 255, 255);
	doc.text("TOTAL GERAL", colX.cat, y + 1);
	doc.text(String(totalCongregacoes), colX.cong, y + 1, { align: "right" });
	doc.text(String(totalObreiros), colX.obr, y + 1, { align: "right" });
	doc.text(String(totalQuitados), colX.quit, y + 1, { align: "right" });
	doc.text(brl(totalArrecadado), colX.arr, y + 1, { align: "right" });
	doc.text(brl(totalPrevisto), colX.prev, y + 1, { align: "right" });
	y += 58;
	const inadimplencia = totalPrevisto - totalArrecadado;
	const indice = totalObreiros ? Math.round(totalQuitados / totalObreiros * 100) : 0;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	doc.setTextColor(110, 118, 132);
	doc.text("SÍNTESE DA TESOURARIA", MARGEM, y);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(45, 55, 72);
	y += 20;
	doc.text(`Índice de adimplência: ${indice}%`, MARGEM, y);
	y += 18;
	doc.text(`Valor em aberto no mês: ${brl(inadimplencia)}`, MARGEM, y);
	y += 18;
	doc.text(`Mensalidades vigentes (Art. 7º): Bronze ${brl(40)} | Prata ${brl(50)} | Ouro ${brl(60)}`, MARGEM, y);
	rodape(doc, "Documento gerado pelo sistema de tesouraria da CINAP.");
	doc.save(`relatorio-cinap-${referencia.replace("/", "-")}.pdf`);
}
async function gerarReciboPDF(pagamento, obreiro, congregacao) {
	const doc = await novoDocumento();
	const direita = doc.internal.pageSize.getWidth() - MARGEM;
	cabecalho(doc, "Recibo de Pagamento de Mensalidade", `Recibo Nº ${pagamento.id.slice(0, 8).toUpperCase()} — referência ${pagamento.referencia}`);
	let y = 190;
	doc.setDrawColor(30, 41, 59);
	doc.setLineWidth(1);
	doc.rect(MARGEM, y - 34, direita - MARGEM, 62);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	doc.setTextColor(110, 118, 132);
	doc.text("VALOR RECEBIDO", 62, y - 14);
	doc.setFont("times", "bold");
	doc.setFontSize(24);
	doc.setTextColor(30, 41, 59);
	doc.text(brl(Number(pagamento.valor)), 62, y + 14);
	const campos = [
		["Obreiro", obreiro.nome],
		["Registro ministerial", obreiro.registro],
		["Cargo", obreiro.cargo],
		["Congregação", congregacao ? `${congregacao.nome} — ${congregacao.cidade}/${congregacao.estado}` : "Não vinculada"],
		["Categoria", congregacao ? congregacao.categoria : "—"],
		["Referência", pagamento.referencia],
		["Data do pagamento", dataBR(pagamento.data)],
		["Situação", pagamento.status === "pago" ? "Quitado" : "Em aberto"]
	];
	y += 62;
	for (const [rotulo, valor] of campos) {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7.5);
		doc.setTextColor(130, 136, 148);
		doc.text(rotulo.toUpperCase(), MARGEM, y);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		doc.setTextColor(45, 55, 72);
		doc.text(valor, MARGEM, y + 16);
		doc.setDrawColor(226, 229, 234);
		doc.setLineWidth(.5);
		doc.line(MARGEM, y + 26, direita, y + 26);
		y += 46;
	}
	y += 14;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9.5);
	doc.setTextColor(90, 98, 112);
	const texto = doc.splitTextToSize(`Declaramos, para os devidos fins, haver recebido do obreiro acima identificado a importância de ${brl(Number(pagamento.valor))}, relativa à contribuição mensal prevista no Art. 7º do Estatuto da Convenção, referente ao período ${pagamento.referencia}.`, direita - MARGEM);
	doc.text(texto, MARGEM, y);
	y += 22 * texto.length + 60;
	doc.setDrawColor(30, 41, 59);
	doc.setLineWidth(.8);
	doc.line(MARGEM, y, 268, y);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(110, 118, 132);
	doc.text("Tesouraria da CINAP", MARGEM, y + 14);
	rodape(doc, "Recibo válido como comprovante de quitação junto à convenção.");
	doc.save(`recibo-${obreiro.registro}-${pagamento.referencia.replace("/", "-")}.pdf`);
}
//#endregion
export { gerarRelatorioMensalPDF as n, resumoPorCategoria as r, gerarReciboPDF as t };
