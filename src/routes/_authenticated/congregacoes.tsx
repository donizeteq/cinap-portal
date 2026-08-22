import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  brl,
  categoriaClasses,
  CATEGORIAS,
  MENSALIDADE_POR_CATEGORIA,
  type Categoria,
  type Congregacao,
} from "@/lib/cinap";

export const Route = createFileRoute("/_authenticated/congregacoes")({
  head: () => ({
    meta: [
      { title: "Congregações | CINAP" },
      {
        name: "description",
        content:
          "Cadastro e manutenção das congregações filiadas, com mensalidade calculada pelo Art. 7º.",
      },
      { property: "og:title", content: "Congregações | CINAP" },
      {
        property: "og:description",
        content: "Gestão das unidades filiadas à Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Congregacoes,
});

const VAZIO = {
  nome: "",
  categoria: "Bronze" as Categoria,
  qdt_obreiros: 0,
  cidade: "",
  estado: "",
  ativa: true,
};

function Congregacoes() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...VAZIO });
  const [editando, setEditando] = useState<string | null>(null);

  const lista = useQuery({
    queryKey: ["congregacoes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("congregacoes").select("*").order("nome");
      if (error) throw error;
      return data as unknown as Congregacao[];
    },
  });

  const salvar = useMutation({
    mutationFn: async () => {
      const payload = { ...form, qdt_obreiros: Number(form.qdt_obreiros) };
      if (editando) {
        const { error } = await supabase.from("congregacoes").update(payload).eq("id", editando);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("congregacoes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editando ? "Congregação atualizada." : "Congregação registrada.");
      setForm({ ...VAZIO });
      setEditando(null);
      void queryClient.invalidateQueries({ queryKey: ["congregacoes"] });
      void queryClient.invalidateQueries({ queryKey: ["painel"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("congregacoes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro removido do arquivo.");
      void queryClient.invalidateQueries({ queryKey: ["congregacoes"] });
      void queryClient.invalidateQueries({ queryKey: ["painel"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Congregações">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Somente a secretaria pode gerenciar</h3>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell titulo="Congregações Registradas">
      <section className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="border border-border bg-surface">
          <div className="border-b border-border px-6 py-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest">
              Unidades filiadas ({lista.data?.length ?? 0})
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-secondary">
                  <Th>Nome</Th>
                  <Th>Localidade</Th>
                  <Th>Categoria</Th>
                  <Th>Obreiros</Th>
                  <Th>Mensalidade</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(lista.data ?? []).map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-secondary/50">
                    <Td className="font-medium">
                      {c.nome}
                      {!c.ativa && (
                        <span className="ml-2 font-mono text-[9px] uppercase text-muted-foreground">
                          inativa
                        </span>
                      )}
                    </Td>
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
                    <Td>
                      <div className="flex gap-3 text-xs">
                        <button
                          className="text-primary hover:underline"
                          onClick={() => {
                            setEditando(c.id);
                            setForm({
                              nome: c.nome,
                              categoria: c.categoria,
                              qdt_obreiros: c.qdt_obreiros,
                              cidade: c.cidade,
                              estado: c.estado,
                              ativa: c.ativa,
                            });
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="text-destructive hover:underline"
                          onClick={() => excluir.mutate(c.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form
          className="h-fit border border-border bg-surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            salvar.mutate();
          }}
        >
          <p className="label-registro">
            {editando ? "Editar registro" : "Novo registro"}
          </p>
          <h4 className="mt-1 font-display text-2xl">Congregação</h4>

          <div className="mt-6 space-y-4">
            <Campo
              rotulo="Denominação"
              value={form.nome}
              onChange={(v) => setForm({ ...form, nome: v })}
              required
            />
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <Campo
                rotulo="Cidade"
                value={form.cidade}
                onChange={(v) => setForm({ ...form, cidade: v })}
              />
              <Campo
                rotulo="UF"
                value={form.estado}
                onChange={(v) => setForm({ ...form, estado: v.toUpperCase().slice(0, 2) })}
              />
            </div>
            <label className="flex flex-col gap-1">
              <span className="label-registro">Categoria (Art. 7º)</span>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
                className="border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c} — {brl(MENSALIDADE_POR_CATEGORIA[c])}
                  </option>
                ))}
              </select>
            </label>
            <Campo
              rotulo="Quantidade de obreiros"
              type="number"
              value={String(form.qdt_obreiros)}
              onChange={(v) => setForm({ ...form, qdt_obreiros: Number(v) })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.ativa}
                onChange={(e) => setForm({ ...form, ativa: e.target.checked })}
              />
              Congregação ativa
            </label>

            <div className="border-t border-dashed border-border pt-4">
              <div className="flex items-baseline justify-between">
                <span className="label-registro">Mensalidade automática</span>
                <span className="font-display text-2xl">
                  {brl(MENSALIDADE_POR_CATEGORIA[form.categoria])}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={salvar.isPending}
              className="w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {editando ? "Salvar alterações" : "Registrar congregação"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm({ ...VAZIO });
                }}
                className="w-full text-xs text-muted-foreground hover:text-primary"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>
    </PortalShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="label-registro border-b border-border px-6 py-3 font-normal">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border/60 px-6 py-4 ${className}`}>{children}</td>;
}

function Campo({
  rotulo,
  value,
  onChange,
  type = "text",
  required,
}: {
  rotulo: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label-registro">{rotulo}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
