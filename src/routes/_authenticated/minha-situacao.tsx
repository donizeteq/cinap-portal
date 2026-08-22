import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
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
import { gerarReciboPDF } from "@/lib/cinap-pdf";

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
            Procure a secretaria da convenção para vincular seu e-mail de acesso
            {usuario?.email ? ` (${usuario.email})` : ""} ao seu registro ministerial.
          </p>
        </div>
      </PortalShell>
    );
  }

  const o = obreiro.data;
  const total = (pagamentos.data ?? [])
    .filter((p) => p.status === "pago")
    .reduce((s, p) => s + Number(p.valor), 0);

  return (
    <PortalShell titulo="Minha Situação">
      <section className="grid gap-10 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col items-center gap-6 area-impressao">
          <CredencialMinisterial obreiro={o} congregacao={congregacao.data ?? undefined} />
          <button
            onClick={() => window.print()}
            className="no-print w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            Salvar credencial em PDF
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

          <div className="border border-border bg-surface">
            <div className="border-b border-border px-6 py-4">
              <h4 className="text-sm font-semibold uppercase tracking-widest">
                Histórico de contribuições
              </h4>
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

function Cartao({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-5">
      <p className="label-registro">{rotulo}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
