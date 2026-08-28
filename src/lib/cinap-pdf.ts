import {
  brl,
  dataBR,
  type Categoria,
  type Congregacao,
  type Obreiro,
  type Pagamento,
} from "@/lib/cinap";

const MARGEM = 48;

async function novoDocumento() {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ unit: "pt", format: "a4" });
}

type Doc = Awaited<ReturnType<typeof novoDocumento>>;

function cabecalho(doc: Doc, titulo: string, subtitulo: string) {
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

function rodape(doc: Doc, nota: string) {
  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();
  doc.setDrawColor(210, 214, 220);
  doc.setLineWidth(0.6);
  doc.line(MARGEM, altura - 62, largura - MARGEM, altura - 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(130, 136, 148);
  doc.text(nota, MARGEM, altura - 46);
  doc.text(`Emitido em ${new Date().toLocaleString("pt-BR")}`, largura - MARGEM, altura - 46, {
    align: "right",
  });
}

function linhaTabela(
  doc: Doc,
  y: number,
  colunas: { texto: string; x: number; align?: "left" | "right" }[],
  negrito = false,
) {
  doc.setFont("helvetica", negrito ? "bold" : "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(negrito ? 30 : 60, negrito ? 41 : 68, negrito ? 59 : 82);
  for (const col of colunas) {
    doc.text(col.texto, col.x, y, { align: col.align ?? "left" });
  }
}

export interface ResumoCategoria {
  categoria: Categoria;
  congregacoes: number;
  obreiros: number;
  quitados: number;
  arrecadado: number;
  previsto: number;
}

export function resumoPorCategoria(
  referencia: string,
  congregacoes: Congregacao[],
  obreiros: Obreiro[],
  pagamentos: Pagamento[],
  mensalidadeDe: (obreiro: Obreiro) => number,
): ResumoCategoria[] {
  const categorias: Categoria[] = ["Bronze", "Prata", "Ouro"];
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
      previsto: doGrupo.reduce((s, o) => s + mensalidadeDe(o), 0),
    };
  });
}

