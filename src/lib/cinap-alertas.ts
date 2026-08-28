export interface ConfigAlertas {
  id: boolean;
  remetente_nome: string;
  remetente_email: string;
  dominio_email: string;
  dia_vencimento: number;
  dias_antes_aviso: number;
  meses_intervalo_atraso: number;
  emails_ativos: boolean;
  copia_admin: string;
  ultima_execucao: string | null;
  updated_at: string;
  assunto_vencimento: string;
  corpo_vencimento: string;
  assunto_atraso: string;
  corpo_atraso: string;
  rodape_email: string;
}

export type TipoNotificacao = "vencimento" | "atraso";

export interface Notificacao {
  id: string;
  obreiro_id: string | null;
  tipo: TipoNotificacao;
  referencia: string;
  meses_atraso: number;
  titulo: string;
  mensagem: string;
  email_enviado: boolean;
  email_erro: string | null;
  lida: boolean;
  created_at: string;
  destinatario: string | null;
  tentativas: number;
  enviado_em: string | null;
  ultima_tentativa_em: string | null;
  valor: number;
  message_id: string | null;
}


export const CONFIG_PADRAO: ConfigAlertas = {
  id: true,
  remetente_nome: "CINAP - Secretaria Geral",
  remetente_email: "",
  dominio_email: "",
  dia_vencimento: 10,
  dias_antes_aviso: 3,
  meses_intervalo_atraso: 1,
  emails_ativos: false,
  copia_admin: "",
  ultima_execucao: null,
  updated_at: new Date().toISOString(),
  assunto_vencimento: "CINAP · Mensalidade de {{referencia}} a vencer",
  corpo_vencimento:
    "A contribuição referente a {{referencia}} vence no dia {{dia_vencimento}}.\nRegularize a mensalidade para manter sua credencial ministerial ativa.",
  assunto_atraso: "CINAP · {{meses}} mensalidade(s) em aberto",
  corpo_atraso:
    "Constam {{meses}} mensalidade(s) em aberto, desde a competência {{referencia}}.\nProcure a tesouraria da sua congregação para regularização.",
  rodape_email: "Em caso de dúvida, procure a tesouraria da sua congregação.",
};

export interface VariaveisAviso {
  nome: string;
  referencia: string;
  valor: string;
  dia_vencimento: number | string;
  meses: number | string;
  congregacao?: string;
}

export const VARIAVEIS_DISPONIVEIS = [
  "{{nome}}",
  "{{referencia}}",
  "{{valor}}",
  "{{dia_vencimento}}",
  "{{meses}}",
  "{{congregacao}}",
];

/** Substitui os marcadores {{...}} do template configurado pela secretaria. */
export function aplicarVariaveis(texto: string, v: VariaveisAviso) {
  return texto
    .replace(/\{\{\s*nome\s*\}\}/g, v.nome)
    .replace(/\{\{\s*referencia\s*\}\}/g, v.referencia)
    .replace(/\{\{\s*valor\s*\}\}/g, v.valor)
    .replace(/\{\{\s*dia_vencimento\s*\}\}/g, String(v.dia_vencimento))
    .replace(/\{\{\s*meses\s*\}\}/g, String(v.meses))
    .replace(/\{\{\s*congregacao\s*\}\}/g, v.congregacao ?? "");
}

/** Quebra o corpo configurado em parágrafos já com variáveis aplicadas. */
export function paragrafosDoTemplate(texto: string, v: VariaveisAviso) {
  return aplicarVariaveis(texto, v)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Referência de competência no formato MM/AAAA. */
export function refDe(mes: number, ano: number) {
  return `${String(mes).padStart(2, "0")}/${ano}`;
}

/** Converte MM/AAAA em índice absoluto de meses, para calcular atrasos. */
export function indiceRef(referencia: string) {
  const [mes, ano] = referencia.split("/").map(Number);
  return (ano ?? 0) * 12 + (mes ?? 1) - 1;
}

export function refDoIndice(indice: number) {
  return refDe((indice % 12) + 1, Math.floor(indice / 12));
}
