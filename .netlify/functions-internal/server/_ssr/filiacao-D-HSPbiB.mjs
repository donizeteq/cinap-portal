import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as brl } from "./cinap-PoyC-pfo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/filiacao-D-HSPbiB.js
var import_jsx_runtime = require_jsx_runtime();
var PIX_CHAVE = "64780590000103";
var PIX_TITULAR = "CINAP Convenção das Igrejas Nacionais Autônomas e Parceiras";
var PIX_OBSERVACAO = "Enviar o comprovante de pagamento.";
var DOCUMENTOS_OBRIGATORIOS = [
	{
		titulo: "Requerimento assinado",
		detalhe: "Foto da ficha de cadastro de obreiro devidamente assinada."
	},
	{
		titulo: "RG",
		detalhe: "Foto da frente e do verso do documento."
	},
	{
		titulo: "CPF",
		detalhe: "Foto do documento ou do comprovante de inscrição."
	},
	{
		titulo: "Comprovante de residência",
		detalhe: "Emitido nos últimos 90 dias, em nome do obreiro ou familiar."
	}
];
var OBSERVACAO_DOCUMENTOS = "Todas as fotos devem estar nítidas, legíveis e sem cortes nas bordas.";
function Filiacao() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-none",
							children: "CINAP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-registro mt-1",
							children: "Secretaria Geral"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground",
						children: "Acessar portal"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-5xl px-6 py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-registro",
						children: "Instrução normativa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl",
						children: "Filiação de obreiro: pagamento e documentação"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-muted-foreground",
						children: "O processo de cadastro no quadro de obreiros da Convenção é concluído em duas etapas: o recolhimento das taxas de inscrição e credencial, e o envio da documentação obrigatória à Secretaria Geral."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-registro",
							children: "1 — Forma de pagamento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-6 divide-y divide-border border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
									rotulo: "Taxa de inscrição",
									valor: brl(50)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
									rotulo: "Credencial",
									valor: brl(20)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
									rotulo: "Total",
									valor: brl(70),
									destaque: true
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 border border-border p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-registro",
									children: "Chave PIX (CNPJ)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 select-all font-mono text-lg tracking-wider",
									children: PIX_CHAVE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 label-registro",
									children: "Conta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: PIX_TITULAR
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 border-l-2 border-primary pl-4 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Observação:"
								}),
								" ",
								PIX_OBSERVACAO
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-registro",
							children: "2 — Dos documentos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-6 space-y-4",
							children: DOCUMENTOS_OBRIGATORIOS.map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-4 border border-border p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-primary",
									children: String(i + 1).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-semibold",
									children: doc.titulo
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-xs text-muted-foreground",
									children: doc.detalhe
								})] })]
							}, doc.titulo))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 border-l-2 border-primary pl-4 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Observação:"
								}),
								" ",
								OBSERVACAO_DOCUMENTOS
							]
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-5xl px-6 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-sm text-muted-foreground",
					children: "Após a confirmação do pagamento e a conferência dos documentos, a Secretaria Geral efetua o registro do obreiro e libera a credencial ministerial digital, com QR Code de validação pública, na área exclusiva do obreiro."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-primary-foreground",
						children: "Área do obreiro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "border border-border px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary",
						children: "Voltar ao início"
					})]
				})]
			})
		]
	});
}
function Linha({ rotulo, valor, destaque = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] uppercase tracking-widest text-muted-foreground",
			children: rotulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: destaque ? "font-display text-2xl text-primary" : "font-mono text-sm",
			children: valor
		})]
	});
}
//#endregion
export { Filiacao as component };
