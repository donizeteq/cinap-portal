import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  CONFIG_PADRAO,
  VARIAVEIS_DISPONIVEIS,
  type ConfigAlertas,
} from "@/lib/cinap-alertas";
import { previewEmailAviso, salvarConfigAlertas } from "@/lib/alertas.functions";

export const Route = createFileRoute("/_authenticated/templates-email")({
  head: () => ({
    meta: [
      { title: "Templates de E-mail | CINAP" },
      {
        name: "description",
        content:
          "Personalize o assunto e o texto dos avisos de vencimento e de inadimplência enviados aos obreiros da CINAP.",
      },
      { property: "og:title", content: "Templates de E-mail | CINAP" },
      {
        property: "og:description",
        content: "Editor e pré-visualização dos e-mails institucionais de aviso da CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TemplatesEmail,
});

const campo =
  "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function TemplatesEmail() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const salvar = useServerFn(salvarConfigAlertas);
  const preview = useServerFn(previewEmailAviso);
  const [form, setForm] = useState<ConfigAlertas>(CONFIG_PADRAO);
  const [tipo, setTipo] = useState<"vencimento" | "atraso">("vencimento");
  const [html, setHtml] = useState("");
  const [assuntoPreview, setAssuntoPreview] = useState("");

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
          assunto_vencimento: form.assunto_vencimento,
          corpo_vencimento: form.corpo_vencimento,
          assunto_atraso: form.assunto_atraso,
          corpo_atraso: form.corpo_atraso,
          rodape_email: form.rodape_email,
        },
      }),
    onSuccess: () => {
      toast.success("Templates de e-mail salvos");
      queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const visualizar = useMutation({
    mutationFn: async () =>
      await preview({
        data: {
          tipo,
          assunto: tipo === "vencimento" ? form.assunto_vencimento : form.assunto_atraso,
          corpo: tipo === "vencimento" ? form.corpo_vencimento : form.corpo_atraso,
          rodape: form.rodape_email,
          remetente_nome: form.remetente_nome,
        },
      }),
    onSuccess: (r) => {
      setHtml(r.html);
      setAssuntoPreview(r.assunto);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (carregando) return null;
  if (!isAdmin) {
    return (
      <PortalShell titulo="Templates de e-mail">
        <p className="text-sm text-muted-foreground">Área restrita à Secretaria Geral.</p>
      </PortalShell>
    );
  }

  return (
    <PortalShell titulo="Templates dos e-mails de aviso">
      <section className="plate p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-registro">Qual aviso deseja editar</p>
          <div className="flex gap-2">
            {(["vencimento", "atraso"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest ${
                  tipo === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {t === "vencimento" ? "Vencimento" : "Atraso"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Assunto do e-mail
            <input
              className={campo}
              value={tipo === "vencimento" ? form.assunto_vencimento : form.assunto_atraso}
              onChange={(e) =>
                setForm(
                  tipo === "vencimento"
                    ? { ...form, assunto_vencimento: e.target.value }
                    : { ...form, assunto_atraso: e.target.value },
                )
              }
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Corpo da mensagem (uma linha por parágrafo)
            <textarea
              rows={6}
              className={`${campo} font-mono text-xs leading-relaxed`}
              value={tipo === "vencimento" ? form.corpo_vencimento : form.corpo_atraso}
              onChange={(e) =>
                setForm(
                  tipo === "vencimento"
                    ? { ...form, corpo_vencimento: e.target.value }
                    : { ...form, corpo_atraso: e.target.value },
                )
              }
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Rodapé padrão
            <input
              className={campo}
              value={form.rodape_email}
              onChange={(e) => setForm({ ...form, rodape_email: e.target.value })}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Marcadores:
          </span>
          {VARIAVEIS_DISPONIVEIS.map((v) => (
            <code
              key={v}
              className="border border-border bg-background px-2 py-1 font-mono text-[10px]"
            >
              {v}
            </code>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => gravar.mutate()}
            disabled={gravar.isPending}
            className="border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
          >
            {gravar.isPending ? "Salvando..." : "Salvar templates"}
          </button>
          <button
            type="button"
            onClick={() => visualizar.mutate()}
            disabled={visualizar.isPending}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {visualizar.isPending ? "Gerando..." : "Pré-visualizar"}
          </button>
        </div>
      </section>

      <section className="plate p-6">
        <p className="label-registro">Pré-visualização</p>
        {html ? (
          <>
            <p className="mt-3 text-sm">
              <span className="label-registro">Assunto</span>
              <span className="mt-1 block font-medium">{assuntoPreview}</span>
            </p>
            <iframe
              title="Pré-visualização do e-mail"
              srcDoc={html}
              className="mt-4 h-[620px] w-full border border-border bg-white"
            />
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Clique em “Pré-visualizar” para ver o e-mail com dados de exemplo antes do envio.
          </p>
        )}
      </section>
    </PortalShell>
  );
}
