import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verificarChaveAgente } from "@/lib/agent.server";
import type { Categoria } from "@/lib/cinap";

export const Route = createFileRoute("/api/public/agent/congregacoes/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "read");

          const { data, error } = await supabaseAdmin
            .from("congregacoes")
            .select("*")
            .order("nome");

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
            categoria: String(body["categoria"] ?? "Bronze") as Categoria,
            qdt_obreiros: Number(body["qdt_obreiros"] ?? 0),
            cidade: String(body["cidade"] ?? ""),
            estado: String(body["estado"] ?? ""),
            ativa: Boolean(body["ativa"] ?? true),
          };

          if (!payload.nome) {
            return Response.json({ error: "Nome é obrigatório" }, { status: 400 });
          }

          const { data, error } = await supabaseAdmin.from("congregacoes").insert(payload).select().single();
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
