import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";
import { notificarStatusMensalidade } from "@/lib/cinap-notificar";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  brl,
  categoriaClasses,
  MENSALIDADE_POR_CATEGORIA,
  type Categoria,
  type Congregacao,
  type Obreiro,
  type Pagamento,
} from "@/lib/cinap";
import {
  gerarRelatorioPainelPDF,
  type LinhaCongregacao,
  type ResumoCategoria,
} from "@/lib/cinap-pdf";
import { exportarPainelCSV } from "@/lib/cinap-csv";
import { useNotificacoes } from "@/components/SinoNotificacoes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel de Controle | CINAP" },
      {
        name: "description",
        content:
          "Visão consolidada da arrecadação, congregações ativas e situação dos obreiros da CINAP.",
      },
      { property: "og:title", content: "Painel de Controle | CINAP" },
      {
        property: "og:description",
        content: "Dashboard administrativo da Convenção das Igrejas Nacionais Autônomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Painel,
});

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const CATEGORIAS: Categoria[] = ["Bronze", "Prata", "Ouro"];

type Situacao = "Adimplentes" | "Inadimplentes";

function refDe(mes: number, ano: number) {
  return `${String(mes).padStart(2, "0")}/${ano}`;
}

/** Referências anteriores à informada, da mais recente para a mais antiga. */
function referenciasAnteriores(mes: number, ano: number, quantidade: number) {
  const lista: string[] = [];
  let m = mes;
  let a = ano;
  for (let i = 0; i < quantidade; i += 1) {
    m -= 1;
    if (m === 0) {
      m = 12;
      a -= 1;
    }
    lista.push(refDe(m, a));
  }
  return lista;
}

