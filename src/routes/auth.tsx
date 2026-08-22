import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acesso ao Portal | CINAP" },
      {
        name: "description",
        content:
          "Acesso restrito ao portal administrativo da Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:title", content: "Acesso ao Portal | CINAP" },
      {
        property: "og:description",
        content: "Área de autenticação de obreiros e da secretaria da CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aguardandoEmail, setAguardandoEmail] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/painel", replace: true });
    });
  }, [navigate]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        void navigate({ to: "/painel", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: window.location.origin, data: { nome } },
        });
        if (error) throw error;
        if (data.session) void navigate({ to: "/painel", replace: true });
        else setAguardandoEmail(true);
      }
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Não foi possível concluir o acesso.");
    } finally {
      setEnviando(false);
    }
  }

  async function entrarComGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error("Falha ao autenticar com o Google: " + error.message);
      return;
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex">
        <div>
          <h1 className="font-display text-3xl font-semibold uppercase italic tracking-tight text-primary">
            CINAP
          </h1>
          <p className="label-registro mt-1">Registro Nacional Nº 482-B</p>
        </div>
        <div className="max-w-sm">
          <h2 className="font-display text-4xl leading-tight">
            Portal de Gestão da Convenção das Igrejas Nacionais Autônomas
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Controle de congregações, contribuições estatutárias (Art. 7º) e emissão de credenciais
            ministeriais.
          </p>
        </div>
        <p className="label-registro">Documento de acesso restrito</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm animate-registry">
          <Link to="/" className="label-registro hover:text-primary">
            ← Voltar
          </Link>
          <h3 className="mt-6 font-display text-3xl">
            {modo === "entrar" ? "Acessar o portal" : "Criar acesso"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {modo === "entrar"
              ? "Informe suas credenciais institucionais."
              : "Cadastre-se com o e-mail registrado na secretaria."}
          </p>

          {aguardandoEmail ? (
            <div className="mt-8 border border-border bg-surface p-6">
              <p className="text-sm">
                Enviamos um e-mail de confirmação para <strong>{email}</strong>. Confirme o cadastro
                para acessar o portal.
              </p>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-8 space-y-4">
              {modo === "cadastrar" && (
                <Campo
                  rotulo="Nome completo"
                  value={nome}
                  onChange={setNome}
                  type="text"
                  required
                />
              )}
              <Campo rotulo="E-mail" value={email} onChange={setEmail} type="email" required />
              <Campo rotulo="Senha" value={senha} onChange={setSenha} type="password" required />
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-primary py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {enviando ? "Processando…" : modo === "entrar" ? "Entrar" : "Cadastrar"}
              </button>
            </form>
          )}

          <button
            onClick={entrarComGoogle}
            className="mt-4 w-full border border-border bg-surface py-3 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
          >
            Continuar com Google
          </button>

          <button
            onClick={() => {
              setModo(modo === "entrar" ? "cadastrar" : "entrar");
              setAguardandoEmail(false);
            }}
            className="mt-6 w-full text-xs text-muted-foreground hover:text-primary"
          >
            {modo === "entrar"
              ? "Ainda não possui acesso? Cadastre-se"
              : "Já possui acesso? Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({
  rotulo,
  value,
  onChange,
  type,
  required,
}: {
  rotulo: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
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
