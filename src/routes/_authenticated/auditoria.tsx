import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import { listarAuditoria } from "@/lib/alertas.functions";
import { baixarPlanilha } from "@/lib/cinap-planilha";

const ROTULOS: Record<string, string> = {
  "aviso.previa": "Prévia de avisos",
  "aviso.aprovar": "Aprovação de avisos",
  "aviso.agendar": "Agendamento de avisos",
  "aviso.cancelar": "Cancelamento de avisos",
  "aviso.envio": "Envio de avisos",
  "congregacao.criar": "Congregação criada",
  "congregacao.editar": "Congregação editada",
  "congregacao.excluir": "Congregação excluída",
  "obreiro.criar": "Obreiro registrado",
  "obreiro.editar": "Obreiro editado",
  "obreiro.excluir": "Obreiro excluído",
  "pagamento.registrar": "Pagamento registrado",
  "config.salvar": "Configurações alteradas",
  "papel.alterar": "Perfil de acesso alterado",
};

export const Route = createFileRoute("/_authenticated/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria da Secretaria | CINAP" },
      {
        name: "description",
        content:
          "Livro de auditoria das ações da Secretaria Geral: criações, edições e envios com data, usuário e detalhes.",
      },
      { property: "og:title", content: "Auditoria da Secretaria | CINAP" },
      {
        property: "og:description",
        content: "Rastreabilidade completa das ações administrativas da Convenção.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auditoria,
});

function Auditoria() {
  const { isAdmin, carregando } = usePapel();
  const listar = useServerFn(listarAuditoria);
  const [busca, setBusca] = useState("");
  const [acao, setAcao] = useState("todas");
  const [usuario, setUsuario] = useState("todos");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  const registros = useQuery({
    queryKey: ["auditoria"],
    enabled: isAdmin,
    queryFn: async () => await listar({ data: { limite: 300 } }),
  });

  const usuarios = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const r of registros.data ?? []) {
      const chave = r.usuario_email || r.usuario_nome || "sistema";
      mapa.set(chave, r.usuario_nome || r.usuario_email || "Sistema");
    }
    return [...mapa.entries()].sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }, [registros.data]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (registros.data ?? []).filter((r) => {
      if (acao !== "todas" && !r.acao.startsWith(acao)) return false;
      if (usuario !== "todos" && (r.usuario_email || r.usuario_nome || "sistema") !== usuario)
        return false;
      const dia = r.created_at.slice(0, 10);
      if (de && dia < de) return false;
      if (ate && dia > ate) return false;
      if (!termo) return true;
      return `${r.usuario_nome} ${r.usuario_email} ${r.acao} ${r.entidade} ${r.descricao}`
        .toLowerCase()
        .includes(termo);
    });
  }, [registros.data, busca, acao, usuario, de, ate]);

  if (carregando) return null;
  if (!isAdmin) {
    return (
      <PortalShell titulo="Auditoria">
        <p className="text-sm text-muted-foreground">Área restrita à Secretaria Geral.</p>
      </PortalShell>
    );
  }

  async function exportar(formato: "csv" | "xlsx") {
    const linhas: (string | number)[][] = [
      ["CINAP - Auditoria da Secretaria Geral"],
      ["Emitido em", new Date().toLocaleString("pt-BR")],
      [],
      ["Data", "Usuario", "E-mail", "Acao", "Area", "Descricao", "Detalhes"],
      ...filtrados.map((r) => [
        new Date(r.created_at).toLocaleString("pt-BR"),
        r.usuario_nome || "-",
        r.usuario_email || "-",
        ROTULOS[r.acao] ?? r.acao,
        r.entidade,
        r.descricao,
        JSON.stringify(r.detalhes ?? {}),
      ]),
    ];
    await baixarPlanilha(
      formato,
      `cinap-auditoria-${new Date().toISOString().slice(0, 10)}`,
      "Auditoria",
      linhas,
    );
  }

  return (
    <PortalShell titulo="Auditoria da Secretaria Geral">
      <section className="plate p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-registro">Livro de registros</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Cada criação, edição, aprovação e envio realizado pela Secretaria Geral fica
              registrado com data, usuário responsável e detalhes da operação.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={acao}
              onChange={(e) => setAcao(e.target.value)}
              className="border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            >
              <option value="todas">Todas as ações</option>
              <option value="aviso">Avisos</option>
              <option value="congregacao">Congregações</option>
              <option value="obreiro">Obreiros</option>
              <option value="pagamento">Pagamentos</option>
              <option value="config">Configurações</option>
              <option value="papel">Perfis de acesso</option>
            </select>
            <select
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            >
              <option value="todos">Todos os usuários</option>
              {usuarios.map(([chave, nome]) => (
                <option key={chave} value={chave}>
                  {nome}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={de}
              onChange={(e) => setDe(e.target.value)}
              aria-label="Período inicial"
              className="border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <input
              type="date"
              value={ate}
              onChange={(e) => setAte(e.target.value)}
              aria-label="Período final"
              className="border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar obreiro, congregação ou descrição"
              className="w-56 border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={() => void exportar("csv")}
              className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
            >
              CSV
            </button>
            <button
              onClick={() => void exportar("xlsx")}
              className="border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
            >
              XLSX
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Responsável</th>
                <th className="py-2 pr-4">Ação</th>
                <th className="py-2 pr-4">Área</th>
                <th className="py-2">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => (
                <tr key={r.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-mono text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 pr-4">
                    {r.usuario_nome || "—"}
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      {r.usuario_email || "—"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="border border-border px-2 py-1 text-[10px] uppercase tracking-widest">
                      {ROTULOS[r.acao] ?? r.acao}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs uppercase tracking-widest text-muted-foreground">
                    {r.entidade}
                  </td>
                  <td className="py-3 text-sm">
                    {r.descricao}
                    {r.detalhes && Object.keys(r.detalhes as object).length > 0 && (
                      <pre className="mt-1 max-w-xl overflow-x-auto bg-secondary/40 p-2 font-mono text-[10px] text-muted-foreground">
                        {JSON.stringify(r.detalhes, null, 2)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    {registros.isLoading ? "Consultando o livro…" : "Nenhum registro encontrado."}
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
