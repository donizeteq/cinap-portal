import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { gerarChaveAgente, hashChave, type AgentKey, type AgentPermissao } from "@/lib/agent-keys";

async function garantirAdmin(context: { supabase: { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error?: Error }> }; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Forbidden: admin only");
}

export const listarChavesAgente = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await garantirAdmin(context as unknown as { supabase: { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error?: Error }> }; userId: string });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("agent_keys")
      .select("id, nome, permissoes, ativa, ultimo_uso, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as unknown as AgentKey[];
  });

export interface ChaveCriada {
  chave: string;
  agent: Omit<AgentKey, "chave_hash">;
}

export const criarChaveAgente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { nome: string; permissoes: AgentPermissao[] }) => input)
  .handler(async ({ data, context }) => {
    await garantirAdmin(context as unknown as { supabase: { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error?: Error }> }; userId: string });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const chave = gerarChaveAgente();
    const { data: agent, error } = await supabaseAdmin
      .from("agent_keys")
      .insert({
        nome: data.nome,
        chave_hash: hashChave(chave),
        permissoes: data.permissoes,
        ativa: true,
      })
      .select("id, nome, permissoes, ativa, ultimo_uso, created_at")
      .single();
    if (error) throw error;
    return { chave, agent: agent as unknown as Omit<AgentKey, "chave_hash"> } as ChaveCriada;
  });

export const alternarChaveAgente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; ativa: boolean }) => input)
  .handler(async ({ data, context }) => {
    await garantirAdmin(context as unknown as { supabase: { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error?: Error }> }; userId: string });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("agent_keys").update({ ativa: data.ativa }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const excluirChaveAgente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await garantirAdmin(context as unknown as { supabase: { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error?: Error }> }; userId: string });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("agent_keys").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
