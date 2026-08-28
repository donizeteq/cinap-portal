import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ConfigAlertas } from "@/lib/cinap-alertas";

type Ctx = {
  supabase: { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error?: Error }> };
  userId: string;
};

async function garantirAdmin(context: unknown) {
  const ctx = context as Ctx;
  const { data: isAdmin, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !isAdmin) {
    // Fallback: se RPC não retornar true, verifica via supabaseAdmin se existem admins cadastrados
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("id").eq("role", "admin").limit(1);
    if (roles && roles.length > 0) {
      throw new Error("Forbidden: admin only");
    }
  }
}

export const salvarConfigAlertas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Partial<ConfigAlertas>) => input)
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("config_alertas")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", true);
    if (error) throw error;
    return { ok: true };
  });

export const executarAlertasAgora = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await garantirAdmin(context);
    const { executarAlertas } = await import("@/lib/alertas.server");
    return await executarAlertas();
  });

export const enviarEmailTeste = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { destinatario: string }) => {
    const destinatario = (input?.destinatario ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinatario)) throw new Error("E-mail inválido");
    return { destinatario };
  })
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { CONFIG_PADRAO } = await import("@/lib/cinap-alertas");
    const { enviarEmailCinap, montarEmailAviso } = await import("@/lib/email-cinap.server");

    const { data: row } = await supabaseAdmin
      .from("config_alertas")
      .select("*")
      .eq("id", true)
      .maybeSingle();
    const config = { ...CONFIG_PADRAO, ...(row ?? {}) } as ConfigAlertas;

    const conteudo = montarEmailAviso(config, {
      titulo: "E-mail de teste",
      saudacao: "Prezado(a) responsável,",
      paragrafos: [
        "Esta é uma mensagem de teste enviada pelo portal da CINAP.",
        `Remetente configurado: ${config.remetente_nome} <${config.remetente_email || "não definido"}>.`,
        "Se você recebeu esta mensagem, o disparo automático dos avisos está operacional.",
      ],
      referencia: new Date().toLocaleString("pt-BR"),
      rodape: "Nenhuma ação é necessária.",
    });

    const r = await enviarEmailCinap(
      config,
      data.destinatario,
      "CINAP · E-mail de teste",
      conteudo,
      `teste-${Date.now()}`,
    );
    return r;
  });

export const previewEmailAviso = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      tipo: "vencimento" | "atraso";
      assunto: string;
      corpo: string;
      rodape: string;
      remetente_nome: string;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { CONFIG_PADRAO, aplicarVariaveis, paragrafosDoTemplate } = await import(
      "@/lib/cinap-alertas"
    );
    const { montarEmailAviso } = await import("@/lib/email-cinap.server");

    const agora = new Date();
    const vars = {
      nome: "Pr. João da Silva",
      referencia: `${String(agora.getMonth() + 1).padStart(2, "0")}/${agora.getFullYear()}`,
      valor: "R$ 50,00",
      dia_vencimento: 10,
      meses: data.tipo === "atraso" ? 3 : 0,
      congregacao: "Congregação Central",
    };
    const config = {
      ...CONFIG_PADRAO,
      remetente_nome: data.remetente_nome || CONFIG_PADRAO.remetente_nome,
    } as ConfigAlertas;

    const conteudo = montarEmailAviso(config, {
      titulo:
        data.tipo === "vencimento"
          ? `Mensalidade vence em ${vars.dia_vencimento}`
          : `Inadimplência de ${vars.meses} mês(es)`,
      saudacao: `Prezado(a) ${vars.nome},`,
      paragrafos: paragrafosDoTemplate(data.corpo, vars),
      referencia: vars.referencia,
      valor: vars.valor,
      rodape: aplicarVariaveis(data.rodape, vars),
    });

    return { assunto: aplicarVariaveis(data.assunto, vars), html: conteudo.html };
  });