export async function gerarRelatorioMensalPDF(
  referencia: string,
  resumo: ResumoCategoria[],
): Promise<void> {
  const doc = await novoDocumento();
  const largura = doc.internal.pageSize.getWidth();
  const direita = largura - MARGEM;

  cabecalho(
    doc,
    "Relatório Mensal de Arrecadação",
    `Referência ${referencia} — apuração por categoria de congregação (Art. 7º)`,
  );

  const colX = { cat: MARGEM, cong: 190, obr: 265, quit: 340, arr: 430, prev: direita };
  let y = 186;

  doc.setFillColor(240, 241, 244);
  doc.rect(MARGEM, y - 14, direita - MARGEM, 22, "F");
  linhaTabela(
    doc,
    y,
    [
      { texto: "CATEGORIA", x: colX.cat },
      { texto: "IGREJAS", x: colX.cong, align: "right" },
      { texto: "OBREIROS", x: colX.obr, align: "right" },
      { texto: "QUITADOS", x: colX.quit, align: "right" },
      { texto: "ARRECADADO", x: colX.arr, align: "right" },
      { texto: "PREVISTO", x: colX.prev, align: "right" },
    ],
    true,
  );

  y += 30;
  for (const linha of resumo) {
    linhaTabela(doc, y, [
      { texto: linha.categoria, x: colX.cat },
      { texto: String(linha.congregacoes), x: colX.cong, align: "right" },
      { texto: String(linha.obreiros), x: colX.obr, align: "right" },
      { texto: String(linha.quitados), x: colX.quit, align: "right" },
      { texto: brl(linha.arrecadado), x: colX.arr, align: "right" },
      { texto: brl(linha.previsto), x: colX.prev, align: "right" },
    ]);
    doc.setDrawColor(226, 229, 234);
    doc.setLineWidth(0.5);
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
  const indice = totalObreiros ? Math.round((totalQuitados / totalObreiros) * 100) : 0;

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
  doc.text(
    `Mensalidades vigentes (Art. 7º): Bronze ${brl(40)} | Prata ${brl(50)} | Ouro ${brl(60)}`,
    MARGEM,
    y,
  );

  rodape(doc, "Documento gerado pelo sistema de tesouraria da CINAP.");
  doc.save(`relatorio-cinap-${referencia.replace("/", "-")}.pdf`);
}

export async function gerarReciboPDF(
  pagamento: Pagamento,
  obreiro: Obreiro,
  congregacao?: Congregacao,
): Promise<void> {
  const doc = await novoDocumento();
  const largura = doc.internal.pageSize.getWidth();
  const direita = largura - MARGEM;

  cabecalho(
    doc,
    "Recibo de Pagamento de Mensalidade",
    `Recibo Nº ${pagamento.id.slice(0, 8).toUpperCase()} — referência ${pagamento.referencia}`,
  );

  let y = 190;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(1);
  doc.rect(MARGEM, y - 34, direita - MARGEM, 62);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 118, 132);
  doc.text("VALOR RECEBIDO", MARGEM + 14, y - 14);
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(30, 41, 59);
  doc.text(brl(Number(pagamento.valor)), MARGEM + 14, y + 14);

  const campos: [string, string][] = [
    ["Obreiro", obreiro.nome],
    ["Registro ministerial", obreiro.registro],
    ["Cargo", obreiro.cargo],
    [
      "Congregação",
      congregacao
        ? `${congregacao.nome} — ${congregacao.cidade}/${congregacao.estado}`
        : "Não vinculada",
    ],
    ["Categoria", congregacao ? congregacao.categoria : "—"],
    ["Referência", pagamento.referencia],
    ["Data do pagamento", dataBR(pagamento.data)],
    ["Situação", pagamento.status === "pago" ? "Quitado" : "Em aberto"],
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
    doc.setLineWidth(0.5);
    doc.line(MARGEM, y + 26, direita, y + 26);
    y += 46;
  }

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(90, 98, 112);
  const texto = doc.splitTextToSize(
    `Declaramos, para os devidos fins, haver recebido do obreiro acima identificado a importância de ${brl(Number(pagamento.valor))}, relativa à contribuição mensal prevista no Art. 7º do Estatuto da Convenção, referente ao período ${pagamento.referencia}.`,
    direita - MARGEM,
  );
  doc.text(texto, MARGEM, y);

  y += 22 * texto.length + 60;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.8);
  doc.line(MARGEM, y, MARGEM + 220, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 118, 132);
  doc.text("Tesouraria da CINAP", MARGEM, y + 14);

  rodape(doc, "Recibo válido como comprovante de quitação junto à convenção.");
  doc.save(`recibo-${obreiro.registro}-${pagamento.referencia.replace("/", "-")}.pdf`);
}

export interface LinhaCongregacao {
  nome: string;
  categoria: Categoria;
  cidade: string;
  estado: string;
  obreiros: number;
  quitados: number;
  arrecadado: number;
  previsto: number;
}

