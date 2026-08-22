import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  brl,
  categoriaClasses,
  dataBR,
  statusClasses,
  STATUS_LABEL,
  referenciaAtual,
  type Congregacao,
  type Obreiro,
  type Pagamento,
} from "@/lib/cinap";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel de Controle | CINAP" },
      {
        name: "description",
        content:
          "Visão consolidada da arrecadação, congregações ativas e situação dos obreiros da CINAP.",
      },
      { property: "og:title", content: "Painel de Controle | CINAP" },
      {
        property: "og:description",
        content: "Dashboard administrativo da Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Painel,
});

function Painel() {
  const { isAdmin, carregando } = usePapel();

  const dados = useQuery({
    queryKey: ["painel"],
    enabled: isAdmin,
    queryFn: async () => {
      const [c, o, p] = await Promise.all([
        supabase.from("congregacoes").select("*").order("nome"),
        supabase.from("obreiros").select("*").order("nome"),
        supabase.from("pagamentos").select("*").order("data", { ascending: false }),
      ]);
      if (c.error) throw c.error;
      if (o.error) throw o.error;
      if (p.error) throw p.error;
      return {
        congregacoes: c.data as unknown as Congregacao[],
        obreiros: o.data as unknown as Obreiro[],
        pagamentos: p.data as unknown as Pagamento[],
      };
    },
  });

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Painel de Controle Institucional">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Área exclusiva da secretaria</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Seu acesso é de obreiro. Consulte sua situação cadastral e financeira na área pessoal.
          </p>
          <Link
            to="/minha-situacao"
            className="mt-6 inline-flex bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Minha situação
          </Link>
        </div>
      </PortalShell>
    );
  }

  const congregacoes = dados.data?.congregacoes ?? [];
  const obreiros = dados.data?.obreiros ?? [];
  const pagamentos = dados.data?.pagamentos ?? [];

  const arrecadado = pagamentos
    .filter((p) => p.status === "pago")
    .reduce((soma, p) => soma + Number(p.valor), 0);
  const ativas = congregacoes.filter((c) => c.ativa).length;
  const adimplentes = obreiros.filter((o) => o.status_pagamento === "pago").length;
  const percentual = obreiros.length ? Math.round((adimplentes / obreiros.length) * 100) : 0;

  const referencia = referenciaAtual();
  const quitadosNoMes = new Set(
    pagamentos
      .filter((p) => p.referencia === referencia && p.status === "pago")
      .map((p) => p.obreiro_id),
  );
  const inadimplentesMes = obreiros.filter((o) => !quitadosNoMes.has(o.id));
  const valorInadimplente = inadimplentesMes.reduce((soma, o) => {
    const cong = congregacoes.find((c) => c.id === o.congregacao_id);
    return soma + Number(cong?.valor_mensalidade ?? 40);
  }, 0);

  return (
    <PortalShell titulo="Painel de Controle Institucional">
      <section className="grid gap-6 md:grid-cols-3">
        <div className="plate p-6">
          <p className="label-registro">Total arrecadado</p>
          <h3 className="mt-2 font-display text-3xl">{brl(arrecadado)}</h3>
          <div className="mt-4 w-fit bg-success/10 px-2 py-0.5 text-[10px] text-success">
            {pagamentos.filter((p) => p.status === "pago").length} contribuições quitadas
          </div>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Congregações ativas</p>
          <h3 className="mt-2 font-display text-3xl">{ativas}</h3>
          <p className="mt-4 text-[10px] text-muted-foreground">
            {congregacoes.filter((c) => c.categoria === "Bronze").length} Bronze ·{" "}
            {congregacoes.filter((c) => c.categoria === "Prata").length} Prata ·{" "}
            {congregacoes.filter((c) => c.categoria === "Ouro").length} Ouro
          </p>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Status dos obreiros</p>
          <h3 className="mt-2 font-display text-3xl">
            {adimplentes}{" "}
            <span className="text-sm text-muted-foreground">de {obreiros.length} adimplentes</span>
          </h3>
          <div className="mt-4 flex h-1 w-full overflow-hidden bg-muted">
            <div className="h-full bg-primary" style={{ width: `${percentual}%` }} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="plate p-6 md:col-span-2">
          <p className="label-registro">Inadimplentes do mês · Ref. {referencia}</p>
          <h3 className="mt-2 font-display text-3xl">
            {inadimplentesMes.length}{" "}
            <span className="text-sm text-muted-foreground">
              obreiros sem mensalidade quitada
            </span>
          </h3>
          <p className="mt-4 text-[10px] text-muted-foreground">
            Montante em aberto: {brl(valorInadimplente)}
          </p>
        </div>
        <div className="plate flex flex-col justify-between p-6">
          <div>
            <p className="label-registro">Tesouraria</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lance baixas e consulte o histórico de contribuições.
            </p>
          </div>
          <Link
            to="/pagamentos"
            className="mt-6 inline-flex w-fit bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Gerir pagamentos
          </Link>
        </div>
      </section>

      <section className="border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest">
            Congregações registradas
          </h4>
          <Link
            to="/congregacoes"
            className="border border-primary px-4 py-2 text-[11px] font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            GERENCIAR
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary">
                <Th>Nome da igreja</Th>
                <Th>Localidade</Th>
                <Th>Categoria</Th>
                <Th>Obreiros</Th>
                <Th>Mensalidade</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {congregacoes.slice(0, 6).map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-secondary/50">
                  <Td className="font-medium">{c.nome}</Td>
                  <Td className="text-muted-foreground">
                    {c.cidade}/{c.estado}
                  </Td>
                  <Td>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase ${categoriaClasses(c.categoria)}`}
                    >
                      {c.categoria}
                    </span>
                  </Td>
                  <Td className="text-muted-foreground">{c.qdt_obreiros}</Td>
                  <Td>{brl(Number(c.valor_mensalidade))}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest">Últimas contribuições</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary">
                <Th>Obreiro</Th>
                <Th>Referência</Th>
                <Th>Data</Th>
                <Th>Valor</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pagamentos.slice(0, 8).map((p) => {
                const obreiro = obreiros.find((o) => o.id === p.obreiro_id);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-secondary/50">
                    <Td className="font-medium">{obreiro?.nome ?? "—"}</Td>
                    <Td className="font-mono text-[11px]">{p.referencia}</Td>
                    <Td className="text-muted-foreground">{dataBR(p.data)}</Td>
                    <Td>{brl(Number(p.valor))}</Td>
                    <Td>
                      <span className={`px-2 py-0.5 text-[10px] uppercase ${statusClasses(p.status)}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="label-registro border-b border-border px-6 py-3 font-normal">{children}</th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border/60 px-6 py-4 ${className}`}>{children}</td>;
}
