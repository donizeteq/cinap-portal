import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PortalShell } from "@/components/PortalShell";
import { CredencialMinisterial } from "@/components/CredencialMinisterial";
import { useSessao } from "@/hooks/use-cinap-auth";
import {
  brl,
  dataBR,
  STATUS_LABEL,
  statusClasses,
  type Congregacao,
  type Obreiro,
  type Pagamento,
} from "@/lib/cinap";
import { gerarCredencialPDF, gerarReciboPDF } from "@/lib/cinap-pdf";
import { baixarPlanilha } from "@/lib/cinap-planilha";
import type { Notificacao } from "@/lib/cinap-alertas";

export const Route = createFileRoute("/_authenticated/minha-situacao")({
  head: () => ({
    meta: [
      { title: "Minha Situação | CINAP" },
      {
        name: "description",
        content:
          "Área exclusiva do obreiro para consultar sua situação de contribuição e credencial ministerial.",
      },
      { property: "og:title", content: "Minha Situação | CINAP" },
      {
        property: "og:description",
        content: "Consulte sua credencial ministerial e o histórico de contribuições na CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinhaSituacao,
});

function MinhaSituacao() {
  const { session } = useSessao();
  const usuario = session?.user ?? null;

  const obreiro = useQuery({
    queryKey: ["meu-obreiro", usuario?.id],
    enabled: Boolean(usuario?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obreiros")
        .select("*")
        .eq("user_id", usuario!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Obreiro) ?? null;
    },
  });

  const congregacao = useQuery({
    queryKey: ["minha-congregacao", obreiro.data?.congregacao_id],
    enabled: Boolean(obreiro.data?.congregacao_id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("congregacoes")
        .select("*")
        .eq("id", obreiro.data!.congregacao_id!)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Congregacao) ?? null;
    },
  });

  const pagamentos = useQuery({
    queryKey: ["meus-pagamentos", obreiro.data?.id],
    enabled: Boolean(obreiro.data?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pagamentos")
        .select("*")
        .eq("obreiro_id", obreiro.data!.id)
        .order("data", { ascending: false });
      if (error) throw error;
      return data as unknown as Pagamento[];
    },
  });

  const avisos = useQuery({
    queryKey: ["meus-avisos", obreiro.data?.id],
    enabled: Boolean(obreiro.data?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("obreiro_id", obreiro.data!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as unknown as Notificacao[];
    },
  });

  if (obreiro.isLoading) {
    return (
      <PortalShell titulo="Minha Situação">
        <p className="text-sm text-muted-foreground">Consultando arquivo…</p>
      </PortalShell>
    );
  }

  if (!obreiro.data) {
    return (
      <PortalShell titulo="Minha Situação">
        <div className="plate p-12 text-center">
          <p className="label-registro">Registro não localizado</p>
          <h3 className="mt-3 font-display text-3xl">Seu cadastro ainda não foi vinculado</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Esta área mostra dados apenas para quem possui registro ministerial. Cadastre um obreiro
            com o e-mail de acesso
            {usuario?.email ? ` ${usuario.email}` : ""} em Obreiros para que os dados apareçam aqui.
          </p>
          <Link
            to="/obreiros"
            className="mt-6 inline-flex bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Ir para obreiros
          </Link>
        </div>
      </PortalShell>
    );
  }

  const o = obreiro.data;
  const total = (pagamentos.data ?? [])
    .filter((p) => p.status === "pago")
    .reduce((s, p) => s + Number(p.valor), 0);

  async function exportarMeuHistorico(formato: "csv" | "xlsx") {
    const linhas: (string | number)[][] = [
      ["CINAP - Historico de contribuicoes"],
      ["Obreiro", o.nome],
      ["Registro", o.registro],
      ["Congregacao", congregacao.data?.nome ?? "-"],
      ["Emitido em", new Date().toLocaleString("pt-BR")],
      [],
      ["Referencia", "Data", "Valor", "Status"],
      ...(pagamentos.data ?? []).map((p) => [
        p.referencia,
        dataBR(p.data),
        Number(p.valor),
        STATUS_LABEL[p.status],
      ]),
    ];
    await baixarPlanilha(
      formato,
      `cinap-minhas-contribuicoes-${o.registro}`,
      "Contribuicoes",
      linhas,
    );
  }

  return (
    <PortalShell titulo="Minha Situação">
      <section className="grid gap-10 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col items-center gap-6 area-impressao">
          <CredencialMinisterial obreiro={o} congregacao={congregacao.data ?? undefined} />
          <button
            onClick={() =>
              void gerarCredencialPDF(o, congregacao.data ?? undefined).then(
                () => toast.success("Credencial ministerial gerada em PDF."),
                (erro: Error) => toast.error(erro.message),
              )
            }
            className="no-print w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            Baixar credencial em PDF
          </button>
          <button
            onClick={() => window.print()}
            className="no-print w-full border border-border py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
          >
            Imprimir credencial
          </button>
        </div>

        <div className="space-y-8 no-print">
          <div className="grid gap-4 sm:grid-cols-3">
            <Cartao rotulo="Situação">
              <span className={`px-2 py-1 text-xs uppercase ${statusClasses(o.status_pagamento)}`}>
                {STATUS_LABEL[o.status_pagamento]}
              </span>
            </Cartao>
            <Cartao rotulo="Total contribuído">
              <span className="font-display text-3xl">{brl(total)}</span>
            </Cartao>
            <Cartao rotulo="Validade da credencial">
              <span className="font-display text-3xl">{dataBR(o.validade)}</span>
            </Cartao>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border bg-surface p-5">
              <p className="label-registro">Meus dados</p>
              <dl className="mt-3 space-y-1 text-sm">
                <Linha rotulo="Nome" valor={o.nome} />
                <Linha rotulo="Registro" valor={o.registro} />
                <Linha rotulo="Cargo" valor={o.cargo} />
                <Linha rotulo="E-mail" valor={o.email ?? "—"} />
              </dl>
            </div>
            <div className="border border-border bg-surface p-5">
              <p className="label-registro">Minha congregação</p>
              <dl className="mt-3 space-y-1 text-sm">
                <Linha rotulo="Congregação" valor={congregacao.data?.nome ?? "—"} />
                <Linha rotulo="Categoria" valor={congregacao.data?.categoria ?? "—"} />
                <Linha
                  rotulo="Cidade/UF"
                  valor={
                    congregacao.data
                      ? `${congregacao.data.cidade || "—"}/${congregacao.data.estado || "—"}`
                      : "—"
                  }
                />
                <Linha
                  rotulo="Mensalidade"
                  valor={congregacao.data ? brl(Number(congregacao.data.valor_mensalidade)) : "—"}
                />
              </dl>
            </div>
          </div>

          <div className="border border-border bg-surface">
            <div className="border-b border-border px-6 py-4">
              <h4 className="text-sm font-semibold uppercase tracking-widest">
                Meus avisos de mensalidade
              </h4>
            </div>
            <ul className="divide-y divide-border/60">
              {(avisos.data ?? []).map((n) => (
                <li key={n.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{n.titulo}</p>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {n.tipo === "vencimento" ? "Vencimento" : `Atraso ${n.meses_atraso}m`} ·{" "}
                      {new Date(n.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.mensagem}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Competência {n.referencia} · {brl(Number(n.valor ?? 0))}
                  </p>
                </li>
              ))}
              {(avisos.data ?? []).length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Nenhum aviso de mensalidade registrado. Sua situação está em dia.
                </li>
              )}
            </ul>
          </div>

          <div className="border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
              <h4 className="text-sm font-semibold uppercase tracking-widest">
                Histórico de contribuições
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => void exportarMeuHistorico("csv")}
                  className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
                >
                  CSV
                </button>
                <button
                  onClick={() => void exportarMeuHistorico("xlsx")}
                  className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
                >
                  XLSX
                </button>
              </div>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="label-registro border-b border-border px-6 py-3 font-normal">
                    Referência
                  </th>
                  <th className="label-registro border-b border-border px-6 py-3 font-normal">
                    Data
                  </th>
                  <th className="label-registro border-b border-border px-6 py-3 font-normal">
                    Valor
                  </th>
                  <th className="label-registro border-b border-border px-6 py-3 font-normal">
                    Status
                  </th>
                  <th className="label-registro border-b border-border px-6 py-3 font-normal">
                    Recibo
                  </th>
                </tr>
              </thead>
              <tbody>
                {(pagamentos.data ?? []).map((p) => (
                  <tr key={p.id}>
                    <td className="border-b border-border/60 px-6 py-4 font-mono text-xs">
                      {p.referencia}
                    </td>
                    <td className="border-b border-border/60 px-6 py-4 text-muted-foreground">
                      {dataBR(p.data)}
                    </td>
                    <td className="border-b border-border/60 px-6 py-4">{brl(Number(p.valor))}</td>
                    <td className="border-b border-border/60 px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase ${statusClasses(p.status)}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="border-b border-border/60 px-6 py-4">
                      {p.status === "pago" ? (
                        <button
                          onClick={() =>
                            void gerarReciboPDF(p, o, congregacao.data ?? undefined)
                          }
                          className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          Baixar PDF
                        </button>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {pagamentos.data?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Nenhuma contribuição registrada até o momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{rotulo}</dt>
      <dd className="text-right">{valor}</dd>
    </div>
  );
}

function Cartao({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-5">
      <p className="label-registro">{rotulo}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
