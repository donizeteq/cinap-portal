import { createFileRoute, Link } from "@tanstack/react-router";

import { brl, CATEGORIAS, MENSALIDADE_POR_CATEGORIA } from "@/lib/cinap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CINAP — Convenção das Igrejas Nacionais Autônomas" },
      {
        name: "description",
        content:
          "Portal institucional da CINAP: registro de congregações, corpo de obreiros, credencial ministerial digital e controle de contribuições.",
      },
      { property: "og:title", content: "CINAP — Convenção das Igrejas Nacionais Autônomas" },
      {
        property: "og:description",
        content:
          "Secretaria digital da convenção: congregações, obreiros, credenciais e mensalidades do Art. 7º.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-display text-xl leading-none">CINAP</p>
            <p className="label-registro mt-1">Secretaria Geral</p>
          </div>
          <Link
            to="/auth"
            className="bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Acessar portal
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="label-registro">Documento institucional</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
          Convenção das Igrejas Nacionais Autônomas
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Portal de gestão administrativa para o registro das congregações filiadas, do corpo de
          obreiros, das contribuições mensais e da emissão da credencial ministerial digital.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/painel"
            className="bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20"
          >
            Painel administrativo
          </Link>
          <Link
            to="/minha-situacao"
            className="border border-border px-8 py-4 text-[11px] font-bold uppercase tracking-widest"
          >
            Área do obreiro
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="label-registro">Art. 7º — Tabela de contribuição</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {CATEGORIAS.map((c) => (
              <div key={c} className="border border-border p-6">
                <p className="label-registro">Categoria</p>
                <h3 className="mt-1 font-display text-3xl">{c}</h3>
                <p className="mt-6 font-display text-4xl text-primary">
                  {brl(MENSALIDADE_POR_CATEGORIA[c])}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">mensalidade por congregação</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10 text-xs text-muted-foreground">
        CINAP — Convenção das Igrejas Nacionais Autônomas · Secretaria Geral
      </footer>
    </main>
  );
}