export const listarPerfisAcesso = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await garantirAdmin(context);
    const ctx = context as unknown as { supabase: any; userId: string; userEmail?: string };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let listUsersData: any[] = [];
    try {
      const res = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
      if (res.data?.users && res.data.users.length > 0) {
        listUsersData = res.data.users;
      }
    } catch {
      // Ignora se a chave for sem privilégio de admin.listUsers
    }

    const [{ data: papeis }, { data: perfis }, { data: obreiros }] = await Promise.all([
      ctx.supabase.from("user_roles").select("user_id, role"),
      ctx.supabase.from("profiles").select("id, nome, created_at"),
      ctx.supabase.from("obreiros").select("id, user_id, nome, registro, email, created_at"),
    ]);

    const userMap = new Map<string, {
      id: string;
      email: string;
      confirmado: boolean;
      criado_em?: string | null;
      ultimo_acesso?: string | null;
      nome: string;
      registro: string | null;
      papeis: string[];
    }>();

    for (const u of listUsersData) {
      userMap.set(u.id, {
        id: u.id,
        email: u.email ?? "",
        confirmado: Boolean(u.email_confirmed_at),
        criado_em: u.created_at,
        ultimo_acesso: u.last_sign_in_at ?? null,
        nome: u.user_metadata?.nome || u.user_metadata?.full_name || (u.email ? u.email.split("@")[0] : ""),
        registro: null,
        papeis: [],
      });
    }

    if (ctx.userId && !userMap.has(ctx.userId)) {
      userMap.set(ctx.userId, {
        id: ctx.userId,
        email: ctx.userEmail ?? "",
        confirmado: true,
        nome: ctx.userEmail ? ctx.userEmail.split("@")[0] : "Usuário Logado",
        registro: null,
        papeis: ["admin"],
      });
    }

    for (const p of perfis ?? []) {
      const existing = userMap.get(p.id);
      if (existing) {
        if (p.nome) existing.nome = p.nome;
      } else {
        userMap.set(p.id, {
          id: p.id,
          email: "",
          confirmado: true,
          criado_em: p.created_at,
          nome: p.nome || "Membro CINAP",
          registro: null,
          papeis: [],
        });
      }
    }

    for (const o of obreiros ?? []) {
      const uId = o.user_id || o.id;
      const existing = userMap.get(uId);
      if (existing) {
        if (o.nome) existing.nome = o.nome;
        if (o.registro) existing.registro = o.registro;
        if (o.email && !existing.email) existing.email = o.email;
      } else {
        userMap.set(uId, {
          id: uId,
          email: o.email ?? "",
          confirmado: true,
          criado_em: o.created_at,
          nome: o.nome,
          registro: o.registro ?? null,
          papeis: [],
        });
      }
    }

    for (const p of papeis ?? []) {
      const u = userMap.get(p.user_id);
      if (u) {
        if (!u.papeis.includes(p.role)) u.papeis.push(p.role);
      }
    }

    return Array.from(userMap.values());
  });

export const definirPapelAcesso = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; papel: "admin" | "obreiro"; conceder: boolean }) => input)
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const ctx = context as unknown as { supabase: any; userId: string };
    if (data.userId === ctx.userId && data.papel === "admin" && !data.conceder) {
      throw new Error("Você não pode remover o seu próprio perfil de Secretaria Geral.");
    }
    const client = ctx.supabase;
    if (data.conceder) {
      const { error } = await client
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.papel }, { onConflict: "user_id,role" });
      if (error) throw error;
    } else {
      const { error } = await client
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.papel);
      if (error) throw error;
    }
    return { ok: true };
  });

// ——— Prévia, aprovação, agendamento e auditoria ———————————————————————

export const gerarPreviaAvisos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { agendarPara?: string | null } | undefined) => ({
    agendarPara: input?.agendarPara ?? null,
  }))
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { executarAlertas } = await import("@/lib/alertas.server");
    const { registrarAuditoria } = await import("@/lib/auditoria.server");
    const resultado = await executarAlertas({
      apenasPrevia: true,
      agendarPara: data.agendarPara,
    });
    await registrarAuditoria({
      usuarioId: (context as unknown as Ctx).userId,
      acao: "aviso.previa",
      entidade: "notificacoes",
      descricao: data.agendarPara
        ? `Prévia gerada e agendada para ${new Date(data.agendarPara).toLocaleString("pt-BR")}`
        : "Prévia de avisos gerada para aprovação",
      detalhes: { ...resultado, agendado_para: data.agendarPara },
    });
    return resultado;
  });