export async function gerarRelatorioPainelPDF(
  referencia: string,
  filtroCategoria: string,
  resumo: ResumoCategoria[],
  congregacoes: LinhaCongregacao[],
): Promise<void> {
  const doc = await novoDocumento();
  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();
  const direita = largura - MARGEM;

  cabecalho(
    doc,
    "Relatório do Painel de Controle",
    `Referência ${referencia} — categoria: ${filtroCategoria}`,
  );

  const colA = { cat: MARGEM, obr: 300, quit: 375, arr: 460, prev: direita };
  let y = 186;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 118, 132);
  doc.text("ARRECADAÇÃO E ADIMPLÊNCIA POR CATEGORIA", MARGEM, y - 22);

  doc.setFillColor(240, 241, 244);
  doc.rect(MARGEM, y - 14, direita - MARGEM, 22, "F");
  linhaTabela(
    doc,
    y,
    [
      { texto: "CATEGORIA", x: colA.cat },
      { texto: "OBREIROS", x: colA.obr, align: "right" },
      { texto: "QUITADOS", x: colA.quit, align: "right" },
      { texto: "ARRECADADO", x: colA.arr, align: "right" },
      { texto: "PREVISTO", x: colA.prev, align: "right" },
    ],
    true,
  );

  y += 30;
  for (const linha of resumo) {
    const taxa = linha.obreiros ? Math.round((linha.quitados / linha.obreiros) * 100) : 0;
    linhaTabela(doc, y, [
      { texto: `${linha.categoria} — ${taxa}% adimplência`, x: colA.cat },
      { texto: String(linha.obreiros), x: colA.obr, align: "right" },
      { texto: String(linha.quitados), x: colA.quit, align: "right" },
      { texto: brl(linha.arrecadado), x: colA.arr, align: "right" },
      { texto: brl(linha.previsto), x: colA.prev, align: "right" },
    ]);
    doc.setDrawColor(226, 229, 234);
    doc.setLineWidth(0.5);
    doc.line(MARGEM, y + 10, direita, y + 10);
    y += 28;
  }

  const totalArr = resumo.reduce((s, l) => s + l.arrecadado, 0);
  const totalPrev = resumo.reduce((s, l) => s + l.previsto, 0);
  const totalObr = resumo.reduce((s, l) => s + l.obreiros, 0);
  const totalQuit = resumo.reduce((s, l) => s + l.quitados, 0);

  y += 6;
  doc.setFillColor(15, 34, 64);
  doc.rect(MARGEM, y - 14, direita - MARGEM, 24, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL GERAL", colA.cat, y + 1);
  doc.text(String(totalObr), colA.obr, y + 1, { align: "right" });
  doc.text(String(totalQuit), colA.quit, y + 1, { align: "right" });
  doc.text(brl(totalArr), colA.arr, y + 1, { align: "right" });
  doc.text(brl(totalPrev), colA.prev, y + 1, { align: "right" });

  y += 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 118, 132);
  doc.text("TOTAIS POR CONGREGAÇÃO", MARGEM, y);
  y += 22;

  const colB = { nome: MARGEM, cat: 290, obr: 400, quit: 460, arr: direita };
  doc.setFillColor(240, 241, 244);
  doc.rect(MARGEM, y - 14, direita - MARGEM, 22, "F");
  linhaTabela(
    doc,
    y,
    [
      { texto: "CONGREGAÇÃO", x: colB.nome },
      { texto: "CATEG.", x: colB.cat },
      { texto: "OBR.", x: colB.obr, align: "right" },
      { texto: "QUIT.", x: colB.quit, align: "right" },
      { texto: "ARRECADADO", x: colB.arr, align: "right" },
    ],
    true,
  );
  y += 26;

  for (const c of congregacoes) {
    if (y > altura - 96) {
      doc.addPage();
      cabecalho(doc, "Relatório do Painel de Controle", `Referência ${referencia} (continuação)`);
      y = 186;
    }
    const nome = c.nome.length > 30 ? `${c.nome.slice(0, 29)}…` : c.nome;
    linhaTabela(doc, y, [
      { texto: `${nome} · ${c.cidade}/${c.estado}`, x: colB.nome },
      { texto: c.categoria, x: colB.cat },
      { texto: String(c.obreiros), x: colB.obr, align: "right" },
      { texto: String(c.quitados), x: colB.quit, align: "right" },
      { texto: brl(c.arrecadado), x: colB.arr, align: "right" },
    ]);
    doc.setDrawColor(232, 234, 238);
    doc.setLineWidth(0.5);
    doc.line(MARGEM, y + 9, direita, y + 9);
    y += 24;
  }

  if (y > altura - 130) {
    doc.addPage();
    cabecalho(doc, "Relatório do Painel de Controle", `Referência ${referencia} (continuação)`);
    y = 186;
  }

  const indice = totalObr ? Math.round((totalQuit / totalObr) * 100) : 0;
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 118, 132);
  doc.text("SÍNTESE", MARGEM, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(45, 55, 72);
  y += 20;
  doc.text(`Taxa geral de adimplência: ${indice}%`, MARGEM, y);
  y += 18;
  doc.text(`Valor em aberto no período: ${brl(Math.max(totalPrev - totalArr, 0))}`, MARGEM, y);

  rodape(doc, "Relatório gerado pelo painel de controle da CINAP.");
  doc.save(`painel-cinap-${referencia.replace("/", "-")}.pdf`);
}

