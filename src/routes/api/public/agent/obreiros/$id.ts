import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verificarChaveAgente } from "@/lib/agent.server";

export const Route = createFileRoute("/api/public/agent/obreiros/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "write");

          const body = (await request.json()) as Record<string, unknown>;
          const payload: Record<string, unknown> = {};

          if ("nome" in body) payload["nome"] = String(body["nome"]);
          if ("congregacao_id" in body) payload["congregacao_id"] = body["congregacao_id"] ? String(body["congregacao_id"]) : null;
          if ("cargo" in body) payload["cargo"] = String(body["cargo"]);
          if ("cpf" in body) payload["cpf"] = body["cpf"] ? String(body["cpf"]) : null;
          if ("email" in body) payload["email"] = body["email"] ? String(body["email"]) : null;
          if ("status_pagamento" in body) payload["status_pagamento"] = String(body["status_pagamento"]);

          if (Object.keys(payload).length === 0) {
            return Response.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
          }

          const { data, error } = await supabaseAdmin
            .from("obreiros")
            .update(payload as never)
            .eq("id", params.id)
            .select()
            .single();

          if (error) throw error;
          if (!data) return Response.json({ error: "Obreiro não encontrado" }, { status: 404 });
          return Response.json({ data });
        } catch (erro) {
          const mensagem = erro instanceof Error ? erro.message : "Erro interno";
          const status = mensagem.startsWith("Unauthorized")
            ? 401
            : mensagem.startsWith("Forbidden")
              ? 403
              : 500;
          return Response.json({ error: mensagem }, { status });
        }
      },
    },
  },
});
