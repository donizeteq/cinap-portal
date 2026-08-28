import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import { definirPapelAcesso, listarPerfisAcesso } from "@/lib/alertas.functions";

export const Route = createFileRoute("/_authenticated/perfis")({
  head: () => ({
    meta: [
      { title: "Perfis de Acesso | CINAP" },
      {
        name: "description",
        content:
          "Gestão dos perfis de acesso da Convenção: conceda o perfil de Secretaria Geral ou mantenha o acesso restrito de obreiro.",
      },
      { property: "og:title", content: "Perfis de Acesso | CINAP" },
      {
        property: "og:description",
        content: "Controle de quem administra o portal da CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfis,
});

function Perfis() {
  const { isAdmin, carregando, userId } = usePapel();
  const queryClient = useQueryClient();
  const listar = useServerFn(listarPerfisAcesso);
  const definir = useServerFn(definirPapelAcesso);
  const [busca, setBusca] = useState("");

  const usuarios = useQuery({
    queryKey: ["perfis-acesso"],
    enabled: isAdmin,
    queryFn: async () => await listar({ data: undefined }),
  });

  const alterar = useMutation({
    mutationFn: async (v: { userId: string; papel: "admin" | "obreiro"; conceder: boolean }) =>
      await definir({ data: v }),
    onSuccess: () => {
      toast.success("Perfil de acesso atualizado");
      queryClient.invalidateQueries({ queryKey: ["perfis-acesso"] });
      queryClient.invalidateQueries({ queryKey: ["papel"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (carregando) return null;
  if (!isAdmin) {
    return (
      <PortalShell titulo="Perfis de acesso">
        <p className="text-sm text-muted-foreground">Área restrita à Secretaria Geral.</p>
      </PortalShell>
    );
  }

  const termo = busca.trim().toLowerCase();
  const lista = (usuarios.data ?? []).filter(
    (u) =>
      !termo ||
      `${u.nome} ${u.email} ${u.registro ?? ""}`.toLowerCase().includes(termo),
  );

  return (
    <PortalShell titulo="Perfis de acesso">
      <section className="plate p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-registro">Secretaria Geral e obreiros</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A Secretaria Geral visualiza e gerencia avisos, obreiros, congregações e a tesouraria
              de toda a Convenção. O obreiro acessa apenas o próprio registro, sua congregação e
              seus avisos.
            </p>
          </div>
          <input
            className="w-full max-w-xs border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Buscar por nome, e-mail ou registro"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="py-2 pr-4">Usuário</th>
                <th className="py-2 pr-4">E-mail</th>
                <th className="py-2 pr-4">Verificado</th>
                <th className="py-2 pr-4">Perfil</th>
                <th className="py-2 pr-4">Último acesso</th>
                <th className="py-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => {
                const admin = u.papeis.includes("admin");
                return (
                  <tr key={u.id} className="border-b border-border/60">
                    <td className="py-3 pr-4">
                      {u.nome || "—"}
                      {u.registro && (
                        <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                          {u.registro}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs">{u.email}</td>
                    <td className="py-3 pr-4 text-xs">
                      {u.confirmado ? (
                        <span className="text-primary">Sim</span>
                      ) : (
                        <span className="text-destructive">Pendente</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="border border-border px-2 py-1 text-[10px] uppercase tracking-widest">
                        {admin ? "Secretaria Geral" : "Obreiro"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-muted-foreground">
                      {u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleString("pt-BR") : "—"}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        disabled={alterar.isPending || (admin && u.id === userId)}
                        onClick={() =>
                          alterar.mutate({ userId: u.id, papel: "admin", conceder: !admin })
                        }
                        className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40"
                      >
                        {admin ? "Remover Secretaria" : "Tornar Secretaria"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-sm text-muted-foreground">
                    {usuarios.isLoading ? "Consultando arquivo…" : "Nenhum usuário encontrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}
