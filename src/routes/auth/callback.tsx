import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  loader: async () => {
    return {};
  },
  component: AuthCallbackComponent,
});

function AuthCallbackComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // O Supabase gerencia o processamento do hash/code automaticamente na sessão
        // apenas verificamos se a sessão foi estabelecida.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          toast.success("Login realizado com sucesso!");
          void navigate({ to: "/painel", replace: true });
        } else {
          toast.error("Falha ao validar sessão. Tente novamente.");
          void navigate({ to: "/auth", replace: true });
        }
      } catch (err) {
        console.error("Erro no callback:", err);
        toast.error("Erro durante o processamento do login.");
        void navigate({ to: "/auth", replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-display text-sm uppercase tracking-widest">Processando autenticação...</p>
      </div>
    </div>
  );
}
