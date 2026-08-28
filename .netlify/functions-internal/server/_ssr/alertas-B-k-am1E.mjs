import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as brl } from "./cinap-PoyC-pfo.mjs";
import { t as supabase } from "./client-BL_cnqCh.mjs";
import { n as usePapel, t as PortalShell } from "./PortalShell-gvUxf2hG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { CONFIG_PADRAO } from "./cinap-alertas-DsjZy6q1.mjs";
import { n as baixarPlanilha, t as baixarCSV } from "./cinap-planilha-CvVruSKt.mjs";
import { a as executarAlertasAgora, i as enviarEmailTeste, o as gerarPreviaAvisos, r as despacharAvisos, t as decidirAvisos, u as salvarConfigAlertas } from "./alertas.functions-DtO_z1x5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alertas-B-k-am1E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Alertas() {
	const { isAdmin, carregando } = usePapel();
	const queryClient = useQueryClient();
	const salvar = useServerFn(salvarConfigAlertas);
	const executar = useServerFn(executarAlertasAgora);
	const testar = useServerFn(enviarEmailTeste);
	const [form, setForm] = (0, import_react.useState)(CONFIG_PADRAO);
	const [emailTeste, setEmailTeste] = (0, import_react.useState)("");
	const [filtroTipo, setFiltroTipo] = (0, import_react.useState)("todos");
	const [filtroEnvio, setFiltroEnvio] = (0, import_react.useState)("todos");
	const [busca, setBusca] = (0, import_react.useState)("");
	const previa = useServerFn(gerarPreviaAvisos);
	const decidir = useServerFn(decidirAvisos);
	const despachar = useServerFn(despacharAvisos);
	const [selecionados, setSelecionados] = (0, import_react.useState)([]);
	const [dataAgendada, setDataAgendada] = (0, import_react.useState)("");
	const [filtroSituacao, setFiltroSituacao] = (0, import_react.useState)("todas");
	const config = useQuery({
		queryKey: ["config-alertas"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("config_alertas").select("*").eq("id", true).maybeSingle();
			if (error) throw error;
			return {
				...CONFIG_PADRAO,
				...data ?? {}
			};
		}
	});
	const notificacoes = useQuery({
		queryKey: ["notificacoes-admin"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("notificacoes").select("*").order("created_at", { ascending: false }).limit(100);
			if (error) throw error;
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (config.data) setForm(config.data);
	}, [config.data]);
	const gravar = useMutation({
		mutationFn: async () => await salvar({ data: {
			remetente_nome: form.remetente_nome,
			remetente_email: form.remetente_email,
			dominio_email: form.dominio_email,
			dia_vencimento: Number(form.dia_vencimento),
			dias_antes_aviso: Number(form.dias_antes_aviso),
			meses_intervalo_atraso: Number(form.meses_intervalo_atraso),
			emails_ativos: form.emails_ativos,
			copia_admin: form.copia_admin
		} }),
		onSuccess: () => {
			toast.success("Configuração de alertas salva");
			queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const rodar = useMutation({
		mutationFn: async () => await executar({ data: void 0 }),
		onSuccess: (r) => {
			toast.success(`Verificação concluída · ${r.vencimento} aviso(s) de vencimento e ${r.atraso} de atraso. ${r.email_status}`);
			queryClient.invalidateQueries({ queryKey: ["notificacoes-admin"] });
			queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
			queryClient.invalidateQueries({ queryKey: ["config-alertas"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const teste = useMutation({
		mutationFn: async () => await testar({ data: { destinatario: emailTeste.trim() } }),
		onSuccess: (r) => {
			if (r.enviado) toast.success(`E-mail de teste enviado para ${emailTeste.trim()}`);
			else toast.error(r.erro ?? "Não foi possível enviar o e-mail de teste.");
		},
		onError: (e) => toast.error(e.message)
	});
	const fila = (0, import_react.useMemo)(() => (notificacoes.data ?? []).filter((n) => {
		const situacao = n.situacao ?? "enviado";
		return situacao === "rascunho" || situacao === "aprovado" || situacao === "agendado";
	}), [notificacoes.data]);
	const recarregarFila = () => {
		setSelecionados([]);
		queryClient.invalidateQueries({ queryKey: ["notificacoes-admin"] });
		queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
	};
	const criarPrevia = useMutation({
		mutationFn: async () => await previa({ data: { agendarPara: dataAgendada ? new Date(dataAgendada).toISOString() : null } }),
		onSuccess: (r) => {
			toast.success(`Prévia gerada · ${r.vencimento} aviso(s) de vencimento e ${r.atraso} de atraso aguardando aprovação.`);
			recarregarFila();
		},
		onError: (e) => toast.error(e.message)
	});
	const decidirFila = useMutation({
		mutationFn: async (acao) => await decidir({ data: {
			ids: selecionados,
			acao,
			agendarPara: dataAgendada ? new Date(dataAgendada).toISOString() : null
		} }),
		onSuccess: () => {
			toast.success("Fila de avisos atualizada.");
			recarregarFila();
		},
		onError: (e) => toast.error(e.message)
	});
	const enviarFila = useMutation({
		mutationFn: async () => await despachar({ data: { ids: selecionados } }),
		onSuccess: (r) => {
			toast.success(`${r.enviados} aviso(s) enviado(s), ${r.falhas} falha(s).`);
			recarregarFila();
		},
		onError: (e) => toast.error(e.message)
	});
	const filtradas = (0, import_react.useMemo)(() => {
		const termo = busca.trim().toLowerCase();
		return (notificacoes.data ?? []).filter((n) => {
			if (filtroTipo !== "todos" && n.tipo !== filtroTipo) return false;
			const situacao = n.situacao ?? "enviado";
			if (filtroSituacao !== "todas" && situacao !== filtroSituacao) return false;
			if (filtroEnvio === "enviado" && !n.email_enviado) return false;
			if (filtroEnvio === "falha" && (n.email_enviado || (n.tentativas ?? 0) === 0)) return false;
			if (filtroEnvio === "sem-tentativa" && (n.tentativas ?? 0) > 0) return false;
			if (!termo) return true;
			return [
				n.titulo,
				n.mensagem,
				n.referencia,
				n.destinatario ?? "",
				n.email_erro ?? ""
			].join(" ").toLowerCase().includes(termo);
		});
	}, [
		notificacoes.data,
		filtroTipo,
		filtroSituacao,
		filtroEnvio,
		busca
	]);
	const exportarPlanilha = async (formato) => {
		const linhas = linhasExportacao();
		await baixarPlanilha(formato, `cinap-avisos-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`, "Avisos", linhas);
	};
	const linhasExportacao = () => {
		const linhas = [
			["CINAP - Historico de avisos"],
			["Tipo", filtroTipo],
			["Situacao de envio", filtroEnvio],
			["Busca", busca || "-"],
			["Emitido em", (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")],
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
				"ID da mensagem"
			]
		];
		for (const n of filtradas) linhas.push([
			new Date(n.created_at).toLocaleString("pt-BR"),
			n.tipo === "vencimento" ? "Vencimento" : n.tipo === "status" ? "Situacao" : "Atraso",
			n.situacao ?? "enviado",
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
			n.message_id ?? "-"
		]);
		return linhas;
	};
	const exportarCSV = () => {
		baixarCSV(`cinap-avisos-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, linhasExportacao());
	};
	if (carregando) return null;
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		titulo: "Alertas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Área restrita à Secretaria Geral."
		})
	});
	const campo = "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		titulo: "Alertas de inadimplência",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plate p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Remetente de e-mail"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Nome do remetente", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: campo,
									value: form.remetente_nome,
									onChange: (e) => setForm({
										...form,
										remetente_nome: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["E-mail remetente", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: campo,
									placeholder: "tesouraria@notify.suaigreja.com.br",
									value: form.remetente_email,
									onChange: (e) => setForm({
										...form,
										remetente_email: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Domínio de envio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: campo,
									placeholder: "notify.suaigreja.com.br",
									value: form.dominio_email,
									onChange: (e) => setForm({
										...form,
										dominio_email: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground md:col-span-2",
								children: ["Cópia para a secretaria (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: campo,
									placeholder: "secretaria@suaigreja.com.br",
									value: form.copia_admin,
									onChange: (e) => setForm({
										...form,
										copia_admin: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-end gap-2 text-[11px] uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.emails_ativos,
									onChange: (e) => setForm({
										...form,
										emails_ativos: e.target.checked
									})
								}), "Enviar e-mails automaticamente"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-end gap-3 border-t border-border pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Enviar e-mail de teste para", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${campo} md:w-72`,
									placeholder: "voce@suaigreja.com.br",
									value: emailTeste,
									onChange: (e) => setEmailTeste(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => teste.mutate(),
								disabled: teste.isPending || !emailTeste.trim(),
								className: "border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50",
								children: teste.isPending ? "Enviando..." : "Enviar teste"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Usa exatamente o remetente e o domínio salvos acima."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plate p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Regras de cobrança"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Dia do vencimento", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 28,
									className: campo,
									value: form.dia_vencimento,
									onChange: (e) => setForm({
										...form,
										dia_vencimento: Number(e.target.value)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Avisar quantos dias antes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 20,
									className: campo,
									value: form.dias_antes_aviso,
									onChange: (e) => setForm({
										...form,
										dias_antes_aviso: Number(e.target.value)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Repetir a cada X meses de atraso", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 12,
									className: campo,
									value: form.meses_intervalo_atraso,
									onChange: (e) => setForm({
										...form,
										meses_intervalo_atraso: Number(e.target.value)
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => gravar.mutate(),
								disabled: gravar.isPending,
								className: "border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50",
								children: gravar.isPending ? "Salvando..." : "Salvar configuração"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => rodar.mutate(),
								disabled: rodar.isPending,
								className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50",
								children: rodar.isPending ? "Verificando..." : "Executar verificação agora"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [
									"Última execução:",
									" ",
									config.data?.ultima_execucao ? new Date(config.data.ultima_execucao).toLocaleString("pt-BR") : "nunca"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "A verificação também roda automaticamente todos os dias às 9h. Os avisos aparecem no painel mesmo quando o envio de e-mail ainda não está liberado."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plate p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-registro",
							children: "Fila de aprovação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm text-muted-foreground",
							children: "Gere uma prévia dos avisos sem disparar e-mails, revise a lista, aprove ou agende o envio. Nada sai da Secretaria sem aprovação."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								value: dataAgendada,
								onChange: (e) => setDataAgendada(e.target.value),
								className: "border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => criarPrevia.mutate(),
								disabled: criarPrevia.isPending,
								className: "border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50",
								children: criarPrevia.isPending ? "Gerando..." : "Gerar prévia"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => decidirFila.mutate("aprovar"),
								disabled: selecionados.length === 0 || decidirFila.isPending,
								className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40",
								children: "Aprovar selecionados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => decidirFila.mutate("agendar"),
								disabled: selecionados.length === 0 || decidirFila.isPending,
								className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40",
								children: "Agendar selecionados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => decidirFila.mutate("cancelar"),
								disabled: selecionados.length === 0 || decidirFila.isPending,
								className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-destructive hover:border-destructive disabled:opacity-40",
								children: "Cancelar selecionados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => enviarFila.mutate(),
								disabled: enviarFila.isPending,
								className: "border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary disabled:opacity-40",
								children: enviarFila.isPending ? "Enviando..." : selecionados.length > 0 ? "Enviar selecionados" : "Enviar aprovados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [
									selecionados.length,
									" de ",
									fila.length,
									" selecionado(s)"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: fila.length > 0 && selecionados.length === fila.length,
											onChange: (e) => setSelecionados(e.target.checked ? fila.map((n) => n.id) : [])
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Situação"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Aviso"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Destinatário"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Valor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2",
										children: "Agendado para"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [fila.map((n) => {
								const extra = n;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border/60 align-top",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: selecionados.includes(n.id),
												onChange: (e) => setSelecionados((atual) => e.target.checked ? [...atual, n.id] : atual.filter((id) => id !== n.id))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "border border-border px-2 py-1 text-[10px] uppercase tracking-widest",
												children: extra.situacao ?? "rascunho"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 pr-4",
											children: [n.titulo, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-xs text-muted-foreground",
												children: n.mensagem
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 font-mono text-[11px]",
											children: n.destinatario ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 font-mono text-[11px]",
											children: brl(Number(n.valor ?? 0))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 font-mono text-[11px] text-muted-foreground",
											children: extra.agendado_para ? new Date(extra.agendado_para).toLocaleString("pt-BR") : "—"
										})
									]
								}, n.id);
							}), fila.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Nenhum aviso aguardando aprovação. Gere uma prévia para começar."
							}) })] })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plate p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-registro",
								children: "Auditoria de avisos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: exportarCSV,
								disabled: filtradas.length === 0,
								className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50",
								children: "Exportar CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void exportarPlanilha("xlsx"),
								className: "border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary hover:text-primary",
								children: "Exportar XLSX"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Tipo", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: campo,
									value: filtroTipo,
									onChange: (e) => setFiltroTipo(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "todos",
											children: "Todos"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "vencimento",
											children: "Vencimento"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "atraso",
											children: "Atraso"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Situação do envio", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: campo,
									value: filtroEnvio,
									onChange: (e) => setFiltroEnvio(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "todos",
											children: "Todas"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "enviado",
											children: "Enviados"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "falha",
											children: "Com falha"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sem-tentativa",
											children: "Sem tentativa"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Situação do aviso", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: campo,
									value: filtroSituacao,
									onChange: (e) => setFiltroSituacao(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "todas",
											children: "Todas"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rascunho",
											children: "Prévia"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "aprovado",
											children: "Aprovado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "agendado",
											children: "Agendado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "enviado",
											children: "Enviado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "falhou",
											children: "Falhou"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "cancelado",
											children: "Cancelado"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] uppercase tracking-widest text-muted-foreground",
								children: ["Buscar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: campo,
									placeholder: "obreiro, e-mail, referência ou erro",
									value: busca,
									onChange: (e) => setBusca(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Gerado em"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Tipo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Situação"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Ref."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Valor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Destinatário"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Tent."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-4",
										children: "Envio"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2",
										children: "Detalhe"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtradas.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4 font-mono text-[11px]",
										children: new Date(n.created_at).toLocaleString("pt-BR")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: n.tipo === "vencimento" ? "Vencimento" : n.tipo === "status" ? "Situação" : `Atraso ${n.meses_atraso}m`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SituacaoAviso, { notificacao: n })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4 font-mono text-[11px]",
										children: n.referencia
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4 font-mono text-[11px]",
										children: brl(Number(n.valor ?? 0))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4 text-xs",
										children: n.destinatario ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4 font-mono text-[11px]",
										children: n.tentativas ?? 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-4 text-xs",
										children: [n.email_enviado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "Enviado"
										}) : (n.tentativas ?? 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "Falha"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Sem tentativa"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block font-mono text-[10px] text-muted-foreground",
											children: n.enviado_em ? new Date(n.enviado_em).toLocaleString("pt-BR") : n.ultima_tentativa_em ? new Date(n.ultima_tentativa_em).toLocaleString("pt-BR") : "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 text-xs text-muted-foreground",
										children: [n.email_erro ?? n.mensagem, n.message_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1 block font-mono text-[10px]",
											children: ["id ", n.message_id]
										})]
									})
								]
							}, n.id)), filtradas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 9,
								className: "py-6 text-sm text-muted-foreground",
								children: "Nenhum aviso encontrado para os filtros aplicados."
							}) })] })]
						})
					})
				]
			})
		]
	});
}
var SITUACAO_ROTULO = {
	rascunho: "Prévia",
	aprovado: "Aprovado",
	agendado: "Agendado",
	enviado: "Enviado",
	falhou: "Falhou",
	cancelado: "Cancelado"
};
function SituacaoAviso({ notificacao }) {
	const extra = notificacao;
	const situacao = extra.situacao ?? "enviado";
	const cor = situacao === "enviado" ? "border-primary text-primary" : situacao === "falhou" || situacao === "cancelado" ? "border-destructive text-destructive" : "border-border text-muted-foreground";
	const carimbo = situacao === "enviado" ? notificacao.enviado_em : situacao === "agendado" ? extra.agendado_para : situacao === "aprovado" ? extra.aprovado_em : situacao === "falhou" ? notificacao.ultima_tentativa_em : notificacao.created_at;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `inline-block border px-2 py-1 text-[10px] uppercase tracking-widest ${cor}`,
				children: SITUACAO_ROTULO[situacao] ?? situacao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block font-mono text-[10px] text-muted-foreground",
				children: carimbo ? new Date(carimbo).toLocaleString("pt-BR") : "—"
			}),
			situacao === "falhou" && notificacao.email_erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block max-w-[180px] text-[10px] text-destructive",
				children: notificacao.email_erro
			})
		]
	});
}
//#endregion
export { Alertas as component };
