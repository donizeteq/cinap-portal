import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/PortalShell";
import { usePapel } from "@/hooks/use-cinap-auth";
import { CONFIG_PADRAO, type ConfigAlertas, type Notificacao } from "@/lib/cinap-alertas";
import { baixarCSV } from "@/lib/cinap-csv";
import { baixarPlanilha } from "@/lib/cinap-planilha";
import { brl } from "@/lib/cinap";
import {
  decidirAvisos,
  despacharAvisos,
  enviarEmailTeste,
  executarAlertasAgora,
  gerarPreviaAvisos,
  salvarConfigAlertas,
} from "@/lib/alertas.functions";


export const Route = createFileRoute("/_authenticated/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas e Avisos | CINAP" },
      {
        name: "description",
        content:
          "Configuração do remetente de e-mail, prazo de vencimento e intervalo de cobrança dos obreiros inadimplentes da CINAP.",
      },
      { property: "og:title", content: "Alertas e Avisos | CINAP" },
      {
        property: "og:description",
        content: "Central de alertas automáticos de inadimplência da CINAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alertas,
});

function Alertas() {
  const { isAdmin, carregando } = usePapel();
  const queryClient = useQueryClient();
  const salvar = useServerFn(salvarConfigAlertas);
  const executar = useServerFn(executarAlertasAgora);
  const testar = useServerFn(enviarEmailTeste);
  const [form, setForm] = useState<ConfigAlertas>(CONFIG_PADRAO);
  const [emailTeste, setEmailTeste] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEnvio, setFiltroEnvio] = useState("todos");
  const [busca, setBusca] = useState("");
  const previa = useServerFn(gerarPreviaAvisos);
  const decidir = useServerFn(decidirAvisos);
  const despachar = useServerFn(despacharAvisos);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [dataAgendada, setDataAgendada] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState("todas");


  const config = useQuery({
    queryKey: ["config-alertas"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_alertas")
        .select("*")
        .eq("id", true)
        .maybeSingle();
      if (error) throw error;
      return { ...CONFIG_PADRAO, ...(data ?? {}) } as unknown as ConfigAlertas;
    },
  });

  const notificacoes = useQuery({
    queryKey: ["notificacoes-admin"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as unknown as Notificacao[];
    },
  });

  useEffect(() => {
    if (config.data) setForm(config.data);
  }, [config.data]);

  const gravar = useMutation({
    mutationFn: async () =>
      await salvar({
        data: {
          remetente_nome: form.remetente_nome,
          remetente_email: form.remetente_email,
          dominio_email: form.dominio_email,
          dia_vencimento: Number(form.dia_vencimento),
          dias_antes_aviso: Number(form.dias_antes_aviso),
          meses_intervalo_atraso: Number(form.meses_intervalo_atraso),
          emails_ativos: form.emails_ativos,
          copia_admin: form.copia_admin,
        },
      }),
    onSuccess: () => {
      toast.success("Configuração de alertas salva");
      queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rodar = useMutation({
    mutationFn: async () => await executar({ data: undefined }),
    onSuccess: (r) => {
      toast.success(
        `Verificação concluída · ${r.vencimento} aviso(s) de vencimento e ${r.atraso} de atraso. ${r.email_status}`,
      );
      queryClient.invalidateQueries({ queryKey: ["notificacoes-admin"] });
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
      queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const teste = useMutation({
    mutationFn: async () => await testar({ data: { destinatario: emailTeste.trim() } }),
    onSuccess: (r) => {
      if (r.enviado) toast.success(`E-mail de teste enviado para ${emailTeste.trim()}`);
      else toast.error(r.erro ?? "Não foi possível enviar o e-mail de teste.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const fila = useMemo(
    () =>
      (notificacoes.data ?? []).filter((n) => {
        const situacao = (n as unknown as { situacao?: string }).situacao ?? "enviado";
        return situacao === "rascunho" || situacao === "aprovado" || situacao === "agendado";
      }),
    [notificacoes.data],
  );

  const recarregarFila = () => {
    setSelecionados([]);
    queryClient.invalidateQueries({ queryKey: ["notificacoes-admin"] });
    queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
  };

  const criarPrevia = useMutation({
    mutationFn: async () =>
      await previa({ data: { agendarPara: dataAgendada ? new Date(dataAgendada).toISOString() : null } }),
    onSuccess: (r) => {
      toast.success(
        `Prévia gerada · ${r.vencimento} aviso(s) de vencimento e ${r.atraso} de atraso aguardando aprovação.`,
      );
      recarregarFila();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const decidirFila = useMutation({
    mutationFn: async (acao: "aprovar" | "agendar" | "cancelar") =>
      await decidir({
        data: {
          ids: selecionados,
          acao,
          agendarPara: dataAgendada ? new Date(dataAgendada).toISOString() : null,
        },
      }),
    onSuccess: () => {
      toast.success("Fila de avisos atualizada.");
      recarregarFila();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const enviarFila = useMutation({
    mutationFn: async () => await despachar({ data: { ids: selecionados } }),
    onSuccess: (r) => {
      toast.success(`${r.enviados} aviso(s) enviado(s), ${r.falhas} falha(s).`);
      recarregarFila();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (notificacoes.data ?? []).filter((n) => {
      if (filtroTipo !== "todos" && n.tipo !== filtroTipo) return false;
      const situacao = (n as unknown as { situacao?: string }).situacao ?? "enviado";
      if (filtroSituacao !== "todas" && situacao !== filtroSituacao) return false;
      if (filtroEnvio === "enviado" && !n.email_enviado) return false;
      if (filtroEnvio === "falha" && (n.email_enviado || (n.tentativas ?? 0) === 0)) return false;
      if (filtroEnvio === "sem-tentativa" && (n.tentativas ?? 0) > 0) return false;
      if (!termo) return true;
      return [n.titulo, n.mensagem, n.referencia, n.destinatario ?? "", n.email_erro ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [notificacoes.data, filtroTipo, filtroSituacao, filtroEnvio, busca]);

  const exportarPlanilha = async (formato: "csv" | "xlsx") => {
    const linhas = linhasExportacao();
    await baixarPlanilha(
      formato,
      `cinap-avisos-${new Date().toISOString().slice(0, 10)}`,
      "Avisos",
      linhas,
    );
  };

  const linhasExportacao = () => {
    const linhas: (string | number)[][] = [
      ["CINAP - Historico de avisos"],
      ["Tipo", filtroTipo],
      ["Situacao de envio", filtroEnvio],
      ["Busca", busca || "-"],
      ["Emitido em", new Date().toLocaleString("pt-BR")],
      [],
      [
        "Gerado em",
        "Tipo",
        "Situacao",
        "Referencia",
        "Meses em atraso",
        "Valor em aberto",
        "Aviso",
        "Destinatario",
        "Tentativas",
        "Status do envio",
        "Enviado em",
        "Ultima tentativa",
        "Erro",
        "ID da mensagem",
      ],
    ];
    for (const n of filtradas) {
      linhas.push([
        new Date(n.created_at).toLocaleString("pt-BR"),
        n.tipo === "vencimento" ? "Vencimento" : (n.tipo as string) === "status" ? "Situacao" : "Atraso",
        (n as unknown as { situacao?: string }).situacao ?? "enviado",
        n.referencia,
        n.meses_atraso,
        Number(n.valor ?? 0),
        n.mensagem,
        n.destinatario ?? "-",
        n.tentativas ?? 0,
        n.email_enviado ? "Enviado" : (n.tentativas ?? 0) > 0 ? "Falha" : "Sem tentativa",
        n.enviado_em ? new Date(n.enviado_em).toLocaleString("pt-BR") : "-",
        n.ultima_tentativa_em ? new Date(n.ultima_tentativa_em).toLocaleString("pt-BR") : "-",
        n.email_erro ?? "-",
        n.message_id ?? "-",
      ]);
    }
    return linhas;
  };

  const exportarCSV = () => {
    baixarCSV(`cinap-avisos-${new Date().toISOString().slice(0, 10)}.csv`, linhasExportacao());
  };


  if (carregando) return null;
  if (!isAdmin) {
    return (
      <PortalShell titulo="Alertas">
        <p className="text-sm text-muted-foreground">Área restrita à Secretaria Geral.</p>
      </PortalShell>
    );
  }

  const campo =
    "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <PortalShell titulo="Alertas de inadimplência">
      <section className="plate p-6">
        <p className="label-registro">Remetente de e-mail</p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Nome do remetente
            <input
              className={campo}
              value={form.remetente_nome}
              onChange={(e) => setForm({ ...form, remetente_nome: e.target.value })}
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            E-mail remetente
            <input
              className={campo}
              placeholder="tesouraria@notify.suaigreja.com.br"
              value={form.remetente_email}
              onChange={(e) => setForm({ ...form, remetente_email: e.target.value })}
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Domínio de envio
            <input
              className={campo}
              placeholder="notify.suaigreja.com.br"
              value={form.dominio_email}
              onChange={(e) => setForm({ ...form, dominio_email: e.target.value })}
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground md:col-span-2">
            Cópia para a secretaria (opcional)
            <input
              className={campo}
              placeholder="secretaria@suaigreja.com.br"
              value={form.copia_admin}
              onChange={(e) => setForm({ ...form, copia_admin: e.target.value })}
            />
          </label>
          <label className="flex items-end gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <input
              type="checkbox"
              checked={form.emails_ativos}
              onChange={(e) => setForm({ ...form, emails_ativos: e.target.checked })}
            />
            Enviar e-mails automaticamente
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-border pt-5">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Enviar e-mail de teste para
            <input
              className={`${campo} md:w-72`}
              placeholder="voce@suaigreja.com.br"
              value={emailTeste}
              onChange={(e) => setEmailTeste(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={() => teste.mutate()}
            disabled={teste.isPending || !emailTeste.trim()}
            className="border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {teste.isPending ? "Enviando..." : "Enviar teste"}
          </button>
          <span className="text-xs text-muted-foreground">
            Usa exatamente o remetente e o domínio salvos acima.
          </span>
        </div>
      </section>


      <section className="plate p-6">
        <p className="label-registro">Regras de cobrança</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Dia do vencimento
            <input
              type="number"
              min={1}
              max={28}
              className={campo}
              value={form.dia_vencimento}
              onChange={(e) => setForm({ ...form, dia_vencimento: Number(e.target.value) })}
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Avisar quantos dias antes
            <input
              type="number"
              min={0}
              max={20}
              className={campo}
              value={form.dias_antes_aviso}
              onChange={(e) => setForm({ ...form, dias_antes_aviso: Number(e.target.value) })}
            />
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Repetir a cada X meses de atraso
            <input
              type="number"
              min={1}
              max={12}
              className={campo}
              value={form.meses_intervalo_atraso}
              onChange={(e) =>
                setForm({ ...form, meses_intervalo_atraso: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => gravar.mutate()}
            disabled={gravar.isPending}
            className="border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
          >
            {gravar.isPending ? "Salvando..." : "Salvar configuração"}
          </button>
          <button
            type="button"
            onClick={() => rodar.mutate()}
            disabled={rodar.isPending}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {rodar.isPending ? "Verificando..." : "Executar verificação agora"}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Última execução:{" "}
            {config.data?.ultima_execucao
              ? new Date(config.data.ultima_execucao).toLocaleString("pt-BR")
              : "nunca"}
          </span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          A verificação também roda automaticamente todos os dias às 9h. Os avisos aparecem no
          painel mesmo quando o envio de e-mail ainda não está liberado.
        </p>
      </section>

      <section className="plate p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-registro">Fila de aprovação</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Gere uma prévia dos avisos sem disparar e-mails, revise a lista, aprove ou agende o
              envio. Nada sai da Secretaria sem aprovação.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="datetime-local"
              value={dataAgendada}
              onChange={(e) => setDataAgendada(e.target.value)}
              className="border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => criarPrevia.mutate()}
              disabled={criarPrevia.isPending}
              className="border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
            >
              {criarPrevia.isPending ? "Gerando..." : "Gerar prévia"}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => decidirFila.mutate("aprovar")}
            disabled={selecionados.length === 0 || decidirFila.isPending}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40"
          >
            Aprovar selecionados
          </button>
          <button
            type="button"
            onClick={() => decidirFila.mutate("agendar")}
            disabled={selecionados.length === 0 || decidirFila.isPending}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40"
          >
            Agendar selecionados
          </button>
          <button
            type="button"
            onClick={() => decidirFila.mutate("cancelar")}
            disabled={selecionados.length === 0 || decidirFila.isPending}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-destructive hover:border-destructive disabled:opacity-40"
          >
            Cancelar selecionados
          </button>
          <button
            type="button"
            onClick={() => enviarFila.mutate()}
            disabled={enviarFila.isPending}
            className="border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary disabled:opacity-40"
          >
            {enviarFila.isPending
              ? "Enviando..."
              : selecionados.length > 0
                ? "Enviar selecionados"
                : "Enviar aprovados"}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {selecionados.length} de {fila.length} selecionado(s)
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="py-2 pr-3">
                  <input
                    type="checkbox"
                    checked={fila.length > 0 && selecionados.length === fila.length}
                    onChange={(e) =>
                      setSelecionados(e.target.checked ? fila.map((n) => n.id) : [])
                    }
                  />
                </th>
                <th className="py-2 pr-4">Situação</th>
                <th className="py-2 pr-4">Aviso</th>
                <th className="py-2 pr-4">Destinatário</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2">Agendado para</th>
              </tr>
            </thead>
            <tbody>
              {fila.map((n) => {
                const extra = n as unknown as { situacao?: string; agendado_para?: string | null };
                return (
                  <tr key={n.id} className="border-b border-border/60 align-top">
                    <td className="py-3 pr-3">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(n.id)}
                        onChange={(e) =>
                          setSelecionados((atual) =>
                            e.target.checked
                              ? [...atual, n.id]
                              : atual.filter((id) => id !== n.id),
                          )
                        }
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="border border-border px-2 py-1 text-[10px] uppercase tracking-widest">
                        {extra.situacao ?? "rascunho"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {n.titulo}
                      <span className="mt-1 block text-xs text-muted-foreground">{n.mensagem}</span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px]">{n.destinatario ?? "—"}</td>
                    <td className="py-3 pr-4 font-mono text-[11px]">{brl(Number(n.valor ?? 0))}</td>
                    <td className="py-3 font-mono text-[11px] text-muted-foreground">
                      {extra.agendado_para
                        ? new Date(extra.agendado_para).toLocaleString("pt-BR")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {fila.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum aviso aguardando aprovação. Gere uma prévia para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="plate p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-registro">Auditoria de avisos</p>
          <button
            type="button"
            onClick={exportarCSV}
            disabled={filtradas.length === 0}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => void exportarPlanilha("xlsx")}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            Exportar XLSX
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Tipo
            <select
              className={campo}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="vencimento">Vencimento</option>
              <option value="atraso">Atraso</option>
            </select>
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Situação do envio
            <select
              className={campo}
              value={filtroEnvio}
              onChange={(e) => setFiltroEnvio(e.target.value)}
            >
              <option value="todos">Todas</option>
              <option value="enviado">Enviados</option>
              <option value="falha">Com falha</option>
              <option value="sem-tentativa">Sem tentativa</option>
            </select>
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Situação do aviso
            <select
              className={campo}
              value={filtroSituacao}
              onChange={(e) => setFiltroSituacao(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="rascunho">Prévia</option>
              <option value="aprovado">Aprovado</option>
              <option value="agendado">Agendado</option>
              <option value="enviado">Enviado</option>
              <option value="falhou">Falhou</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Buscar
            <input
              className={campo}
              placeholder="obreiro, e-mail, referência ou erro"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="py-2 pr-4">Gerado em</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Situação</th>
                <th className="py-2 pr-4">Ref.</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Destinatário</th>
                <th className="py-2 pr-4">Tent.</th>
                <th className="py-2 pr-4">Envio</th>
                <th className="py-2">Detalhe</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((n) => (
                <tr key={n.id} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-4 font-mono text-[11px]">
                    {new Date(n.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 pr-4">
                    {n.tipo === "vencimento"
                      ? "Vencimento"
                      : (n.tipo as string) === "status"
                        ? "Situação"
                        : `Atraso ${n.meses_atraso}m`}
                  </td>
                  <td className="py-2 pr-4">
                    <SituacaoAviso notificacao={n} />
                  </td>
                  <td className="py-2 pr-4 font-mono text-[11px]">{n.referencia}</td>
                  <td className="py-2 pr-4 font-mono text-[11px]">{brl(Number(n.valor ?? 0))}</td>
                  <td className="py-2 pr-4 text-xs">{n.destinatario ?? "—"}</td>
                  <td className="py-2 pr-4 font-mono text-[11px]">{n.tentativas ?? 0}</td>
                  <td className="py-2 pr-4 text-xs">
                    {n.email_enviado ? (
                      <span className="text-primary">Enviado</span>
                    ) : (n.tentativas ?? 0) > 0 ? (
                      <span className="text-destructive">Falha</span>
                    ) : (
                      <span className="text-muted-foreground">Sem tentativa</span>
                    )}
                    <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                      {n.enviado_em
                        ? new Date(n.enviado_em).toLocaleString("pt-BR")
                        : n.ultima_tentativa_em
                          ? new Date(n.ultima_tentativa_em).toLocaleString("pt-BR")
                          : "—"}
                    </span>
                  </td>
                  <td className="py-2 text-xs text-muted-foreground">
                    {n.email_erro ?? n.mensagem}
                    {n.message_id && (
                      <span className="mt-1 block font-mono text-[10px]">id {n.message_id}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-sm text-muted-foreground">
                    Nenhum aviso encontrado para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </PortalShell>
  );
}

const SITUACAO_ROTULO: Record<string, string> = {
  rascunho: "Prévia",
  aprovado: "Aprovado",
  agendado: "Agendado",
  enviado: "Enviado",
  falhou: "Falhou",
  cancelado: "Cancelado",
};

function SituacaoAviso({ notificacao }: { notificacao: Notificacao }) {
  const extra = notificacao as unknown as {
    situacao?: string;
    agendado_para?: string | null;
    aprovado_em?: string | null;
  };
  const situacao = extra.situacao ?? "enviado";
  const cor =
    situacao === "enviado"
      ? "border-primary text-primary"
      : situacao === "falhou" || situacao === "cancelado"
        ? "border-destructive text-destructive"
        : "border-border text-muted-foreground";
  const carimbo =
    situacao === "enviado"
      ? notificacao.enviado_em
      : situacao === "agendado"
        ? extra.agendado_para
        : situacao === "aprovado"
          ? extra.aprovado_em
          : situacao === "falhou"
            ? notificacao.ultima_tentativa_em
            : notificacao.created_at;

  return (
    <span className="block">
      <span className={`inline-block border px-2 py-1 text-[10px] uppercase tracking-widest ${cor}`}>
        {SITUACAO_ROTULO[situacao] ?? situacao}
      </span>
      <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
        {carimbo ? new Date(carimbo).toLocaleString("pt-BR") : "—"}
      </span>
      {situacao === "falhou" && notificacao.email_erro && (
        <span className="mt-1 block max-w-[180px] text-[10px] text-destructive">
          {notificacao.email_erro}
        </span>
      )}
    </span>
  );
}