function Painel() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();

  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [categoria, setCategoria] = useState<"Todas" | Categoria>("Todas");
  const [altoContraste, setAltoContraste] = useState(false);
  const [series, setSeries] = useState({ arrecadado: true, previsto: true });
  const [fatias, setFatias] = useState({ Adimplentes: true, Inadimplentes: true });
  const [drill, setDrill] = useState<
    { tipo: "categoria"; valor: Categoria } | { tipo: "situacao"; valor: Situacao } | null
  >(null);
  const [montado, setMontado] = useState(false);
  const [baixa, setBaixa] = useState<{ obreiro: Obreiro; valor: string; data: string } | null>(
    null,
  );

  // Recharts + ResponsiveContainer só medem o container no cliente; renderizar
  // apenas após a montagem evita atualizações de estado durante a hidratação.
  useEffect(() => {
    setMontado(true);
  }, []);

  const avisos = useNotificacoes(10);

  const dados = useQuery({
    queryKey: ["painel"],
    enabled: isAdmin,
    queryFn: async () => {
      const [c, o, p] = await Promise.all([
        supabase.from("congregacoes").select("*").order("nome"),
        supabase.from("obreiros").select("*").order("nome"),
        supabase.from("pagamentos").select("*").order("data", { ascending: false }),
      ]);
      if (c.error) throw c.error;
      if (o.error) throw o.error;
      if (p.error) throw p.error;
      return {
        congregacoes: c.data as unknown as Congregacao[],
        obreiros: o.data as unknown as Obreiro[],
        pagamentos: p.data as unknown as Pagamento[],
      };
    },
  });

  const congregacoesTodas = useMemo(() => dados.data?.congregacoes ?? [], [dados.data]);
  const obreirosTodos = useMemo(() => dados.data?.obreiros ?? [], [dados.data]);
  const pagamentosTodos = useMemo(() => dados.data?.pagamentos ?? [], [dados.data]);

  const referencia = refDe(mes, ano);

  const mensalidadeDe = (o: Obreiro) => {
    const cong = congregacoesTodas.find((c) => c.id === o.congregacao_id);
    return Number(cong?.valor_mensalidade ?? MENSALIDADE_POR_CATEGORIA.Bronze);
  };

  const baixar = useMutation({
    mutationFn: async (entrada: { obreiro: Obreiro; valor?: number; data?: string }) => {
      const valor = entrada.valor ?? mensalidadeDe(entrada.obreiro);
      const { error } = await supabase.from("pagamentos").insert({
        obreiro_id: entrada.obreiro.id,
        valor,
        status: "pago",
        referencia,
        data: entrada.data ?? new Date().toISOString().slice(0, 10),
      });
      if (error) throw error;
      const upd = await supabase
        .from("obreiros")
        .update({ status_pagamento: "pago" })
        .eq("id", entrada.obreiro.id);
      if (upd.error) throw upd.error;
      await notificarStatusMensalidade({
        obreiroId: entrada.obreiro.id,
        referencia,
        valor,
        destinatario: entrada.obreiro.email,
      });
    },
    onSuccess: () => {
      toast.success("Pagamento registrado");
      setBaixa(null);
      queryClient.invalidateQueries({ queryKey: ["painel"] });
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const analise = useMemo(() => {
    const congregacoes = congregacoesTodas.filter(
      (c) => categoria === "Todas" || c.categoria === categoria,
    );
    const idsCong = new Set(congregacoes.map((c) => c.id));
    const obreiros = obreirosTodos.filter((o) => o.congregacao_id && idsCong.has(o.congregacao_id));
    const idsObreiros = new Set(obreiros.map((o) => o.id));

    const mensalidadeDe = (o: Obreiro) => {
      const cong = congregacoesTodas.find((c) => c.id === o.congregacao_id);
      return Number(cong?.valor_mensalidade ?? MENSALIDADE_POR_CATEGORIA.Bronze);
    };

    const pagamentosPeriodo = pagamentosTodos.filter(
      (p) => p.referencia === referencia && idsObreiros.has(p.obreiro_id),
    );
    const pagosPeriodo = pagamentosPeriodo.filter((p) => p.status === "pago");
    const quitados = new Set(pagosPeriodo.map((p) => p.obreiro_id));

    const arrecadado = pagosPeriodo.reduce((s, p) => s + Number(p.valor), 0);
    const previsto = obreiros.reduce((s, o) => s + mensalidadeDe(o), 0);
    const adimplentes = obreiros.filter((o) => quitados.has(o.id)).length;
    const taxa = obreiros.length ? Math.round((adimplentes / obreiros.length) * 100) : 0;

    const resumo: ResumoCategoria[] = CATEGORIAS.filter(
      (cat) => categoria === "Todas" || cat === categoria,
    ).map((cat) => {
      const ids = new Set(congregacoes.filter((c) => c.categoria === cat).map((c) => c.id));
      const grupo = obreiros.filter((o) => o.congregacao_id && ids.has(o.congregacao_id));
      const idsGrupo = new Set(grupo.map((o) => o.id));
      const pagos = pagosPeriodo.filter((p) => idsGrupo.has(p.obreiro_id));
      return {
        categoria: cat,
        congregacoes: ids.size,
        obreiros: grupo.length,
        quitados: pagos.length,
        arrecadado: pagos.reduce((s, p) => s + Number(p.valor), 0),
        previsto: grupo.reduce((s, o) => s + mensalidadeDe(o), 0),
      };
    });

    const porCongregacao: LinhaCongregacao[] = congregacoes.map((c) => {
      const grupo = obreiros.filter((o) => o.congregacao_id === c.id);
      const idsGrupo = new Set(grupo.map((o) => o.id));
      const pagos = pagosPeriodo.filter((p) => idsGrupo.has(p.obreiro_id));
      return {
        nome: c.nome,
        categoria: c.categoria,
        cidade: c.cidade,
        estado: c.estado,
        obreiros: grupo.length,
        quitados: pagos.length,
        arrecadado: pagos.reduce((s, p) => s + Number(p.valor), 0),
        previsto: grupo.reduce((s, o) => s + mensalidadeDe(o), 0),
      };
    });

    const historico = [referencia, ...referenciasAnteriores(mes, ano, 11)];
    const inadimplentes = obreiros
      .filter((o) => !quitados.has(o.id))
      .map((o) => {
        let atraso = 0;
        for (const ref of historico) {
          const pagou = pagamentosTodos.some(
            (p) => p.obreiro_id === o.id && p.referencia === ref && p.status === "pago",
          );
          if (pagou) break;
          atraso += 1;
        }
        const cong = congregacoesTodas.find((c) => c.id === o.congregacao_id);
        return {
          obreiro: o,
          congregacao: cong,
          meses: atraso,
          valor: mensalidadeDe(o) * Math.max(atraso, 1),
        };
      })
      .sort((a, b) => b.meses - a.meses);

    return {
      congregacoes,
      obreiros,
      quitados,
      arrecadado,
      previsto,
      adimplentes,
      taxa,
      resumo,
      porCongregacao,

      inadimplentes,
      emAberto: inadimplentes.reduce((s, i) => s + i.valor, 0),
    };
  }, [congregacoesTodas, obreirosTodos, pagamentosTodos, categoria, referencia, mes, ano]);

  const cores = altoContraste
    ? {
        arrecadado: "var(--color-naval)",
        previsto: "var(--color-muted-foreground)",
        Adimplentes: "var(--color-naval)",
        Inadimplentes: "var(--color-chart-2)",
        grade: "var(--color-foreground)",
        eixo: "var(--color-foreground)",
      }
    : {
        arrecadado: "var(--color-chart-2)",
        previsto: "var(--color-chart-3)",
        Adimplentes: "var(--color-chart-2)",
        Inadimplentes: "var(--color-chart-1)",
        grade: "var(--color-border)",
        eixo: "var(--color-muted-foreground)",
      };

  const tooltipStyle = {
    background: "var(--color-surface)",
    border: `1px solid ${altoContraste ? "var(--color-foreground)" : "var(--color-border)"}`,
    borderRadius: 0,
    fontSize: 12,
    color: "var(--color-foreground)",
  };

  const dadosPizza = [
    { nome: "Adimplentes", valor: analise.adimplentes },
    { nome: "Inadimplentes", valor: Math.max(analise.obreiros.length - analise.adimplentes, 0) },
  ].filter((f) => fatias[f.nome as keyof typeof fatias] && f.valor > 0);

  // Detalhamento do drill-down (categoria clicada no gráfico de barras ou fatia da rosca)
  const detalhe = (() => {
    if (!drill) return null;
    const congregacoes =
      drill.tipo === "categoria"
        ? analise.congregacoes.filter((c) => c.categoria === drill.valor)
        : analise.congregacoes;
    const idsCong = new Set(congregacoes.map((c) => c.id));
    let obreiros = analise.obreiros.filter(
      (o) => o.congregacao_id && idsCong.has(o.congregacao_id),
    );
    if (drill.tipo === "situacao") {
      obreiros = obreiros.filter((o) =>
        drill.valor === "Adimplentes" ? analise.quitados.has(o.id) : !analise.quitados.has(o.id),
      );
    }
    const linhas = obreiros.map((o) => {
      const cong = analise.congregacoes.find((c) => c.id === o.congregacao_id);
      return {
        obreiro: o,
        congregacao: cong,
        valor: mensalidadeDe(o),
        pago: analise.quitados.has(o.id),
      };
    });
    return {
      titulo:
        drill.tipo === "categoria"
          ? `Categoria ${drill.valor}`
          : `Obreiros ${drill.valor.toLowerCase()}`,
      congregacoes:
        drill.tipo === "categoria"
          ? congregacoes
          : congregacoes.filter((c) => obreiros.some((o) => o.congregacao_id === c.id)),
      linhas,
      arrecadado: linhas.filter((l) => l.pago).reduce((s, l) => s + l.valor, 0),
    };
  })();

  if (!carregando && !isAdmin) {
    return (
      <PortalShell titulo="Painel de Controle Institucional">
        <div className="plate p-10 text-center">
          <p className="label-registro">Acesso restrito</p>
          <h3 className="mt-3 font-display text-2xl">Área exclusiva da secretaria</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Seu acesso é de obreiro. Consulte sua situação cadastral e financeira na área pessoal.
          </p>
          <Link
            to="/minha-situacao"
            className="mt-6 inline-flex bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Minha situação
          </Link>
        </div>
      </PortalShell>
    );
  }

  const anos = Array.from({ length: 6 }, (_, i) => hoje.getFullYear() - 4 + i);
  const criticos = analise.inadimplentes.filter((i) => i.meses >= 3);

  return (
    <PortalShell titulo="Painel de Controle Institucional">
      {/* Filtros */}
      <section className="plate flex flex-wrap items-end gap-4 p-5">
        <div>
          <label className="label-registro" htmlFor="filtro-mes">
            Mês
          </label>
          <select
            id="filtro-mes"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="mt-1 block border border-input bg-surface px-3 py-2 text-sm"
          >
            {MESES.map((nome, i) => (
              <option key={nome} value={i + 1}>
                {nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-registro" htmlFor="filtro-ano">
            Ano
          </label>
          <select
            id="filtro-ano"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="mt-1 block border border-input bg-surface px-3 py-2 text-sm"
          >
            {anos.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-registro" htmlFor="filtro-categoria">
            Categoria
          </label>
          <select
            id="filtro-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as "Todas" | Categoria)}
            className="mt-1 block border border-input bg-surface px-3 py-2 text-sm"
          >
            <option value="Todas">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setMes(hoje.getMonth() + 1);
            setAno(hoje.getFullYear());
            setCategoria("Todas");
          }}
          className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-secondary"
        >
          Mês atual
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={altoContraste}
            onClick={() => setAltoContraste((v) => !v)}
            className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
              altoContraste
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:bg-secondary"
            }`}
          >
            Alto contraste
          </button>
          <button
            type="button"
            onClick={() =>
              exportarPainelCSV(
                referencia,
                categoria,
                analise.resumo,
                analise.porCongregacao,
                analise.inadimplentes.map((i) => ({
                  obreiro: i.obreiro.nome,
                  registro: i.obreiro.registro,
                  congregacao: i.congregacao?.nome ?? "",
                  categoria: i.congregacao?.categoria ?? "",
                  meses: i.meses,
                  valor: i.valor,
                })),
              )
            }
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-secondary"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() =>
              gerarRelatorioPainelPDF(referencia, categoria, analise.resumo, analise.porCongregacao)
            }
            className="bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >
            Exportar PDF
          </button>
        </div>
      </section>

      {/* Alertas */}
      {analise.inadimplentes.length > 0 && (
        <div
          className={`border-l-4 p-4 text-sm ${
            criticos.length
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-warning bg-warning/10 text-warning-foreground"
          }`}
          role="status"
        >
          <strong className="font-semibold">
            {analise.inadimplentes.length} obreiro(s) inadimplentes em {referencia}.
          </strong>{" "}
          {criticos.length > 0
            ? `${criticos.length} com 3 meses ou mais de atraso — regularização urgente.`
            : "Montante em aberto acumulado: "}
          {criticos.length === 0 && <span>{brl(analise.emAberto)}</span>}
        </div>
      )}

      {/* Indicadores */}
      <section className="grid gap-6 md:grid-cols-4">
        <div className="plate p-6">
          <p className="label-registro">Arrecadado · {referencia}</p>
          <h3 className="mt-2 font-display text-3xl">{brl(analise.arrecadado)}</h3>
          <p className="mt-3 text-[10px] text-muted-foreground">
            Previsto: {brl(analise.previsto)}
          </p>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Taxa de adimplência</p>
          <h3 className="mt-2 font-display text-3xl">{analise.taxa}%</h3>
          <div className="mt-4 flex h-1.5 w-full overflow-hidden bg-muted">
            <div
              className="h-full"
              style={{ width: `${analise.taxa}%`, background: cores.Adimplentes }}
            />
          </div>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Congregações no filtro</p>
          <h3 className="mt-2 font-display text-3xl">
            {analise.congregacoes.filter((c) => c.ativa).length}
          </h3>
          <p className="mt-3 text-[10px] text-muted-foreground">
            {analise.obreiros.length} obreiros vinculados
          </p>
        </div>
        <div className="plate p-6">
          <p className="label-registro">Inadimplentes</p>
          <h3 className="mt-2 font-display text-3xl">{analise.inadimplentes.length}</h3>
          <p className="mt-3 text-[10px] text-muted-foreground">
            Em aberto: {brl(analise.emAberto)}
          </p>
        </div>
      </section>

      {/* Avisos in-app */}
      <section className="plate p-6">
        <div className="flex items-center justify-between">
          <p className="label-registro">Avisos de vencimento e atraso</p>
          <Link
            to="/alertas"
            className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            Configurar alertas
          </Link>
        </div>
        {(avisos.data ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum aviso pendente. A verificação automática roda diariamente.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(avisos.data ?? []).map((n) => (
              <li
                key={n.id}
                className={`flex flex-wrap items-center justify-between gap-2 border-l-2 px-3 py-2 text-sm ${
                  n.tipo === "vencimento"
                    ? "border-l-chart-2 bg-secondary/40"
                    : "border-l-destructive bg-destructive/5"
                }`}
              >
                <span>
                  <strong className="font-medium">{n.titulo}</strong>
                  <span className="ml-2 text-muted-foreground">{n.mensagem}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {n.referencia}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Gráficos */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="plate p-6 lg:col-span-2">
          <p className="label-registro">
            Arrecadado x previsto por categoria · {referencia}
            <span className="ml-2 normal-case tracking-normal text-muted-foreground">
              (clique em uma barra para detalhar)
            </span>
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            {(["arrecadado", "previsto"] as const).map((chave) => (
              <button
                key={chave}
                type="button"
                aria-pressed={series[chave]}
                onClick={() => setSeries((s) => ({ ...s, [chave]: !s[chave] }))}
                className={`flex items-center gap-2 text-[11px] uppercase tracking-widest transition-opacity ${
                  series[chave] ? "opacity-100" : "opacity-40 line-through"
                }`}
              >
                <span className="h-2.5 w-2.5" style={{ background: cores[chave] }} />
                {chave}
              </button>
            ))}
          </div>
          <div className="mt-4 h-60">
            {!montado ? (
              <div className="h-full w-full border border-dashed border-border" aria-hidden />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analise.resumo}
                margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
                onClick={(e: { activeLabel?: string }) => {
                  const cat = e?.activeLabel as Categoria | undefined;
                  if (cat) setDrill({ tipo: "categoria", valor: cat });
                }}
                style={{ cursor: "pointer" }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke={cores.grade}
                  strokeOpacity={altoContraste ? 0.35 : 1}
                />
                <XAxis
                  dataKey="categoria"
                  tickLine={false}
                  axisLine={{ stroke: cores.eixo }}
                  tick={{ fontSize: 11, fill: cores.eixo }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={72}
                  tick={{ fontSize: 10, fill: cores.eixo }}
                  tickFormatter={(v: number) => brl(v)}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)" }}
                  contentStyle={tooltipStyle}
                  formatter={(v: number, nome: string) => [brl(v), nome]}
                />
                {series.arrecadado && (
                  <Bar
                    dataKey="arrecadado"
                    name="Arrecadado"
                    fill={cores.arrecadado}
                    maxBarSize={48}
                    stroke={altoContraste ? "var(--color-foreground)" : undefined}
                  />
                )}
                {series.previsto && (
                  <Bar
                    dataKey="previsto"
                    name="Previsto"
                    fill={cores.previsto}
                    maxBarSize={48}
                    fillOpacity={altoContraste ? 0.25 : 1}
                    stroke={altoContraste ? "var(--color-foreground)" : undefined}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="plate p-6">
          <p className="label-registro">Situação dos obreiros</p>
          <div className="mt-2 h-44">
            {!montado ? (
              <div className="h-full w-full border border-dashed border-border" aria-hidden />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  dataKey="valor"
                  nameKey="nome"
                  innerRadius={44}
                  outerRadius={68}
                  strokeWidth={altoContraste ? 2 : 0}
                  stroke="var(--color-foreground)"
                  style={{ cursor: "pointer" }}
                  onClick={(f: { nome?: string }) => {
                    if (f?.nome) setDrill({ tipo: "situacao", valor: f.nome as Situacao });
                  }}
                >
                  {dadosPizza.map((f) => (
                    <Cell key={f.nome} fill={cores[f.nome as "Adimplentes" | "Inadimplentes"]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
          <div className="mt-3 space-y-2">
            {(["Adimplentes", "Inadimplentes"] as const).map((nome) => {
              const valor =
                nome === "Adimplentes"
                  ? analise.adimplentes
                  : Math.max(analise.obreiros.length - analise.adimplentes, 0);
              return (
                <button
                  key={nome}
                  type="button"
                  aria-pressed={fatias[nome]}
                  onClick={() => setFatias((f) => ({ ...f, [nome]: !f[nome] }))}
                  className={`flex w-full items-center gap-2 text-[11px] transition-opacity ${
                    fatias[nome] ? "opacity-100" : "opacity-40 line-through"
                  }`}
                >
                  <span className="h-2.5 w-2.5" style={{ background: cores[nome] }} />
                  <span className="text-muted-foreground">{nome}</span>
                  <span className="ml-auto font-mono">{valor}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detalhamento por categoria */}
      <section className="border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest">
            Arrecadação e adimplência por categoria
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary">
                <Th>Categoria</Th>
                <Th>Igrejas</Th>
                <Th>Obreiros</Th>
                <Th>Quitados</Th>
                <Th>Arrecadado</Th>
                <Th>Previsto</Th>
                <Th>Adimplência</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {analise.resumo.map((r) => {
                const taxa = r.obreiros ? Math.round((r.quitados / r.obreiros) * 100) : 0;
                return (
                  <tr key={r.categoria} className="transition-colors hover:bg-secondary/50">
                    <Td>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase ${categoriaClasses(r.categoria)}`}
                      >
                        {r.categoria}
                      </span>
                    </Td>
                    <Td className="text-muted-foreground">{r.congregacoes}</Td>
                    <Td className="text-muted-foreground">{r.obreiros}</Td>
                    <Td>{r.quitados}</Td>
                    <Td className="font-medium">{brl(r.arrecadado)}</Td>
                    <Td className="text-muted-foreground">{brl(r.previsto)}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden bg-muted">
                          <div
                            className="h-full"
                            style={{ width: `${taxa}%`, background: cores.Adimplentes }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{taxa}%</span>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inadimplentes */}
      <section className="border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest">
            Obreiros inadimplentes · {referencia}
          </h4>
          <Link
            to="/pagamentos"
            className="border border-primary px-4 py-2 text-[11px] font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            TESOURARIA
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary">
                <Th>Obreiro</Th>
                <Th>Congregação</Th>
                <Th>Atraso</Th>
                <Th>Em aberto</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {analise.inadimplentes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum obreiro inadimplente no período selecionado.
                  </td>
                </tr>
              )}
              {analise.inadimplentes.slice(0, 20).map((item) => (
                <tr
                  key={item.obreiro.id}
                  className={
                    item.meses >= 3 ? "bg-destructive/10" : item.meses === 2 ? "bg-warning/10" : ""
                  }
                >
                  <Td className="font-medium">
                    {item.obreiro.nome}
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                      {item.obreiro.registro}
                    </span>
                  </Td>
                  <Td className="text-muted-foreground">{item.congregacao?.nome ?? "—"}</Td>
                  <Td>
                    <span
                      className={`whitespace-nowrap px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.meses >= 3
                          ? "bg-destructive/15 text-destructive"
                          : item.meses === 2
                            ? "bg-warning/20 text-warning-foreground"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {item.meses >= 12 ? "12+" : item.meses} {item.meses === 1 ? "mês" : "meses"}
                    </span>
                  </Td>
                  <Td>{brl(item.valor)}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={baixar.isPending}
                        onClick={() =>
                          setBaixa({
                            obreiro: item.obreiro,
                            valor: String(mensalidadeDe(item.obreiro)),
                            data: new Date().toISOString().slice(0, 10),
                          })
                        }
                        className="bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
                      >
                        Registrar pagamento
                      </button>
                      <Link
                        to="/pagamentos"
                        className="border border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors hover:bg-secondary"
                      >
                        Histórico
                      </Link>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Congregações */}
      <section className="border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest">
            Totais por congregação · {referencia}
          </h4>
          <Link
            to="/congregacoes"
            className="border border-primary px-4 py-2 text-[11px] font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            GERENCIAR
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary">
                <Th>Nome da igreja</Th>
                <Th>Localidade</Th>
                <Th>Categoria</Th>
                <Th>Obreiros</Th>
                <Th>Quitados</Th>
                <Th>Arrecadado</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {analise.porCongregacao.map((c) => (
                <tr key={c.nome} className="transition-colors hover:bg-secondary/50">
                  <Td className="font-medium">{c.nome}</Td>
                  <Td className="text-muted-foreground">
                    {c.cidade}/{c.estado}
                  </Td>
                  <Td>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase ${categoriaClasses(c.categoria)}`}
                    >
                      {c.categoria}
                    </span>
                  </Td>
                  <Td className="text-muted-foreground">{c.obreiros}</Td>
                  <Td>
                    {c.quitados}/{c.obreiros}
                  </Td>
                  <Td>{brl(c.arrecadado)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Drill-down por categoria / situação */}
      <Dialog open={!!drill} onOpenChange={(aberto) => !aberto && setDrill(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-none">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{detalhe?.titulo}</DialogTitle>
            <DialogDescription>
              Referência {referencia} · {detalhe?.congregacoes.length ?? 0} congregação(ões) ·{" "}
              {detalhe?.linhas.length ?? 0} obreiro(s) · arrecadado {brl(detalhe?.arrecadado ?? 0)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="label-registro">Congregações</p>
              <ul className="mt-2 divide-y divide-border/60 border border-border">
                {detalhe?.congregacoes.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 px-4 py-2 text-sm">
                    <span className="font-medium">{c.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.cidade}/{c.estado}
                    </span>
                    <span
                      className={`ml-auto px-2 py-0.5 text-[10px] font-bold uppercase ${categoriaClasses(c.categoria)}`}
                    >
                      {c.categoria}
                    </span>
                  </li>
                ))}
                {detalhe?.congregacoes.length === 0 && (
                  <li className="px-4 py-3 text-sm text-muted-foreground">
                    Nenhuma congregação nesse recorte.
                  </li>
                )}
              </ul>
            </div>

            <div>
              <p className="label-registro">Obreiros</p>
              <table className="mt-2 w-full border-collapse border border-border text-left text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="label-registro px-4 py-2 font-normal">Obreiro</th>
                    <th className="label-registro px-4 py-2 font-normal">Congregação</th>
                    <th className="label-registro px-4 py-2 font-normal">Mensalidade</th>
                    <th className="label-registro px-4 py-2 font-normal">Situação</th>
                    <th className="label-registro px-4 py-2 font-normal" />
                  </tr>
                </thead>
                <tbody>
                  {detalhe?.linhas.map((l) => (
                    <tr key={l.obreiro.id} className="border-t border-border/60">
                      <td className="px-4 py-2 font-medium">{l.obreiro.nome}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {l.congregacao?.nome ?? "—"}
                      </td>
                      <td className="px-4 py-2">{brl(l.valor)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            l.pago
                              ? "bg-secondary text-foreground"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {l.pago ? "Pago" : "Em aberto"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {!l.pago && (
                          <button
                            type="button"
                            onClick={() => {
                              setDrill(null);
                              setBaixa({
                                obreiro: l.obreiro,
                                valor: String(l.valor),
                                data: new Date().toISOString().slice(0, 10),
                              });
                            }}
                            className="border border-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            Registrar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {detalhe?.linhas.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-muted-foreground">
                        Nenhum obreiro nesse recorte.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ação rápida: registrar pagamento */}
      <Dialog open={!!baixa} onOpenChange={(aberto) => !aberto && setBaixa(null)}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Registrar pagamento</DialogTitle>
            <DialogDescription>
              {baixa?.obreiro.nome} · referência {referencia}
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!baixa) return;
              const valor = Number(baixa.valor.replace(",", "."));
              if (!Number.isFinite(valor) || valor <= 0) {
                toast.error("Informe um valor válido");
                return;
              }
              baixar.mutate({ obreiro: baixa.obreiro, valor, data: baixa.data });
            }}
          >
            <div>
              <label className="label-registro" htmlFor="baixa-valor">
                Valor (R$)
              </label>
              <input
                id="baixa-valor"
                inputMode="decimal"
                value={baixa?.valor ?? ""}
                onChange={(e) => setBaixa((b) => (b ? { ...b, valor: e.target.value } : b))}
                className="mt-1 w-full border border-input bg-surface px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="label-registro" htmlFor="baixa-data">
                Data do pagamento
              </label>
              <input
                id="baixa-data"
                type="date"
                value={baixa?.data ?? ""}
                onChange={(e) => setBaixa((b) => (b ? { ...b, data: e.target.value } : b))}
                className="mt-1 w-full border border-input bg-surface px-3 py-2 text-sm"
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setBaixa(null)}
                className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={baixar.isPending}
                className="bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
              >
                {baixar.isPending ? "Registrando..." : "Confirmar baixa"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PortalShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="label-registro border-b border-border px-6 py-3 font-normal">{children}</th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border/60 px-6 py-4 ${className}`}>{children}</td>;
}
