import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verificarChaveAgente } from "@/lib/agent.server";

export const Route = createFileRoute("/api/public/agent/obreiros/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "read");

          const { data, error } = await supabaseAdmin.from("obreiros").select("*").order("nome");
          if (error) throw error;
          return Response.json({ data });
        } catch (erro) {
          const mensagem = erro instanceof Error ? erro.message : "Erro interno";
          const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
          return Response.json({ error: mensagem }, { status });
        }
      },
      POST: async ({ request }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "write");

          const body = (await request.json()) as Record<string, unknown>;
          const payload = {
            nome: String(body["nome"] ?? ""),
            congregacao_id: body["congregacao_id"] ? String(body["congregacao_id"]) : null,
            cargo: String(body["cargo"] ?? "Obreiro"),
            cpf: body["cpf"] ? String(body["cpf"]) : null,
            email: body["email"] ? String(body["email"]) : null,
            status_pagamento: String(body["status_pagamento"] ?? "pendente") as "pago" | "pendente" | "atrasado",
          };

          if (!payload.nome) {
            return Response.json({ error: "Nome é obrigatório" }, { status: 400 });
          }

          const { data, error } = await supabaseAdmin.from("obreiros").insert(payload).select().single();
          if (error) throw error;
          return Response.json({ data }, { status: 201 });
        } catch (erro) {
          const mensagem = erro instanceof Error ? erro.message : "Erro interno";
          const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
          return Response.json({ error: mensagem }, { status });
        }
      },
    },
  },
});