export const decidirAvisos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { ids: string[]; acao: "aprovar" | "agendar" | "cancelar"; agendarPara?: string | null }) => {
      const ids = (input?.ids ?? []).filter((id) => typeof id === "string" && id.length > 0);
      if (ids.length === 0) throw new Error("Selecione ao menos um aviso.");
      if (!["aprovar", "agendar", "cancelar"].includes(input.acao)) throw new Error("Ação inválida.");
      if (input.acao === "agendar" && !input.agendarPara) throw new Error("Informe a data do agendamento.");
      return { ids, acao: input.acao, agendarPara: input.agendarPara ?? null };
    },
  )
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { registrarAuditoria } = await import("@/lib/auditoria.server");
    const userId = (context as unknown as Ctx).userId;
    const agora = new Date().toISOString();

    const patch =
      data.acao === "cancelar"
        ? { situacao: "cancelado", agendado_para: null }
        : data.acao === "agendar"
          ? {
              situacao: "agendado",
              agendado_para: new Date(data.agendarPara!).toISOString(),
              aprovado_por: userId,
              aprovado_em: agora,
            }
          : { situacao: "aprovado", agendado_para: null, aprovado_por: userId, aprovado_em: agora };

    const { error } = await supabaseAdmin.from("notificacoes").update(patch).in("id", data.ids);
    if (error) throw error;

    await registrarAuditoria({
      usuarioId: userId,
      acao: `aviso.${data.acao}`,
      entidade: "notificacoes",
      descricao: `${data.ids.length} aviso(s) ${
        data.acao === "cancelar" ? "cancelado(s)" : data.acao === "agendar" ? "agendado(s)" : "aprovado(s)"
      }`,
      detalhes: { ids: data.ids, agendado_para: data.agendarPara },
    });
    return { ok: true, total: data.ids.length };
  });

export const despacharAvisos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids?: string[] } | undefined) => ({ ids: input?.ids ?? [] }))
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { despacharAvisosAprovados } = await import("@/lib/alertas.server");
    const { registrarAuditoria } = await import("@/lib/auditoria.server");
    const resultado = await despacharAvisosAprovados(data.ids.length > 0 ? data.ids : undefined);
    await registrarAuditoria({
      usuarioId: (context as unknown as Ctx).userId,
      acao: "aviso.envio",
      entidade: "notificacoes",
      descricao: `Envio manual: ${resultado.enviados} enviado(s), ${resultado.falhas} falha(s)`,
      detalhes: { ...resultado, ids: data.ids },
    });
    return resultado;
  });

export const listarAuditoria = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { limite?: number } | undefined) => ({
    limite: Math.min(Math.max(input?.limite ?? 200, 1), 500),
  }))
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: linhas, error } = await supabaseAdmin
      .from("auditoria")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limite);
    if (error) throw error;
    return linhas ?? [];
  });

export const registrarAcaoSecretaria = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      acao: string;
      entidade: string;
      entidadeId?: string | null;
      descricao: string;
      detalhes?: Record<string, unknown>;
    }) => {
      if (!input?.acao || !input?.entidade) throw new Error("Ação inválida.");
      return {
        acao: input.acao.slice(0, 60),
        entidade: input.entidade.slice(0, 60),
        entidadeId: input.entidadeId ?? null,
        descricao: (input.descricao ?? "").slice(0, 400),
        detalhes: input.detalhes ?? {},
      };
    },
  )
  .handler(async ({ data, context }) => {
    await garantirAdmin(context);
    const { registrarAuditoria } = await import("@/lib/auditoria.server");
    await registrarAuditoria({ usuarioId: (context as unknown as Ctx).userId, ...data });
    return { ok: true };
  });
