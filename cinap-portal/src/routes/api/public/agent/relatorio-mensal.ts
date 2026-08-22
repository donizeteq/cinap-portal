import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verificarChaveAgente } from "@/lib/agent.server";
import { referenciaAtual, MENSALIDADE_POR_CATEGORIA, type Categoria, type Congregacao, type Obreiro, type Pagamento } from "@/lib/cinap";

export const Route = createFileRoute("/api/public/agent/relatorio-mensal")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chave = request.headers.get("x-agent-key");
          await verificarChaveAgente(chave, "read");

          const url = new URL(request.url);
          const referencia = url.searchParams.get("referencia") ?? referenciaAtual();

          const [{ data: congregacoes }, { data: obreiros }, { data: pagamentos }] = await Promise.all([
            supabaseAdmin.from("congregacoes").select("*"),
            supabaseAdmin.from("obreiros").select("*"),
            supabaseAdmin.from("pagamentos").select("*").eq("referencia", referencia).eq("status", "pago"),
          ]);

          const categorias: Categoria[] = ["Bronze", "Prata", "Ouro"];
          const resumo = categorias.map((categoria) => {
            const congs = (congregacoes ?? []).filter((c) => c.categoria === categoria) as Congregacao[];
            const idsCong = new Set(congs.map((c) => c.id));
            const doGrupo = (obreiros ?? []).filter(
              (o) => o.congregacao_id && idsCong.has(o.congregacao_id),
            ) as Obreiro[];
            const idsObreiros = new Set(doGrupo.map((o) => o.id));
            const pagosGrupo = (pagamentos ?? []).filter((p) => idsObreiros.has(p.obreiro_id)) as Pagamento[];

            return {
              categoria,
              congregacoes: congs.length,
              obreiros: doGrupo.length,
              quitados: pagosGrupo.length,
              arrecadado: pagosGrupo.reduce((s, p) => s + Number(p.valor), 0),
              previsto: doGrupo.length * MENSALIDADE_POR_CATEGORIA[categoria],
            };
          });

          const totalArrecadado = resumo.reduce((s, r) => s + r.arrecadado, 0);
          const totalPrevisto = resumo.reduce((s, r) => s + r.previsto, 0);
          const totalObreiros = resumo.reduce((s, r) => s + r.obreiros, 0);
          const totalQuitados = resumo.reduce((s, r) => s + r.quitados, 0);

          return Response.json({
            referencia,
            categorias: resumo,
            total: {
              arrecadado: totalArrecadado,
              previsto: totalPrevisto,
              obreiros: totalObreiros,
              quitados: totalQuitados,
              inadimplencia: totalPrevisto - totalArrecadado,
              indiceAdimplencia: totalObreiros ? Math.round((totalQuitados / totalObreiros) * 100) : 0,
            },
          });
        } catch (erro) {
          const mensagem = erro instanceof Error ? erro.message : "Erro interno";
          const status = mensagem.startsWith("Unauthorized") ? 401 : mensagem.startsWith("Forbidden") ? 403 : 500;
          return Response.json({ error: mensagem }, { status });
        }
      },
    },
  },
});
