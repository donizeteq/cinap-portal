import { createHash } from "crypto";

export type AgentPermissao = "read" | "write";

export interface AgentKey {
  id: string;
  nome: string;
  chave_hash: string;
  permissoes: AgentPermissao[];
  ativa: boolean;
  ultimo_uso: string | null;
  created_at: string;
}

export function hashChave(chave: string): string {
  return createHash("sha256").update(chave).digest("hex");
}

export function gerarChaveAgente(): string {
  const prefixo = "cinap-agent";
  const aleatorio = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join("");
  return `${prefixo}_${aleatorio}`;
}
