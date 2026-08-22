import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { CredencialMinisterial } from "@/components/CredencialMinisterial";
import { usePapel } from "@/hooks/use-cinap-auth";
import { STATUS_LABEL, statusClasses, type Congregacao, type Obreiro } from "@/lib/cinap";

export const Route = createFileRoute("/_authenticated/credenciais")({
  head: () => ({
    meta: [
      { title: "Credencial Ministerial | CINAP" },
      {
        name: "description",
        content:
          "Emissão da credencial ministerial digital dos obreiros, pronta para impressão em PDF.",
      },
      { property: "og:title", content: "Credencial Ministerial | CINAP" },
      {
        property: "og:description",
        content: "Gere e imprima a credencial ministerial digital de cada obreiro filiado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Credenciais,
});

function Credenciais() {
  const { isAdmin, carregando } = usePapel();
  const [selecionado, setSelecionado] = useState<string>("");

  const obreiros = useQuery({
    queryKey: ["obreiros"],
    queryFn: async () => {
      const { data, error } = await supabase.from("obreiros").select("*").order("nome");
      if (error) throw error;
      return data as unknown as Obreiro[];
    },
  });

  const congregacoes = useQuery({
    queryKey: ["congregacoes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("congregacoes").select("*").order("nome");
      if (error) throw error;
      return data as unknown as Congregacao[];
    },
  });

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Credenciais">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Somente a secretaria emite credenciais</h3>
        </div>
      </PortalShell>
    );
  }

  const obreiro = (obreiros.data ?? []).find((o) => o.id === selecionado);
  const congregacao = congregacoes.data?.find((c) => c.id === obreiro?.congregacao_id);

  return (
    <PortalShell titulo="Credencial Ministerial">
      <section className="grid gap-10 lg:grid-cols-[340px_1fr]">
        <div className="h-fit border border-border bg-surface p-6 no-print">
          <p className="label-registro">Emissão</p>
          <h4 className="mt-1 font-display text-2xl">Selecionar obreiro</h4>

          <div className="mt-6 max-h-[520px] space-y-1 overflow-y-auto pr-1">
            {(obreiros.data ?? []).map((o) => (
              <button
                key={o.id}
                onClick={() => setSelecionado(o.id)}
                className={`flex w-full items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors ${
                  o.id === selecionado
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-secondary"
                }`}
              >
                <span>
                  <span className="block font-medium">{o.nome}</span>
                  <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                    {o.registro}
                  </span>
                </span>
                <span className={`px-2 py-0.5 text-[9px] uppercase ${statusClasses(o.status_pagamento)}`}>
                  {STATUS_LABEL[o.status_pagamento]}
                </span>
              </button>
            ))}
            {obreiros.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum obreiro registrado ainda.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-start gap-8 border border-border bg-secondary/40 p-10 area-impressao">
          {obreiro ? (
            <>
              <CredencialMinisterial obreiro={obreiro} congregacao={congregacao} />
              <button
                onClick={() => window.print()}
                className="no-print bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                Visualizar / salvar em PDF
              </button>
              {obreiro.status_pagamento !== "pago" && (
                <p className="no-print max-w-xs text-center text-xs text-destructive">
                  Atenção: obreiro em situação {STATUS_LABEL[obreiro.status_pagamento].toLowerCase()}.
                  A credencial só tem validade com contribuição em dia.
                </p>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="label-registro">Nenhuma seleção</p>
              <h3 className="mt-3 font-display text-2xl">
                Escolha um obreiro para emitir a credencial
              </h3>
            </div>
          )}
        </div>
      </section>
    </PortalShell>
  );
}
