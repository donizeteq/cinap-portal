import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { notificarStatusMensalidade } from "@/lib/cinap-notificar";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  brl,
  dataBR,
  MENSALIDADE_POR_CATEGORIA,
  referenciaAtual,
  STATUS_LABEL,
  statusClasses,
  type Congregacao,
  type Obreiro,
  type Pagamento,
} from "@/lib/cinap";
import { gerarRelatorioMensalPDF, gerarReciboPDF, resumoPorCategoria } from "@/lib/cinap-pdf";
import { baixarPlanilha } from "@/lib/cinap-planilha";

export const Route = createFileRoute("/_authenticated/pagamentos")({
  head: () => ({
    meta: [
      { title: "Mensalidades e Pagamentos | CINAP" },
      {
        name: "description",
        content:
          "Controle das mensalidades dos obreiros filiados: vencimentos, quitações e histórico de contribuições.",
      },
      { property: "og:title", content: "Mensalidades e Pagamentos | CINAP" },
      {
        property: "og:description",
        content: "Tesouraria da Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pagamentos,
});

/** Art. 8º — vencimento no dia 10 do mês de referência. */
function vencimentoDaReferencia(referencia: string): string {
  const [mes, ano] = referencia.split("/");
  return `${ano}-${mes}-10`;
}

type Situacao = "pago" | "pendente" | "vencido";

const SITUACAO_LABEL: Record<Situacao, string> = {
  pago: "Pago",
  pendente: "Pendente",
  vencido: "Vencido",
};

function situacaoClasses(s: Situacao): string {
  if (s === "pago") return "bg-success/10 text-success";
  if (s === "pendente") return "bg-warning/15 text-warning-foreground";
  return "bg-destructive/10 text-destructive";
}

function Pagamentos() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [historico, setHistorico] = useState<string | null>(null);

  const referencia = referenciaAtual();
  const vencimento = vencimentoDaReferencia(referencia);

  const dados = useQuery({
    queryKey: ["tesouraria"],
    enabled: isAdmin,
    queryFn: async () => {
      const [o, c, p] = await Promise.all([
        supabase.from("obreiros").select("*").order("nome"),
        supabase.from("congregacoes").select("*"),
        supabase.from("pagamentos").select("*").order("data", { ascending: false }),
      ]);
      if (o.error) throw o.error;
      if (c.error) throw c.error;
      if (p.error) throw p.error;
      return {
        obreiros: o.data as unknown as Obreiro[],
        congregacoes: c.data as unknown as Congregacao[],
        pagamentos: p.data as unknown as Pagamento[],
      };
    },
  });

  const obreiros = dados.data?.obreiros ?? [];
  const congregacoes = dados.data?.congregacoes ?? [];
  const pagamentos = dados.data?.pagamentos ?? [];

  function mensalidadeDe(obreiro: Obreiro): number {
    const cong = congregacoes.find((c) => c.id === obreiro.congregacao_id);
    return cong
      ? Number(cong.valor_mensalidade || MENSALIDADE_POR_CATEGORIA[cong.categoria])
      : MENSALIDADE_POR_CATEGORIA.Bronze;
  }

  function quitadoNoMes(obreiroId: string): Pagamento | undefined {
    return pagamentos.find(
      (p) => p.obreiro_id === obreiroId && p.referencia === referencia && p.status === "pago",
    );
  }

  function situacaoDe(obreiro: Obreiro): Situacao {
    if (quitadoNoMes(obreiro.id)) return "pago";
    return new Date().toISOString().slice(0, 10) > vencimento ? "vencido" : "pendente";
  }

  const registrar = useMutation({
    mutationFn: async (obreiro: Obreiro) => {
      const valor = mensalidadeDe(obreiro);
      const { error } = await supabase.from("pagamentos").insert({
        obreiro_id: obreiro.id,
        valor,
        data: new Date().toISOString().slice(0, 10),
        status: "pago",
        referencia,
      });
      if (error) throw error;
      const { error: erroObreiro } = await supabase
        .from("obreiros")
        .update({ status_pagamento: "pago" })
        .eq("id", obreiro.id);
      if (erroObreiro) throw erroObreiro;
      await notificarStatusMensalidade({
        obreiroId: obreiro.id,
        referencia,
        valor,
        destinatario: obreiro.email,
      });
    },
    onSuccess: () => {
      toast.success("Pagamento registrado e mensalidade quitada.");
      void queryClient.invalidateQueries({ queryKey: ["tesouraria"] });
      void queryClient.invalidateQueries({ queryKey: ["painel"] });
      void queryClient.invalidateQueries({ queryKey: ["obreiros"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function exportarRelatorio() {
    try {
      const resumo = resumoPorCategoria(
        referencia,
        congregacoes,
        obreiros,
        pagamentos,
        mensalidadeDe,
      );
      await gerarRelatorioMensalPDF(referencia, resumo);
      toast.success("Relatório mensal gerado em PDF.");
    } catch (erro) {
      toast.error((erro as Error).message);
    }
  }

  async function exportarPagamentos(formato: "csv" | "xlsx") {
    const linhas: (string | number)[][] = [
      ["CINAP - Historico de pagamentos"],
      ["Referencia", referencia],
      ["Emitido em", new Date().toLocaleString("pt-BR")],
      [],
      ["Congregacao", "Categoria", "Obreiro", "Registro", "Referencia", "Data", "Valor", "Status"],
    ];
    const ordenados = [...obreiros].sort((a, b) => {
      const ca = congregacoes.find((c) => c.id === a.congregacao_id)?.nome ?? "";
      const cb = congregacoes.find((c) => c.id === b.congregacao_id)?.nome ?? "";
      return ca.localeCompare(cb) || a.nome.localeCompare(b.nome);
    });
    for (const o of ordenados) {
      const cong = congregacoes.find((c) => c.id === o.congregacao_id);
      const lista = pagamentos.filter((p) => p.obreiro_id === o.id);
      if (lista.length === 0) {
        linhas.push([
          cong?.nome ?? "-",
          cong?.categoria ?? "-",
          o.nome,
          o.registro,
          referencia,
          "-",
          mensalidadeDe(o),
          "Sem lancamento",
        ]);
        continue;
      }
      for (const p of lista) {
        linhas.push([
          cong?.nome ?? "-",
          cong?.categoria ?? "-",
          o.nome,
          o.registro,
          p.referencia,
          dataBR(p.data),
          Number(p.valor),
          STATUS_LABEL[p.status],
        ]);
      }
    }
    await baixarPlanilha(formato, `cinap-pagamentos-${referencia.replace("/", "-")}`, "Pagamentos", linhas);
    toast.success("Histórico exportado.");
  }

  async function emitirRecibo(pagamento: Pagamento, obreiro: Obreiro) {
    try {
      const cong = congregacoes.find((c) => c.id === obreiro.congregacao_id);
      await gerarReciboPDF(pagamento, obreiro, cong);
      toast.success("Recibo emitido em PDF.");
    } catch (erro) {
      toast.error((erro as Error).message);
    }
  }

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Mensalidades e Pagamentos">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Somente a tesouraria pode lançar baixas</h3>
        </div>
      </PortalShell>
    );
  }

  const filtrados = obreiros.filter((o) => o.nome.toLowerCase().includes(busca.toLowerCase()));
  const inadimplentes = obreiros.filter((o) => situacaoDe(o) !== "pago");
  const arrecadadoMes = pagamentos
    .filter((p) => p.referencia === referencia && p.status === "pago")
    .reduce((soma, p) => soma + Number(p.valor), 0);

  const obreiroHistorico = obreiros.find((o) => o.id === historico);
  const listaHistorico = pagamentos.filter((p) => p.obreiro_id === historico);

  return (
    <PortalShell titulo="Mensalidades e Pagamentos">
      <section className="grid gap-6 md:grid-cols-3">
        <div className="plate p-6">
          <p className="label-registro">Referência {referencia}</p>
          <h3 className="mt-2 font-display text-3xl">{brl(arrecadadoMes)}</h3>
          <p className="mt-4 text-[10px] text-muted-foreground">
            Vencimento em {dataBR(vencimento)}
          </p>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Inadimplentes do mês</p>
          <h3 className="mt-2 font-display text-3xl">{inadimplentes.length}</h3>
          <p className="mt-4 text-[10px] text-muted-foreground">
            de {obreiros.length} obreiros filiados
          </p>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Previsto no mês</p>
          <h3 className="mt-2 font-display text-3xl">
            {brl(obreiros.reduce((s, o) => s + mensalidadeDe(o), 0))}
          </h3>
          <p className="mt-4 text-[10px] text-muted-foreground">Conforme Art. 7º</p>
        </div>
      </section>

      <section className="border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest">
            Mensalidades ({filtrados.length})
          </h4>
          <div className="flex items-center gap-3">
            <button
              onClick={exportarRelatorio}
              className="border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Relatório mensal (PDF)
            </button>
            <button
              onClick={() => void exportarPagamentos("csv")}
              className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              CSV
            </button>
            <button
              onClick={() => void exportarPagamentos("xlsx")}
              className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              XLSX
            </button>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar obreiro"
              className="w-48 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary">
                <Th>Obreiro</Th>
                <Th>Registro</Th>
                <Th>Referência</Th>
                <Th>Vencimento</Th>
                <Th>Valor</Th>
                <Th>Situação</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtrados.map((o) => {
                const situacao = situacaoDe(o);
                const quitado = quitadoNoMes(o.id);
                return (
                  <tr key={o.id} className="transition-colors hover:bg-secondary/50">
                    <Td className="font-medium">{o.nome}</Td>
                    <Td className="font-mono text-[11px] text-muted-foreground">{o.registro}</Td>
                    <Td className="font-mono text-[11px]">{referencia}</Td>
                    <Td className="text-muted-foreground">{dataBR(vencimento)}</Td>
                    <Td>{brl(mensalidadeDe(o))}</Td>
                    <Td>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase ${situacaoClasses(situacao)}`}
                      >
                        {SITUACAO_LABEL[situacao]}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        {quitado ? (
                          <>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              Quitado em {dataBR(quitado.data)}
                            </span>
                            <button
                              onClick={() => void emitirRecibo(quitado, o)}
                              className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                            >
                              Recibo
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => registrar.mutate(o)}
                            disabled={registrar.isPending}
                            className="bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            Registrar pagamento
                          </button>
                        )}
                        <button
                          onClick={() => setHistorico(o.id)}
                          className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          Histórico
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    Nenhum obreiro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {obreiroHistorico && (
        <section className="border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="label-registro">Histórico de contribuições</p>
              <h4 className="mt-1 font-display text-xl">{obreiroHistorico.nome}</h4>
            </div>
            <button
              onClick={() => setHistorico(null)}
              className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Fechar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-secondary">
                  <Th>Referência</Th>
                  <Th>Data</Th>
                  <Th>Valor</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {listaHistorico.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-secondary/50">
                    <Td className="font-mono text-[11px]">{p.referencia}</Td>
                    <Td className="text-muted-foreground">{dataBR(p.data)}</Td>
                    <Td>{brl(Number(p.valor))}</Td>
                    <Td>
                      <span className={`px-2 py-0.5 text-[10px] uppercase ${statusClasses(p.status)}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </Td>
                  </tr>
                ))}
                {listaHistorico.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      Nenhuma contribuição registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PortalShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="label-registro border-b border-border px-6 py-3 font-normal">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border/60 px-6 py-4 ${className}`}>{children}</td>;
}