/** Credencial ministerial em PDF (cartão institucional, frente e verso). */
export async function gerarCredencialPDF(
  obreiro: Obreiro,
  congregacao?: Congregacao,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: QRCode } = await import("qrcode");
  const { urlValidacao } = await import("@/lib/cinap-filiacao");
  const linkValidacao = urlValidacao(obreiro.registro);
  const qr = await QRCode.toDataURL(linkValidacao, {
    margin: 0,
    width: 320,
    color: { dark: "#0F2240", light: "#FFFFFF" },
  });
  const doc = new jsPDF({ unit: "pt", format: [242, 396], orientation: "landscape" });
  const L = 396;
  const A = 242;
  const m = 22;

  const desenharMoldura = () => {
    doc.setFillColor(15, 34, 64);
    doc.rect(0, 0, L, A, "F");
    doc.setDrawColor(217, 167, 74);
    doc.setLineWidth(1);
    doc.rect(10, 10, L - 20, A - 20);
  };

  // ——— Frente
  desenharMoldura();
  doc.setFillColor(217, 167, 74);
  doc.rect(10, 10, L - 20, 3, "F");

  doc.setFont("times", "bolditalic");
  doc.setFontSize(20);
  doc.setTextColor(217, 167, 74);
  doc.text("CINAP", m, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.6);
  doc.setTextColor(226, 232, 240);
  doc.text("CONVENÇÃO DAS IGREJAS NACIONAIS AUTÔNOMAS", m, 58);
  doc.text("CREDENCIAL MINISTERIAL", L - m, 58, { align: "right" });

  doc.setDrawColor(60, 84, 120);
  doc.setLineWidth(0.6);
  doc.line(m, 70, L - m, 70);

  doc.setFont("times", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(doc.splitTextToSize(obreiro.nome, L - m * 2)[0] ?? obreiro.nome, m, 96);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(217, 167, 74);
  doc.text(obreiro.cargo.toUpperCase(), m, 110);

  const campos: [string, string][] = [
    ["REGISTRO", obreiro.registro],
    ["CONGREGAÇÃO", congregacao ? congregacao.nome : "Não vinculada"],
    ["LOCALIDADE", congregacao ? `${congregacao.cidade}/${congregacao.estado}` : "—"],
    ["VALIDADE", dataBR(obreiro.validade)],
  ];
  let y = 138;
  for (const [rotulo, valor] of campos) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.6);
    doc.setTextColor(148, 163, 184);
    doc.text(rotulo, m, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(240, 244, 250);
    doc.text(doc.splitTextToSize(valor, L - m * 2 - 90)[0] ?? valor, m, y + 12);
    y += 28;
  }

  doc.setFillColor(255, 255, 255);
  doc.rect(L - m - 70, 118, 70, 70, "F");
  doc.addImage(qr, "PNG", L - m - 67, 121, 64, 64);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4.6);
  doc.setTextColor(217, 167, 74);
  doc.text("VALIDE PELO QR CODE", L - m - 35, 196, { align: "center" });

  doc.setFontSize(5.4);
  doc.setTextColor(148, 163, 184);
  doc.text(`Documento nº ${obreiro.id.slice(0, 8).toUpperCase()}`, m, A - 20);

  // ——— Verso
  doc.addPage([242, 396], "landscape");
  desenharMoldura();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(217, 167, 74);
  doc.text("VALIDAÇÃO E CONDIÇÕES DE USO", m, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  doc.setTextColor(214, 222, 234);
  const texto = doc.splitTextToSize(
    `Esta credencial identifica o portador como obreiro filiado à Convenção das Igrejas Nacionais Autônomas, nos termos do Estatuto. Sua validade está condicionada à regularidade das contribuições mensais previstas no Art. 7º. Documento pessoal e intransferível; em caso de perda, comunique imediatamente a Secretaria Geral.`,
    L - m * 2,
  );
  doc.text(texto, m, 66);

  doc.setDrawColor(60, 84, 120);
  doc.line(m, A - 72, L - m, A - 72);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.6);
  doc.setTextColor(148, 163, 184);
  doc.text(`Situação de contribuição: ${obreiro.status_pagamento.toUpperCase()}`, m, A - 56);
  doc.text(`Emitida em ${new Date().toLocaleDateString("pt-BR")}`, m, A - 44);
  doc.setDrawColor(217, 167, 74);
  doc.line(L - m - 130, A - 44, L - m, A - 44);
  doc.text("Secretaria Geral da CINAP", L - m, A - 32, { align: "right" });
  doc.setFontSize(4.8);
  doc.text(`Validação pública: ${linkValidacao}`, m, A - 32);

  doc.save(`credencial-${obreiro.registro}.pdf`);
}
