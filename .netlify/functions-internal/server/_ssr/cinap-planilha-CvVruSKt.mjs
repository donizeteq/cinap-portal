//#region node_modules/.nitro/vite/services/ssr/assets/cinap-planilha-CvVruSKt.js
/** Geração de CSV compatível com Excel pt-BR (separador ; e BOM UTF-8). */
function celula(valor) {
	const texto = typeof valor === "number" ? String(valor).replace(".", ",") : valor;
	return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, "\"\"")}"` : texto;
}
function baixarCSV(nomeArquivo, linhas) {
	const conteudo = linhas.map((l) => l.map(celula).join(";")).join("\r\n");
	const blob = new Blob([`\uFEFF${conteudo}`], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = nomeArquivo;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
/** Exporta uma planilha .xlsx real (SheetJS) a partir de linhas simples. */
async function baixarXLSX(nomeArquivo, aba, linhas) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const ws = XLSX.utils.aoa_to_sheet(linhas);
	ws["!cols"] = (linhas[0] ?? []).map((_, i) => ({ wch: Math.min(42, Math.max(12, ...linhas.map((l) => String(l[i] ?? "").length + 2))) }));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, aba.slice(0, 28) || "Dados");
	XLSX.writeFile(wb, nomeArquivo.endsWith(".xlsx") ? nomeArquivo : `${nomeArquivo}.xlsx`);
}
/** Atalho para oferecer o mesmo conteúdo em CSV ou XLSX. */
async function baixarPlanilha(formato, nomeBase, aba, linhas) {
	if (formato === "csv") baixarCSV(`${nomeBase}.csv`, linhas);
	else await baixarXLSX(`${nomeBase}.xlsx`, aba, linhas);
}
//#endregion
export { baixarPlanilha as n, baixarCSV as t };
