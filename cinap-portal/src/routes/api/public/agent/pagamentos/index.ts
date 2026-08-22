import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verificarChaveAgente } from "@/lib/agent.server";
import { referenciaAtual } from "@/lib/cinap";

export const Route = createFileRoute("/api/public/agent/pagamentos/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "read");

          const { data, error } = await supabaseAdmin
            .from("pagamentos")
            .select("*")
            .order("data", { ascending: false });
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
          const obreiroId = String(body["obreiro_id"] ?? "");
          const referencia = String(body["referencia"] ?? referenciaAtual());
          const dataPagamento = String(body["data"] ?? new Date().toISOString().slice(0, 10));

          if (!obreiroId) {
            return Response.json({ error: "obreiro_id é obrigatório" }, { status: 400 });
          }

          const { data: obreiro, error: erroObreiro } = await supabaseAdmin
            .from("obreiros")
            .select("*, congregacao:congregacoes(valor_mensalidade, categoria)")
            .eq("id", obreiroId)
            .single();

          if (erroObreiro || !obreiro) {
            return Response.json({ error: "Obreiro não encontrado" }, { status: 404 });
          }

          const obreiroRecord = obreiro as unknown as Record<string, unknown>;
          const congregacao = obreiroRecord["congregacao"] as
            | { valor_mensalidade: number; categoria: string }
            | null;
          const valor = Number(
            body["valor"] ??
              (congregacao?.valor_mensalidade ??
                { Bronze: 40, Prata: 50, Ouro: 60 }[(congregacao?.categoria as "Bronze" | "Prata" | "Ouro") ?? "Bronze"]),
          );

          const [{ data: pagamento, error: erroPagamento }] = await Promise.all([
            supabaseAdmin
              .from("pagamentos")
              .insert({
                obreiro_id: obreiroId,
                valor,
                data: dataPagamento,
                status: "pago",
                referencia,
              })
              .select()
              .single(),
            supabaseAdmin.from("obreiros").update({ status_pagamento: "pago" }).eq("id", obreiroId),
          ]);

          if (erroPagamento) throw erroPagamento;
          return Response.json({ data: pagamento }, { status: 201 });
        } catch (erro) {
          const mensagem = erro instanceof Error ? erro.message : "Erro interno";
          const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
          return Response.json({ error: mensagem }, { status });
        }
      },
    },
  },
});
