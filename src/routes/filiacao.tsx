import { createFileRoute, Link } from "@tanstack/react-router";

import { brl } from "@/lib/cinap";
import {
  DOCUMENTOS_OBRIGATORIOS,
  OBSERVACAO_DOCUMENTOS,
  PIX_CHAVE,
  PIX_OBSERVACAO,
  PIX_TITULAR,
  TAXA_CREDENCIAL,
  TAXA_INSCRICAO,
} from "@/lib/cinap-filiacao";

export const Route = createFileRoute("/filiacao")({
  head: () => ({
    meta: [
      { title: "Filiação de Obreiro — Taxas e Documentos | CINAP" },
      {
        name: "description",
        content:
          "Como se filiar à CINAP: taxa de inscrição de R$ 50,00, credencial de R$ 20,00, chave PIX oficial e a lista de documentos obrigatórios.",
      },
      { property: "og:title", content: "Filiação de Obreiro — Taxas e Documentos | CINAP" },
      {
        property: "og:description",
        content: "Forma de pagamento, chave PIX e documentação exigida para o cadastro de obreiros.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Filiacao,
});

function Filiacao() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="block">
            <p className="font-display text-xl leading-none">CINAP</p>
            <p className="label-registro mt-1">Secretaria Geral</p>
          </Link>
          <Link
            to="/auth"
            className="bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Acessar portal
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="label-registro">Instrução normativa</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
          Filiação de obreiro: pagamento e documentação
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          O processo de cadastro no quadro de obreiros da Convenção é concluído em duas etapas:
          o recolhimento das taxas de inscrição e credencial, e o envio da documentação
          obrigatória à Secretaria Geral.
        </p>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="label-registro">1 — Forma de pagamento</p>
            <dl className="mt-6 divide-y divide-border border border-border">
              <Linha rotulo="Taxa de inscrição" valor={brl(TAXA_INSCRICAO)} />
              <Linha rotulo="Credencial" valor={brl(TAXA_CREDENCIAL)} />
              <Linha rotulo="Total" valor={brl(TAXA_INSCRICAO + TAXA_CREDENCIAL)} destaque />
            </dl>
            <div className="mt-6 border border-border p-5">
              <p className="label-registro">Chave PIX (CNPJ)</p>
              <p className="mt-2 select-all font-mono text-lg tracking-wider">{PIX_CHAVE}</p>
              <p className="mt-4 label-registro">Conta</p>
              <p className="mt-2 text-sm">{PIX_TITULAR}</p>
            </div>
            <p className="mt-4 border-l-2 border-primary pl-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Observação:</strong> {PIX_OBSERVACAO}
            </p>
          </div>

          <div>
            <p className="label-registro">2 — Dos documentos</p>
            <ol className="mt-6 space-y-4">
              {DOCUMENTOS_OBRIGATORIOS.map((doc, i) => (
                <li key={doc.titulo} className="flex gap-4 border border-border p-4">
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{doc.titulo}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{doc.detalhe}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-l-2 border-primary pl-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Observação:</strong> {OBSERVACAO_DOCUMENTOS}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Após a confirmação do pagamento e a conferência dos documentos, a Secretaria Geral efetua
          o registro do obreiro e libera a credencial ministerial digital, com QR Code de validação
          pública, na área exclusiva do obreiro.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/auth"
            className="bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Área do obreiro
          </Link>
          <Link
            to="/"
            className="border border-border px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}

function Linha({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{rotulo}</dt>
      <dd className={destaque ? "font-display text-2xl text-primary" : "font-mono text-sm"}>
        {valor}
      </dd>
    </div>
  );
}
