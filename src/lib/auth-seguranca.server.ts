import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const LIMITES = {
  /** Tentativas permitidas dentro da janela. */
  maxTentativas: 3,
  /** Duração da janela de contagem, em minutos. */
  janelaMinutos: 15,
  /** Bloqueio aplicado ao exceder o limite, em minutos. */
  bloqueioMinutos: 30,
} as const;

export interface ResultadoLimite {
  permitido: boolean;
  restantes: number;
  bloqueadoAte: string | null;
  mensagem: string;
}

function minutosRestantes(ate: string): number {
  return Math.max(1, Math.ceil((new Date(ate).getTime() - Date.now()) / 60000));
}

/** Consome uma tentativa para a chave informada e aplica bloqueio temporário ao exceder o limite. */
export async function consumirTentativa(chave: string, tipo: string): Promise<ResultadoLimite> {
  const agora = new Date();
  const chaveNormalizada = chave.trim().toLowerCase().slice(0, 200);

  const { data: atual } = await supabaseAdmin
    .from("auth_tentativas")
    .select("*")
    .eq("chave", chaveNormalizada)
    .eq("tipo", tipo)
    .maybeSingle();

  if (atual?.bloqueado_ate && new Date(atual.bloqueado_ate as string) > agora) {
    const ate = atual.bloqueado_ate as string;
    return {
      permitido: false,
      restantes: 0,
      bloqueadoAte: ate,
      mensagem: `Muitas tentativas. Tente novamente em ${minutosRestantes(ate)} minuto(s).`,
    };
  }

  const janelaAberta =
    atual?.janela_inicio &&
    agora.getTime() - new Date(atual.janela_inicio as string).getTime() <
      LIMITES.janelaMinutos * 60000;

  const tentativas = janelaAberta ? Number(atual?.tentativas ?? 0) + 1 : 1;
  const excedeu = tentativas > LIMITES.maxTentativas;
  const bloqueadoAte = excedeu
    ? new Date(agora.getTime() + LIMITES.bloqueioMinutos * 60000).toISOString()
    : null;

  await supabaseAdmin.from("auth_tentativas").upsert(
    {
      chave: chaveNormalizada,
      tipo,
      tentativas,
      janela_inicio: janelaAberta ? (atual!.janela_inicio as string) : agora.toISOString(),
      ultima_tentativa: agora.toISOString(),
      bloqueado_ate: bloqueadoAte,
      updated_at: agora.toISOString(),
    },
    { onConflict: "chave,tipo" },
  );

  if (excedeu) {
    return {
      permitido: false,
      restantes: 0,
      bloqueadoAte,
      mensagem: `Limite de ${LIMITES.maxTentativas} tentativas atingido. Aguarde ${LIMITES.bloqueioMinutos} minutos para tentar novamente.`,
    };
  }

  return {
    permitido: true,
    restantes: LIMITES.maxTentativas - tentativas,
    bloqueadoAte: null,
    mensagem: "ok",
  };
}
