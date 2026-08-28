import { baixarCSV } from "@/lib/cinap-csv";

export type Linha = (string | number)[];

/** Exporta uma planilha .xlsx real (SheetJS) a partir de linhas simples. */
export async function baixarXLSX(nomeArquivo: string, aba: string, linhas: Linha[]) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet(linhas);
  const larguras = (linhas[0] ?? []).map((_, i) => ({
    wch: Math.min(
      42,
      Math.max(12, ...linhas.map((l) => String(l[i] ?? "").length + 2)),
    ),
  }));
  ws["!cols"] = larguras;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, aba.slice(0, 28) || "Dados");
  XLSX.writeFile(wb, nomeArquivo.endsWith(".xlsx") ? nomeArquivo : `${nomeArquivo}.xlsx`);
}

/** Atalho para oferecer o mesmo conteúdo em CSV ou XLSX. */
export async function baixarPlanilha(
  formato: "csv" | "xlsx",
  nomeBase: string,
  aba: string,
  linhas: Linha[],
) {
  if (formato === "csv") baixarCSV(`${nomeBase}.csv`, linhas);
  else await baixarXLSX(`${nomeBase}.xlsx`, aba, linhas);
}
