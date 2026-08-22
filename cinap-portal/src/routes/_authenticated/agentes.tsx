import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import { dataBR } from "@/lib/cinap";
import {
  listarChavesAgente,
  criarChaveAgente,
  alternarChaveAgente,
  excluirChaveAgente,
  type ChaveCriada,
} from "@/lib/agent-keys.functions";
import type { AgentPermissao } from "@/lib/agent-keys";

export const Route = createFileRoute("/_authenticated/agentes")({
  head: () => ({
    meta: [
      { title: "Agentes Externos | CINAP" },
      {
        name: "description",
        content: "Gerenciamento de chaves de API para agentes externos integrados ao portal CINAP.",
      },
      { property: "og:title", content: "Agentes Externos | CINAP" },
      {
        property: "og:description",
        content: "Controle de acesso de agentes automatizados à Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Agentes,
});

function Agentes() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [permissoes, setPermissoes] = useState<AgentPermissao[]>(["read"]);
  const [chaveGerada, setChaveGerada] = useState<ChaveCriada | null>(null);

  const listar = useServerFn(listarChavesAgente);
  const criar = useServerFn(criarChaveAgente);
  const alternar = useServerFn(alternarChaveAgente);
  const excluir = useServerFn(excluirChaveAgente);

  const chaves = useQuery({
    queryKey: ["agent-keys"],
    queryFn: () => listar(),
    enabled: isAdmin,
  });

  const criarMutation = useMutation({
    mutationFn: async () => criar({ data: { nome, permissoes } }),
    onSuccess: (dados) => {
      setChaveGerada(dados);
      setNome("");
      setPermissoes(["read"]);
      void queryClient.invalidateQueries({ queryKey: ["agent-keys"] });
      toast.success("Chave de API gerada. Copie-a agora — ela não será exibida novamente.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const alternarMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: string; ativa: boolean }) =>
      alternar({ data: { id, ativa } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agent-keys"] });
      toast.success("Status da chave atualizado.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => excluir({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agent-keys"] });
      toast.success("Chave removida.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function togglePermissao(p: AgentPermissao) {
    setPermissoes((atuais) =>
      atuais.includes(p) ? atuais.filter((x) => x !== p) : [...atuais, p],
    );
  }

  async function copiar(texto: string) {
    await navigator.clipboard.writeText(texto);
    toast.success("Chave copiada para a área de transferência.");
  }

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Agentes Externos">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Somente a secretaria pode gerenciar chaves de API</h3>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell titulo="Agentes Externos">
      <section className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="border border-border bg-surface">
          <div className="border-b border-border px-6 py-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest">
              Chaves de API ({chaves.data?.length ?? 0})
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">Nome</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">Permissões</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">Último uso</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">Criada em</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody>
                {chaves.data?.map((chave) => (
                  <tr key={chave.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-sm font-medium">{chave.nome}</td>
                    <td className="px-6 py-4 text-sm">
                      {chave.permissoes.map((p) => (
                        <span
                          key={p}
                          className="mr-1 inline-block border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider"
                        >
                          {p === "read" ? "Leitura" : "Escrita"}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={
                          chave.ativa
                            ? "inline-block bg-success/10 px-2 py-0.5 text-[10px] text-success"
                            : "inline-block bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                        }
                      >
                        {chave.ativa ? "Ativa" : "Desativada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {chave.ultimo_uso ? dataBR(chave.ultimo_uso) : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{dataBR(chave.created_at)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alternarMutation.mutate({ id: chave.id, ativa: !chave.ativa })}
                          disabled={alternarMutation.isPending}
                          className="text-[10px] uppercase tracking-widest text-primary hover:underline"
                        >
                          {chave.ativa ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          onClick={() => excluirMutation.mutate(chave.id)}
                          disabled={excluirMutation.isPending}
                          className="text-[10px] uppercase tracking-widest text-destructive hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {chaves.data?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      Nenhuma chave de API registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border bg-surface p-6">
            <h4 className="text-sm font-semibold uppercase tracking-widest">Nova chave</h4>
            <p className="mt-2 text-xs text-muted-foreground">
              Crie uma chave para o agente Hermes ou outro sistema integrado.
            </p>
            <div className="mt-6 space-y-4">
              <label className="flex flex-col gap-1">
                <span className="label-registro">Identificação</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Hermes Produção"
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <div>
                <span className="label-registro">Permissões</span>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={permissoes.includes("read")}
                      onChange={() => togglePermissao("read")}
                      className="h-4 w-4 accent-primary"
                    />
                    Leitura (consultar dados e relatórios)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={permissoes.includes("write")}
                      onChange={() => togglePermissao("write")}
                      className="h-4 w-4 accent-primary"
                    />
                    Escrita (criar congregações, obreiros e registrar pagamentos)
                  </label>
                </div>
              </div>
              <button
                onClick={() => criarMutation.mutate()}
                disabled={!nome || permissoes.length === 0 || criarMutation.isPending}
                className="w-full bg-primary py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {criarMutation.isPending ? "Gerando…" : "Gerar chave"}
              </button>
            </div>
          </div>

          {chaveGerada && (
            <div className="border border-primary/30 bg-primary/5 p-6">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-primary">Chave gerada</h4>
              <p className="mt-2 text-xs text-muted-foreground">
                Copie e armazene em segurança. A chave só é exibida uma vez.
              </p>
              <div className="mt-4 break-all rounded border border-border bg-background p-3 font-mono text-xs">
                {chaveGerada.chave}
              </div>
              <button
                onClick={() => copiar(chaveGerada.chave)}
                className="mt-4 w-full border border-border bg-surface py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                Copiar chave
              </button>
            </div>
          )}
        </div>
      </section>
    </PortalShell>
  );
}
