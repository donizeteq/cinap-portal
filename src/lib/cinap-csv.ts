/** Geração de CSV compatível com Excel pt-BR (separador ; e BOM UTF-8). */

function celula(valor: string | number) {
  const texto = typeof valor === "number" ? String(valor).replace(".", ",") : valor;
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function baixarCSV(nomeArquivo: string, linhas: (string | number)[][]) {
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

export interface LinhaResumoCSV {
  categoria: string;
  congregacoes: number;
  obreiros: number;
  quitados: number;
  arrecadado: number;
  previsto: number;
}

export interface LinhaCongregacaoCSV {
  nome: string;
  categoria: string;
  cidade: string;
  estado: string;
  obreiros: number;
  quitados: number;
  arrecadado: number;
  previsto: number;
}

export interface LinhaInadimplenteCSV {
  obreiro: string;
  registro: string;
  congregacao: string;
  categoria: string;
  meses: number;
  valor: number;
}

/** Relatório completo do painel em uma única planilha, respeitando os filtros. */
export function exportarPainelCSV(
  referencia: string,
  categoria: string,
  resumo: LinhaResumoCSV[],
  congregacoes: LinhaCongregacaoCSV[],
  inadimplentes: LinhaInadimplenteCSV[],
) {
  const linhas: (string | number)[][] = [
    ["CINAP - Relatorio do Painel de Controle"],
    ["Referencia", referencia],
    ["Categoria", categoria],
    ["Emitido em", new Date().toLocaleString("pt-BR")],
    [],
    ["ARRECADACAO POR CATEGORIA"],
    [
      "Categoria",
      "Congregacoes",
      "Obreiros",
      "Quitados",
      "Arrecadado",
      "Previsto",
      "Adimplencia %",
    ],
  ];

  for (const r of resumo) {
    linhas.push([
      r.categoria,
      r.congregacoes,
      r.obreiros,
      r.quitados,
      r.arrecadado,
      r.previsto,
      r.obreiros ? Math.round((r.quitados / r.obreiros) * 100) : 0,
    ]);
  }

  const total = resumo.reduce(
    (acc, r) => ({
      congregacoes: acc.congregacoes + r.congregacoes,
      obreiros: acc.obreiros + r.obreiros,
      quitados: acc.quitados + r.quitados,
      arrecadado: acc.arrecadado + r.arrecadado,
      previsto: acc.previsto + r.previsto,
    }),
    { congregacoes: 0, obreiros: 0, quitados: 0, arrecadado: 0, previsto: 0 },
  );
  linhas.push([
    "TOTAL GERAL",
    total.congregacoes,
    total.obreiros,
    total.quitados,
    total.arrecadado,
    total.previsto,
    total.obreiros ? Math.round((total.quitados / total.obreiros) * 100) : 0,
  ]);

  linhas.push([], ["TOTAIS POR CONGREGACAO"]);
  linhas.push([
    "Congregacao",
    "Categoria",
    "Cidade",
    "Estado",
    "Obreiros",
    "Quitados",
    "Arrecadado",
    "Previsto",
  ]);
  for (const c of congregacoes) {
    linhas.push([
      c.nome,
      c.categoria,
      c.cidade,
      c.estado,
      c.obreiros,
      c.quitados,
      c.arrecadado,
      c.previsto,
    ]);
  }

  linhas.push([], ["OBREIROS INADIMPLENTES"]);
  linhas.push([
    "Obreiro",
    "Registro",
    "Congregacao",
    "Categoria",
    "Meses em atraso",
    "Valor em aberto",
  ]);
  for (const i of inadimplentes) {
    linhas.push([i.obreiro, i.registro, i.congregacao, i.categoria, i.meses, i.valor]);
  }

  const arquivo = `cinap-painel-${referencia.replace("/", "-")}.csv`;
  baixarCSV(arquivo, linhas);
}
