import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verificarChaveAgente } from "@/lib/agent.server";
import type { Categoria } from "@/lib/cinap";

export const Route = createFileRoute("/api/public/agent/congregacoes/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "write");

          const body = (await request.json()) as Record<string, unknown>;
          const payload: Record<string, unknown> = {};

          if ("nome" in body) payload["nome"] = String(body["nome"]);
          if ("categoria" in body) payload["categoria"] = String(body["categoria"]) as Categoria;
          if ("qdt_obreiros" in body) payload["qdt_obreiros"] = Number(body["qdt_obreiros"]);
          if ("cidade" in body) payload["cidade"] = String(body["cidade"]);
          if ("estado" in body) payload["estado"] = String(body["estado"]);
          if ("ativa" in body) payload["ativa"] = Boolean(body["ativa"]);

          if (Object.keys(payload).length === 0) {
            return Response.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
          }

          const { data, error } = await supabaseAdmin
            .from("congregacoes")
            .update(payload as never)
            .eq("id", params.id)
            .select()
            .single();

          if (error) throw error;
          if (!data) return Response.json({ error: "Congregação não encontrada" }, { status: 404 });
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
