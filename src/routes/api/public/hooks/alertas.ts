import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/alertas")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer /i, "") ??
          "";
        const aceitos = [
          process.env["SUPABASE_ANON_KEY"],
          process.env["SUPABASE_PUBLISHABLE_KEY"],
        ].filter((v): v is string => Boolean(v));
        if (!apikey || !aceitos.includes(apikey)) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { executarAlertas, despacharAvisosAprovados } = await import(
            "@/lib/alertas.server"
          );
          const resultado = await executarAlertas();
          const despacho = await despacharAvisosAprovados();
          return Response.json({ ...resultado, despacho });
        } catch (erro) {
          return Response.json(
            { erro: erro instanceof Error ? erro.message : "Falha ao executar alertas" },
            { status: 500 },
          );
        }
      },
    },
  },
});
