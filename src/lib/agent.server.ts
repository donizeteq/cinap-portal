import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hashChave, type AgentPermissao, type AgentKey } from "@/lib/agent-keys";

export type { AgentPermissao, AgentKey };

export async function verificarChaveAgente(
  chave: string | null,
  permissaoRequerida: AgentPermissao,
): Promise<AgentKey> {
  if (!chave) {
    throw new Error("Unauthorized: Missing X-Agent-Key header");
  }

  const hash = hashChave(chave);

  const { data, error } = await supabaseAdmin
    .from("agent_keys")
    .select("*")
    .eq("chave_hash", hash)
    .single();

  if (error || !data) {
    throw new Error("Unauthorized: Invalid agent key");
  }

  const agent = data as unknown as AgentKey;

  if (!agent.ativa) {
    throw new Error("Unauthorized: Agent key is disabled");
  }

  if (!agent.permissoes.includes(permissaoRequerida)) {
    throw new Error(`Forbidden: Agent key lacks ${permissaoRequerida} permission`);
  }

  void supabaseAdmin
    .from("agent_keys")
    .update({ ultimo_uso: new Date().toISOString() })
    .eq("id", agent.id);

  return agent;
}

export type SupabaseAdmin = typeof supabaseAdmin;
