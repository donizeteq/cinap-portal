/** Valores e exigências de filiação (Secretaria Geral da CINAP). */

export const TAXA_INSCRICAO = 50;
export const TAXA_CREDENCIAL = 20;

export const PIX_CHAVE = "64780590000103";
export const PIX_TITULAR =
  "CINAP Convenção das Igrejas Nacionais Autônomas e Parceiras";
export const PIX_OBSERVACAO = "Enviar o comprovante de pagamento.";

export const DOCUMENTOS_OBRIGATORIOS: { titulo: string; detalhe: string }[] = [
  {
    titulo: "Requerimento assinado",
    detalhe: "Foto da ficha de cadastro de obreiro devidamente assinada.",
  },
  { titulo: "RG", detalhe: "Foto da frente e do verso do documento." },
  { titulo: "CPF", detalhe: "Foto do documento ou do comprovante de inscrição." },
  {
    titulo: "Comprovante de residência",
    detalhe: "Emitido nos últimos 90 dias, em nome do obreiro ou familiar.",
  },
];

export const OBSERVACAO_DOCUMENTOS =
  "Todas as fotos devem estar nítidas, legíveis e sem cortes nas bordas.";

export function urlValidacao(registro: string, origem?: string): string {
  const base = origem ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/validar/${encodeURIComponent(registro)}`;
}
