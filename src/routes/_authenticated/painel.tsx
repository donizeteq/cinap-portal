import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Download,
  FileText,
  TrendingUp,
  CheckCircle,
  Eye,
  Clock,
  Briefcase,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import {
  brl,
  categoriaClasses,
  dataBR,
  statusClasses,
  STATUS_LABEL,
  referenciaAtual,
  type Congregacao,
  type Categoria,
  type Obreiro,
  type Pagamento,
} from "@/lib/cinap";
import { gerarRelatorioMensalPDF, resumoPorCategoria } from "@/lib/cinap-pdf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel de Controle | CINAP" },
    ],
  }),
  component: Painel,
});

function Painel() {
  const { isAdmin, carregando } = usePapel();
  const refAtual = referenciaAtual();
  
  const [mesAno, setMesAno] = useState<string>(refAtual);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas");
  const [altoContraste, setAltoContraste] = useState(false);

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

  const { congregacoes, obreiros, pagamentos } = dados.data ?? {
    congregacoes: [],
    obreiros: [],
    pagamentos: [],
  };

  // Filtragem por categoria e período
  const congregacoesFiltradas = useMemo(() => {
    return categoriaFiltro === "Todas"
      ? congregacoes
      : congregacoes.filter((c) => c.categoria === categoriaFiltro);
  }, [congregacoes, categoriaFiltro]);

  const obreirosFiltrados = useMemo(() => {
    const idsCongs = new Set(congregacoesFiltradas.map((c) => c.id));
    return obreiros.filter((o) => o.congregacao_id && idsCongs.has(o.congregacao_id));
  }, [obreiros, congregacoesFiltradas]);

  const pagamentosDoMes = useMemo(() => {
    const idsObreiros = new Set(obreirosFiltrados.map((o) => o.id));
    return pagamentos.filter(
      (p) => p.referencia === mesAno && idsObreiros.has(p.obreiro_id)
    );
  }, [pagamentos, mesAno, obreirosFiltrados]);

  const obreirosInadimplentes = useMemo(() => {
    const idsPagos = new Set(
      pagamentosDoMes.filter((p) => p.status === "pago").map((p) => p.obreiro_id)
    );
    return obreirosFiltrados.filter((o) => !idsPagos.has(o.id));
  }, [obreirosFiltrados, pagamentosDoMes]);

  const resumo = useMemo(() => {
    return resumoPorCategoria(mesAno, congregacoes, obreiros, pagamentos, (o) => {
      const c = congregacoes.find((c) => c.id === o.congregacao_id);
      if (!c) return 0;
      switch (c.categoria) {
        case "Ouro":
          return 60;
        case "Prata":
          return 50;
        case "Bronze":
          return 40;
        default:
          return 0;
      }
    }).filter((r) => categoriaFiltro === "Todas" || r.categoria === categoriaFiltro);
  }, [mesAno, congregacoes, obreiros, pagamentos, categoriaFiltro]);

  const totalArrecadado = resumo.reduce((acc, r) => acc + r.arrecadado, 0);
  const totalPrevisto = resumo.reduce((acc, r) => acc + r.previsto, 0);
  const adimplenciaMedia = totalPrevisto > 0 ? (totalArrecadado / totalPrevisto) * 100 : 0;

  // Paleta de cores institucional e modo alto contraste
  const colors = altoContraste
    ? {
        primary: "#000000",
        secondary: "#444444",
        alert: "#E60000",
        success: "#008A00",
        background: "#FFFFFF",
        text: "#000000",
      }
    : {
        primary: "#743621",
        secondary: "#E2B185",
        alert: "#B72A2A",
        success: "#2E8B57",
        background: "#F9F8F3",
        text: "#333333",
      };

  const pieData = resumo.map((r) => ({ name: r.categoria, value: r.arrecadado }));
  const PIE_COLORS = altoContraste ? ["#000", "#444", "#777"] : ["#E2B185", "#A64A2F", "#522617"];

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

  const exportarRelatorio = () => {
    gerarRelatorioMensalPDF(mesAno, resumo);
  };

  return (
    <PortalShell
      titulo="Painel de Controle Institucional"
      acoes={
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-1.5 rounded-sm">
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
              Referência:
            </span>
            <input
              type="month"
              value={mesAno.replace("/", "-").split("-").reverse().join("-")}
              onChange={(e) => {
                const parts = e.target.value.split("-");
                if (parts.length === 2) setMesAno(`${parts[1]}/${parts[0]}`);
              }}
              className="bg-transparent text-sm font-mono outline-none text-foreground"
            />
          </div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="border border-border bg-surface px-3 py-2 text-sm uppercase tracking-wider font-semibold rounded-sm outline-none focus:border-primary"
          >
            <option value="Todas">Todas as Categorias</option>
            <option value="Bronze">Congregações Bronze</option>
            <option value="Prata">Congregações Prata</option>
            <option value="Ouro">Congregações Ouro</option>
          </select>
          <button
            onClick={exportarRelatorio}
            className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors rounded-sm"
          >
            <Download size={16} /> Relatório PDF
          </button>
          <button
            onClick={() => setAltoContraste(!altoContraste)}
            className="inline-flex items-center gap-2 bg-surface border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary/20 transition-colors rounded-sm"
          >
            <Eye size={16} /> Contraste
          </button>
        </div>
      }
    >
      {/* Cartões de resumo */}
      <div className="grid gap-6 md:grid-cols-3 mb-6" style={{ color: colors.text }}>
        <div className="plate flex flex-col p-6" style={{ backgroundColor: colors.background }}>
          <p className="label-registro">TOTAL ARRECADADO</p>
          <div className="mt-2 text-4xl font-display font-medium" style={{ color: colors.primary }}>
            {dados.isPending ? "..." : brl(totalArrecadado)}
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
            de <strong className="text-foreground">{brl(totalPrevisto)}</strong> previsto
          </p>
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/50">
            <span className="text-sm font-semibold">Adimplência Geral</span>
            <span
              className={`px-2 py-1 text-xs font-bold ${adimplenciaMedia >= 80 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {adimplenciaMedia.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="plate flex flex-col p-6" style={{ backgroundColor: colors.background }}>
          <p className="label-registro">CONGREGAÇÕES ATIVAS</p>
          <div className="mt-2 text-4xl font-display font-medium" style={{ color: colors.primary }}>
            {dados.isPending ? "..." : congregacoesFiltradas.length}
          </div>
          {categoriaFiltro === "Todas" && (
            <p className="mt-2 text-xs text-muted-foreground flex gap-3 flex-wrap">
              <span>{congregacoesFiltradas.filter((c) => c.categoria === "Bronze").length} Bronze</span>
              <span>{congregacoesFiltradas.filter((c) => c.categoria === "Prata").length} Prata</span>
              <span>{congregacoesFiltradas.filter((c) => c.categoria === "Ouro").length} Ouro</span>
            </p>
          )}
          <div className="mt-auto pt-6 border-t border-border/50">
            <Link to="/congregacoes" className="text-sm font-semibold hover:underline flex items-center gap-2">
              <Briefcase size={16} /> Gerenciar
            </Link>
          </div>
        </div>
        <div className="plate flex flex-col p-6" style={{ backgroundColor: colors.background }}>
          <p className="label-registro text-red-700 font-bold flex items-center gap-2">
            <AlertTriangle size={16} /> INADIMPLENTES DO MÊS
          </p>
          <div className="mt-2 text-4xl font-display font-medium" style={{ color: colors.alert }}>
            {dados.isPending ? "..." : obreirosInadimplentes.length}
          </div>
          <p className="mt-2 text-xs uppercase text-red-700/80">
            obreiros pendentes em {mesAno}
          </p>
          <div className="mt-auto pt-6 border-t border-red-200">
            <Link to="/pagamentos" className="text-sm font-bold text-red-700 hover:underline flex items-center gap-2">
              Regularizar Pendências
            </Link>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <section className="plate p-6" style={{ backgroundColor: colors.background }}>
          <h4 className="text-sm font-semibold uppercase tracking-widest" style={{ color: colors.text }}>
            Arrecadação por Categoria
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resumo} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="categoria" tick={{ fill: colors.text, fontSize: 12 }} />
              <YAxis tick={{ fill: colors.text, fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
                formatter={(v) => brl(v as number)}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="arrecadado" name="Arrecadado" fill={colors.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="previsto" name="Previsto (Meta)" fill={colors.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="plate p-6" style={{ backgroundColor: colors.background }}>
          <h4 className="text-sm font-semibold uppercase tracking-widest" style={{ color: colors.text }}>
            Distribuição Arrecadatória
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => brl(v as number)}
                contentStyle={{ backgroundColor: colors.background, borderColor: colors.primary, color: colors.text }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="square" />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Lista de inadimplentes */}
      <section className="border border-border bg-surface mb-6">
        <div className="border-b border-border px-6 py-4 flex items-center gap-2 text-red-600 bg-red-50/50">
          <AlertTriangle size={18} />
          <h4 className="text-sm font-bold uppercase tracking-widest">
            Atenção: Obreiros Inadimplentes ({mesAno})
          </h4>
        </div>
        <div className="overflow-x-auto">
          {obreirosInadimplentes.length === 0 ? (
            <div className="p-8 text-center text-sm text-green-700 bg-green-50 flex flex-col items-center gap-2">
              <CheckCircle size={32} />
              <p>Nenhuma inadimplência detectada no período selecionado.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-secondary/30 text-xs text-muted-foreground uppercase tracking-widest">
                  <Th>Obreiro</Th>
                  <Th>Congregação</Th>
                  <Th>Registro Ministerial</Th>
                  <Th>Ação Direta</Th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {obreirosInadimplentes.map((o) => {
                  const c = congregacoes.find((c) => c.id === o.congregacao_id);
                  return (
                    <tr key={o.id} className="transition-colors hover:bg-secondary/50 border-b border-border/50">
                      <Td className="font-medium flex items-center gap-2">
                        <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                        {o.nome}
                      </Td>
                      <Td>{c?.nome ?? "Não Vinculada"}</Td>
                      <Td className="font-mono text-[11px] text-muted-foreground">{o.registro}</Td>
                      <Td>
                        <Link
                          to="/pagamentos"
                          search={{ obreiroId: o.id }}
                          className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-200 transition-colors"
                        >
                          Lançar Pagamento
                        </Link>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Últimas contribuições */}
      <section className="border border-border bg-surface">
        <div className="border-b border-border px-6 py-4 flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <h4 className="text-sm font-semibold uppercase tracking-widest">
            Últimas contribuições registradas
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary/30">
                <Th>Obreiro</Th>
                <Th>Referência</Th>
                <Th>Data</Th>
                <Th>Valor</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pagamentos.slice(0, 10).map((p) => {
                const obreiro = obreiros.find((o) => o.id === p.obreiro_id);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-secondary/50">
                    <Td className="font-medium">{obreiro?.nome ?? "—"}</Td>
                    <Td className="font-mono text-[11px]">{p.referencia}</Td>
                    <Td className="text-muted-foreground">{dataBR(p.data)}</Td>
                    <Td>{brl(Number(p.valor))}</Td>
                    <Td>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${statusClasses(p.status)}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="label-registro border-b border-border px-6 py-3 font-normal text-xs">{children}</th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border/60 px-6 py-4 ${className}`}>{children}</td>;
}
