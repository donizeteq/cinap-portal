import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  CARGOS,
  STATUS_LABEL,
  statusClasses,
  type Congregacao,
  type Obreiro,
  type StatusPagamento,
} from "@/lib/cinap";

export const Route = createFileRoute("/_authenticated/obreiros")({
  head: () => ({
    meta: [
      { title: "Corpo de Obreiros | CINAP" },
      {
        name: "description",
        content: "Cadastro dos obreiros filiados, cargos ministeriais e situação de contribuição.",
      },
      { property: "og:title", content: "Corpo de Obreiros | CINAP" },
      {
        property: "og:description",
        content: "Registro ministerial dos obreiros da Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Obreiros,
});

const STATUS: StatusPagamento[] = ["pago", "pendente", "atrasado"];

const VAZIO = {
  nome: "",
  congregacao_id: "",
  cargo: "Obreiro",
  status_pagamento: "pendente" as StatusPagamento,
  cpf: "",
  email: "",
};

function Obreiros() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...VAZIO });
  const [editando, setEditando] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const congregacoes = useQuery({
    queryKey: ["congregacoes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("congregacoes").select("*").order("nome");
      if (error) throw error;
      return data as unknown as Congregacao[];
    },
  });

  const lista = useQuery({
    queryKey: ["obreiros"],
    queryFn: async () => {
      const { data, error } = await supabase.from("obreiros").select("*").order("nome");
      if (error) throw error;
      return data as unknown as Obreiro[];
    },
  });

  const salvar = useMutation({
    mutationFn: async () => {
      const payload = {
        nome: form.nome,
        cargo: form.cargo,
        status_pagamento: form.status_pagamento,
        cpf: form.cpf || null,
        email: form.email || null,
        congregacao_id: form.congregacao_id || null,
      };
      if (editando) {
        const { error } = await supabase.from("obreiros").update(payload).eq("id", editando);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("obreiros").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editando ? "Obreiro atualizado." : "Obreiro registrado.");
      setForm({ ...VAZIO });
      setEditando(null);
      void queryClient.invalidateQueries({ queryKey: ["obreiros"] });
      void queryClient.invalidateQueries({ queryKey: ["painel"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluir = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("obreiros").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro removido.");
      void queryClient.invalidateQueries({ queryKey: ["obreiros"] });
      void queryClient.invalidateQueries({ queryKey: ["painel"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Corpo de Obreiros">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Somente a secretaria pode gerenciar</h3>
        </div>
      </PortalShell>
    );
  }

  const filtrados = (lista.data ?? []).filter((o) =>
    o.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <PortalShell titulo="Corpo de Obreiros">
      <section className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="border border-border bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest">
              Obreiros ({filtrados.length})
            </h4>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome…"
              className="w-48 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-secondary">
                  <Th>Registro</Th>
                  <Th>Nome</Th>
                  <Th>Cargo</Th>
                  <Th>Congregação</Th>
                  <Th>Situação</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtrados.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-secondary/50">
                    <Td className="font-mono text-[11px]">{o.registro}</Td>
                    <Td className="font-medium">{o.nome}</Td>
                    <Td className="text-muted-foreground">{o.cargo}</Td>
                    <Td className="text-muted-foreground">
                      {congregacoes.data?.find((c) => c.id === o.congregacao_id)?.nome ?? "—"}
                    </Td>
                    <Td>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase ${statusClasses(o.status_pagamento)}`}
                      >
                        {STATUS_LABEL[o.status_pagamento]}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex gap-3 text-xs">
                        <button
                          className="text-primary hover:underline"
                          onClick={() => {
                            setEditando(o.id);
                            setForm({
                              nome: o.nome,
                              congregacao_id: o.congregacao_id ?? "",
                              cargo: o.cargo,
                              status_pagamento: o.status_pagamento,
                              cpf: o.cpf ?? "",
                              email: o.email ?? "",
                            });
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="text-destructive hover:underline"
                          onClick={() => excluir.mutate(o.id)}
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
          <p className="label-registro">{editando ? "Editar registro" : "Novo registro"}</p>
          <h4 className="mt-1 font-display text-2xl">Obreiro</h4>

          <div className="mt-6 space-y-4">
            <Campo
              rotulo="Nome completo"
              value={form.nome}
              onChange={(v) => setForm({ ...form, nome: v })}
              required
            />
            <label className="flex flex-col gap-1">
              <span className="label-registro">Cargo ministerial</span>
              <select
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                className="border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {CARGOS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="label-registro">Congregação</span>
              <select
                value={form.congregacao_id}
                onChange={(e) => setForm({ ...form, congregacao_id: e.target.value })}
                className="border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="">Sem vínculo</option>
                {(congregacoes.data ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>
            <Campo rotulo="CPF" value={form.cpf} onChange={(v) => setForm({ ...form, cpf: v })} />
            <Campo
              rotulo="E-mail de acesso"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <label className="flex flex-col gap-1">
              <span className="label-registro">Situação da contribuição</span>
              <select
                value={form.status_pagamento}
                onChange={(e) =>
                  setForm({ ...form, status_pagamento: e.target.value as StatusPagamento })
                }
                className="border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={salvar.isPending}
              className="w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {editando ? "Salvar alterações" : "Registrar obreiro"}
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
