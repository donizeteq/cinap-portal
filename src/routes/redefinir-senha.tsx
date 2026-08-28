import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redefinir-senha")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir Senha | CINAP" },
      {
        name: "description",
        content: "Defina uma nova senha de acesso ao portal da Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:title", content: "Redefinir Senha | CINAP" },
      {
        property: "og:description",
        content: "Recuperação de acesso ao portal CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RedefinirSenha,
});

function RedefinirSenha() {
  const navigate = useNavigate();
  const [pronto, setPronto] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setPronto(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setPronto(Boolean(s)));
    return () => data.subscription.unsubscribe();
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6) {
      toast.error("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setEnviando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) throw error;
      toast.success("Senha redefinida com sucesso.");
      void navigate({ to: "/painel", replace: true });
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Não foi possível redefinir a senha.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold uppercase italic tracking-tight text-primary">
          CINAP
        </h1>
        <h2 className="mt-6 font-display text-3xl">Nova senha</h2>
        {pronto ? (
          <form onSubmit={salvar} className="mt-6 space-y-4">
            <label className="flex flex-col gap-1">
              <span className="label-registro">Nova senha</span>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="label-registro">Confirmar senha</span>
              <input
                type="password"
                required
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                className="w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60"
            >
              {enviando ? "Salvando…" : "Salvar nova senha"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Abra esta página pelo link enviado ao seu e-mail para redefinir a senha. Se o link
            expirou, solicite uma nova recuperação na tela de acesso.
          </p>
        )}
      </div>
    </div>
  );
}
