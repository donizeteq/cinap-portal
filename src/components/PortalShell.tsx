import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { usePapel } from "@/hooks/use-cinap-auth";
import { SinoNotificacoes } from "@/components/SinoNotificacoes";

const NAV_ADMIN = [
  { to: "/painel", label: "Dashboard" },
  { to: "/congregacoes", label: "Congregações" },
  { to: "/obreiros", label: "Obreiros" },
  { to: "/pagamentos", label: "Pagamentos" },
  { to: "/alertas", label: "Alertas" },
  { to: "/configuracoes", label: "Configurações" },
  { to: "/templates-email", label: "Templates de e-mail" },
  { to: "/perfis", label: "Perfis de acesso" },
  { to: "/auditoria", label: "Auditoria" },
  { to: "/agentes", label: "Agentes" },

];

const NAV_DOCS = [
  { to: "/credenciais", label: "Credenciais" },
  { to: "/minha-situacao", label: "Minha situação" },
];

export function PortalShell({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  const { isAdmin, session } = usePapel();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const administrativo = isAdmin ? NAV_ADMIN : [];

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="no-print fixed left-0 top-0 z-10 hidden h-full w-64 flex-col border-r border-border bg-surface px-6 py-8 lg:flex">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase italic tracking-tight text-primary">
            CINAP
          </h1>
          <p className="label-registro mt-1">Registro Nacional Nº 482-B</p>
        </div>

        <nav className="mt-12 space-y-6">
          {administrativo.length > 0 && (
            <div className="space-y-1">
              <p className="label-registro mb-3">Administrativo</p>
              {administrativo.map((item) => (
                <NavItem key={item.to} {...item} ativo={pathname === item.to} />
              ))}
            </div>
          )}
          <div className="space-y-1">
            <p className="label-registro mb-3">Documentação</p>
            {NAV_DOCS.filter((i) => isAdmin || i.to === "/minha-situacao").map((item) => (
              <NavItem key={item.to} {...item} ativo={pathname === item.to} />
            ))}
          </div>
        </nav>

        <div className="mt-auto">
          <div className="border border-border bg-background p-4">
            <p className="text-[11px] font-medium">{isAdmin ? "Secretaria Geral" : "Obreiro"}</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              {session?.user.email}
            </p>
          </div>
          <button
            onClick={sair}
            className="mt-3 w-full border border-border py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Encerrar sessão
          </button>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="no-print sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-surface/70 px-6 backdrop-blur-sm lg:px-10">
          <h2 className="font-display text-xl">{titulo}</h2>
          <div className="flex items-center gap-3">
          <SinoNotificacoes />
          <span className="border border-primary/15 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Sistema online
          </span>
          </div>
        </header>
        <div className="mx-auto max-w-7xl animate-registry space-y-10 p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

function NavItem({ to, label, ativo }: { to: string; label: string; ativo: boolean }) {
  return (
    <Link
      to={to}
      className={
        ativo
          ? "flex border-b border-primary/40 py-2 text-sm font-medium text-primary"
          : "flex py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}
