import { createFileRoute, Link } from "@tanstack/react-router";

import { dataBR } from "@/lib/cinap";
import { validarCredencial } from "@/lib/credencial.functions";

export const Route = createFileRoute("/validar/$registro")({
  loader: async ({ params }) => await validarCredencial({ data: { registro: params.registro } }),
  head: ({ params }) => ({
    meta: [
      { title: `Validação da credencial ${params.registro} | CINAP` },
      {
        name: "description",
        content:
          "Confira a autenticidade de uma credencial ministerial da CINAP pelo número de registro impresso no QR Code.",
      },
      { property: "og:title", content: "Validação de credencial ministerial | CINAP" },
      {
        property: "og:description",
        content: "Consulta pública de autenticidade das credenciais ministeriais da Convenção.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => (
    <Moldura>
      <p className="label-registro">Falha na consulta</p>
      <p className="mt-4 text-sm text-muted-foreground">
        Não foi possível validar a credencial agora. Tente novamente em instantes.
      </p>
    </Moldura>
  ),
  notFoundComponent: () => (
    <Moldura>
      <p className="label-registro">Registro não localizado</p>
    </Moldura>
  ),
  component: Validar,
});

function Validar() {
  const resultado = Route.useLoaderData();
  const { registro } = Route.useParams();

  if (!resultado.encontrada) {
    return (
      <Moldura>
        <span className="inline-block border border-destructive px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive">
          Credencial não localizada
        </span>
        <p className="mt-6 text-sm text-muted-foreground">
          Nenhum obreiro registrado sob o número{" "}
          <span className="font-mono text-foreground">{registro}</span> no quadro da Convenção.
        </p>
      </Moldura>
    );
  }

  const c = resultado.credencial;

  return (
    <Moldura>
      <span
        className={`inline-block border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
          c.valida
            ? "border-primary text-primary"
            : "border-destructive text-destructive"
        }`}
      >
        {c.valida ? "Credencial autêntica e vigente" : "Credencial irregular"}
      </span>

      <h1 className="mt-6 font-display text-3xl leading-tight">{c.nome}</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-primary">{c.cargo}</p>

      <dl className="mt-8 divide-y divide-border border border-border">
        <Linha rotulo="Registro" valor={c.registro} />
        <Linha rotulo="Congregação" valor={c.congregacao} />
        <Linha
          rotulo="Localidade"
          valor={c.cidade ? `${c.cidade}/${c.estado}` : "—"}
        />
        <Linha rotulo="Validade" valor={dataBR(c.validade)} />
        <Linha
          rotulo="Contribuição"
          valor={
            c.status_pagamento === "pago"
              ? "Em dia"
              : c.status_pagamento === "pendente"
                ? "Pendente"
                : "Em atraso"
          }
        />
      </dl>

      {!c.valida && (
        <p className="mt-6 border-l-2 border-destructive pl-4 text-sm text-destructive">
          A credencial perde a validade quando a contribuição mensal está em atraso ou o prazo de
          vigência expirou. Procure a Secretaria Geral para regularização.
        </p>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Consulta pública emitida pela Secretaria Geral da CINAP em{" "}
        {new Date().toLocaleString("pt-BR")}.
      </p>
    </Moldura>
  );
}

function Moldura({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link to="/" className="block">
            <p className="font-display text-xl leading-none">CINAP</p>
            <p className="label-registro mt-1">Validação de credencial</p>
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-16">{children}</section>
    </main>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{rotulo}</dt>
      <dd className="text-right text-sm font-semibold">{valor}</dd>
    </div>
  );
}
