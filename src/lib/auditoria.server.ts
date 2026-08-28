import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface RegistroAuditoria {
  usuarioId: string | null;
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  descricao: string;
  detalhes?: Record<string, unknown>;
}

/** Grava uma ação da Secretaria Geral no livro de auditoria. */
export async function registrarAuditoria(registro: RegistroAuditoria): Promise<void> {
  let email = "";
  let nome = "";
  if (registro.usuarioId) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(registro.usuarioId);
    email = data?.user?.email ?? "";
    const { data: perfil } = await supabaseAdmin
      .from("profiles")
      .select("nome")
      .eq("id", registro.usuarioId)
      .maybeSingle();
    nome = (perfil?.nome as string | undefined) ?? "";
  }

  await supabaseAdmin.from("auditoria").insert({
    usuario_id: registro.usuarioId,
    usuario_email: email,
    usuario_nome: nome,
    acao: registro.acao,
    entidade: registro.entidade,
    entidade_id: registro.entidadeId ?? null,
    descricao: registro.descricao,
    detalhes: JSON.parse(JSON.stringify(registro.detalhes ?? {})),
  });
}
