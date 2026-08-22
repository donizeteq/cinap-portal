export type Categoria = "Bronze" | "Prata" | "Ouro";
export type StatusPagamento = "pago" | "pendente" | "atrasado";

export interface Congregacao {
  id: string;
  nome: string;
  categoria: Categoria;
  qdt_obreiros: number;
  valor_mensalidade: number;
  cidade: string;
  estado: string;
  ativa: boolean;
}

export interface Obreiro {
  id: string;
  nome: string;
  congregacao_id: string | null;
  cargo: string;
  status_pagamento: StatusPagamento;
  registro: string;
  cpf: string | null;
  email: string | null;
  validade: string;
}

export interface Pagamento {
  id: string;
  obreiro_id: string;
  valor: number;
  data: string;
  status: StatusPagamento;
  referencia: string;
}

/** Art. 7º — mensalidade por categoria da congregação. */
export const MENSALIDADE_POR_CATEGORIA: Record<Categoria, number> = {
  Bronze: 40,
  Prata: 50,
  Ouro: 60,
};

export const CATEGORIAS: Categoria[] = ["Bronze", "Prata", "Ouro"];

export const CARGOS = [
  "Pastor Presidente",
  "Pastor Auxiliar",
  "Evangelista",
  "Presbítero",
  "Diácono",
  "Obreiro",
];

export function brl(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

export function dataBR(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export const STATUS_LABEL: Record<StatusPagamento, string> = {
  pago: "Adimplente",
  pendente: "Pendente",
  atrasado: "Inadimplente",
};

export function categoriaClasses(categoria: Categoria): string {
  if (categoria === "Ouro") return "bg-ouro text-ouro-foreground";
  if (categoria === "Prata") return "bg-prata text-prata-foreground";
  return "bg-bronze text-bronze-foreground";
}

export function statusClasses(status: StatusPagamento): string {
  if (status === "pago") return "bg-success/10 text-success";
  if (status === "pendente") return "bg-warning/15 text-warning-foreground";
  return "bg-destructive/10 text-destructive";
}

/** Referência do mês corrente no formato MM/AAAA. */
export function referenciaAtual(hoje = new Date()): string {
  return `${String(hoje.getMonth() + 1).padStart(2, "0")}/${hoje.getFullYear()}`;
}
