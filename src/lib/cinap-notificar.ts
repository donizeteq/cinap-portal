import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/cinap";

/**
 * Registra um aviso in-app para o obreiro quando a situação da mensalidade muda
 * (pagamento quitado, baixa manual, regularização). Falhas aqui nunca devem
 * interromper a operação principal da tesouraria.
 */
export async function notificarStatusMensalidade(params: {
  obreiroId: string;
  referencia: string;
  valor: number;
  destinatario?: string | null;
  titulo?: string;
  mensagem?: string;
}): Promise<void> {
  const titulo = params.titulo ?? "Mensalidade quitada";
  const mensagem =
    params.mensagem ??
    `A contribuição de ${params.referencia} foi registrada pela tesouraria no valor de ${brl(
      params.valor,
    )}. Sua credencial permanece ativa.`;

  const { error } = await supabase.from("notificacoes").upsert(
    {
      obreiro_id: params.obreiroId,
      tipo: "status",
      referencia: params.referencia,
      meses_atraso: 0,
      titulo,
      mensagem,
      valor: params.valor,
      destinatario: params.destinatario ?? null,
      situacao: "enviado",
      email_enviado: false,
      lida: false,
    },
    { onConflict: "obreiro_id,tipo,referencia,meses_atraso" },
  );
  if (error) console.warn("Não foi possível registrar o aviso do obreiro:", error.message);
}
