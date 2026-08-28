import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import { CONFIG_PADRAO, type ConfigAlertas } from "@/lib/cinap-alertas";
import { salvarConfigAlertas } from "@/lib/alertas.functions";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações de Cobrança | CINAP" },
      {
        name: "description",
        content:
          "Defina o dia de vencimento das contribuições e os níveis de atraso que disparam avisos aos obreiros da CINAP.",
      },
      { property: "og:title", content: "Configurações de Cobrança | CINAP" },
      {
        property: "og:description",
        content: "Parâmetros de vencimento e níveis de atraso dos avisos da CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Configuracoes,
});

const campo =
  "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Configuracoes() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const salvar = useServerFn(salvarConfigAlertas);
  const [form, setForm] = useState<ConfigAlertas>(CONFIG_PADRAO);

  const config = useQuery({
    queryKey: ["config-alertas"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_alertas")
        .select("*")
        .eq("id", true)
        .maybeSingle();
      if (error) throw error;
      return { ...CONFIG_PADRAO, ...(data ?? {}) } as unknown as ConfigAlertas;
    },
  });

  useEffect(() => {
    if (config.data) setForm(config.data);
  }, [config.data]);

  const gravar = useMutation({
    mutationFn: async () =>
      await salvar({
        data: {
          dia_vencimento: Number(form.dia_vencimento),
          dias_antes_aviso: Number(form.dias_antes_aviso),
          meses_intervalo_atraso: Number(form.meses_intervalo_atraso),
        },
      }),
    onSuccess: () => {
      toast.success("Parâmetros de cobrança salvos");
      queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (carregando) return null;
  if (!isAdmin) {
    return (
      <PortalShell titulo="Configurações">
        <p className="text-sm text-muted-foreground">Área restrita à Secretaria Geral.</p>
      </PortalShell>
    );
  }

  const niveis = [1, 2, 3].map((n) => Number(form.meses_intervalo_atraso || 1) * n);

  return (
    <PortalShell titulo="Configurações de cobrança">
      <section className="plate p-6">
        <p className="label-registro">Vencimento das contribuições</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Dia do vencimento (1 a 28)
            <input
              type="number"
              min={1}
              max={28}
              className={campo}
              value={form.dia_vencimento}
              onChange={(e) => setForm({ ...form, dia_vencimento: Number(e.target.value) })}
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Avisar quantos dias antes do vencimento
            <input
              type="number"
              min={0}
              max={20}
              className={campo}
              value={form.dias_antes_aviso}
              onChange={(e) => setForm({ ...form, dias_antes_aviso: Number(e.target.value) })}
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          A mensalidade estatutária (Art. 7º) vence todo dia {form.dia_vencimento} e o aviso prévio
          é emitido {form.dias_antes_aviso} dia(s) antes.
        </p>
      </section>

      <section className="plate p-6">
        <p className="label-registro">Níveis de atraso</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Repetir cobrança a cada X meses de atraso
            <input
              type="number"
              min={1}
              max={12}
              className={campo}
              value={form.meses_intervalo_atraso}
              onChange={(e) =>
                setForm({ ...form, meses_intervalo_atraso: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {niveis.map((m, i) => (
            <div key={m} className="border border-border bg-background p-4">
              <p className="label-registro">Nível {i + 1}</p>
              <p className="mt-2 font-display text-2xl">{m} {m === 1 ? "mês" : "meses"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {i === 0
                  ? "Primeiro aviso de inadimplência."
                  : i === 1
                    ? "Reforço de cobrança à congregação."
                    : "Situação crítica — avaliar suspensão da credencial."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="plate p-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => gravar.mutate()}
            disabled={gravar.isPending}
            className="border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
          >
            {gravar.isPending ? "Salvando..." : "Salvar parâmetros"}
          </button>
          <span className="text-xs text-muted-foreground">
            Remetente de e-mail, disparo e auditoria continuam na tela de Alertas.
          </span>
        </div>
      </section>
    </PortalShell>
  );
}
