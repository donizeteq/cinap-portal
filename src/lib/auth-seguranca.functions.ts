import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(input: { email: string; redirectTo: string }) {
  const email = (input?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) throw new Error("Informe um e-mail válido.");
  const redirectTo = (input?.redirectTo ?? "").trim();
  return { email, redirectTo };
}

function ip(): string {
  const headers = getRequest().headers;
  const direto = headers.get("cf-connecting-ip");
  if (direto) return direto;
  const encaminhado = headers.get("x-forwarded-for") ?? "";
  return encaminhado.split(",")[0]?.trim() || "desconhecido";
}

async function protegido(email: string, tipo: string) {
  const { consumirTentativa } = await import("@/lib/auth-seguranca.server");
  const porEmail = await consumirTentativa(email, tipo);
  if (!porEmail.permitido) return porEmail;
  const origem = ip();
  if (origem && origem !== "desconhecido") {
    const porIp = await consumirTentativa(`ip:${origem}`, tipo);
    if (!porIp.permitido) return porIp;
  }
  return porEmail;
}

/** Envia o link de recuperação de senha respeitando limites anti-abuso. */
export const solicitarRecuperacaoSenha = createServerFn({ method: "POST" })
  .inputValidator(validar)
  .handler(async ({ data }) => {
    const limite = await protegido(data.email, "recuperacao");
    if (!limite.permitido) {
      return { ok: false, bloqueado: true, mensagem: limite.mensagem, restantes: 0 };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = data.redirectTo
      ? await supabaseAdmin.auth.resetPasswordForEmail(data.email, { redirectTo: data.redirectTo })
      : await supabaseAdmin.auth.resetPasswordForEmail(data.email);
    // Resposta neutra: nunca revela se o e-mail existe.
    return {
      ok: true,
      bloqueado: false,
      restantes: limite.restantes,
      mensagem: error
        ? "Se este e-mail estiver cadastrado, enviaremos o link de recuperação."
        : "Se este e-mail estiver cadastrado, enviaremos o link de recuperação.",
    };
  });

/** Reenvia o e-mail de verificação de cadastro com limite de tentativas. */
export const reenviarVerificacaoEmail = createServerFn({ method: "POST" })
  .inputValidator(validar)
  .handler(async ({ data }) => {
    const limite = await protegido(data.email, "verificacao");
    if (!limite.permitido) {
      return { ok: false, bloqueado: true, mensagem: limite.mensagem, restantes: 0 };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.auth.resend(
      data.redirectTo
        ? { type: "signup", email: data.email, options: { emailRedirectTo: data.redirectTo } }
        : { type: "signup", email: data.email },
    );
    return {
      ok: true,
      bloqueado: false,
      restantes: limite.restantes,
      mensagem: "Se houver cadastro pendente, o e-mail de verificação foi reenviado.",
    };
  });
