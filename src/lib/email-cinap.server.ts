import type { ConfigAlertas } from "@/lib/cinap-alertas";

const NAVAL = "#0F2240";
const DOURADO = "#D9A74A";
const AZUL_MEDIO = "#1A3A5C";

export interface DadosEmailAviso {
  titulo: string;
  saudacao: string;
  paragrafos: string[];
  referencia: string;
  valor?: string;
  rodape?: string;
}

function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Template institucional CINAP em HTML puro (compatível com clientes de e-mail). */
export function montarEmailAviso(config: ConfigAlertas, d: DadosEmailAviso) {
  const linhas = d.paragrafos
    .map(
      (p) =>
        `<p style="margin:0 0 14px 0;font-size:14px;line-height:22px;color:${NAVAL};">${escapar(p)}</p>`,
    )
    .join("");

  const bloco = d.valor
    ? `<table role="presentation" width="100%" style="border-collapse:collapse;margin:18px 0;">
        <tr>
          <td style="border:1px solid ${DOURADO};padding:14px 16px;background:#FBF7EF;">
            <span style="display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${AZUL_MEDIO};">Competência ${escapar(d.referencia)}</span>
            <span style="display:block;margin-top:6px;font-size:20px;font-weight:700;color:${NAVAL};">${escapar(d.valor)}</span>
          </td>
        </tr>
      </table>`
    : "";

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" style="border-collapse:collapse;background:#ffffff;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" style="width:600px;max-width:100%;border-collapse:collapse;border:1px solid ${NAVAL};">
        <tr><td style="background:${NAVAL};padding:20px 24px;">
          <span style="display:block;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${DOURADO};">CINAP</span>
          <span style="display:block;margin-top:4px;font-size:13px;letter-spacing:1px;color:#ffffff;">Convenção das Igrejas Nacionais Autônomas</span>
        </td></tr>
        <tr><td style="padding:26px 24px;">
          <h1 style="margin:0 0 6px 0;font-size:20px;font-weight:600;color:${NAVAL};">${escapar(d.titulo)}</h1>
          <p style="margin:0 0 18px 0;font-size:13px;color:${AZUL_MEDIO};">${escapar(d.saudacao)}</p>
          ${linhas}
          ${bloco}
          <p style="margin:22px 0 0 0;font-size:12px;line-height:20px;color:${AZUL_MEDIO};">${escapar(d.rodape ?? "Em caso de dúvida, procure a tesouraria da sua congregação.")}</p>
        </td></tr>
        <tr><td style="border-top:1px solid ${DOURADO};padding:16px 24px;background:#F8FAFC;">
          <span style="display:block;font-size:11px;color:${AZUL_MEDIO};">${escapar(config.remetente_nome)}</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `CINAP — ${d.titulo}`,
    "",
    d.saudacao,
    "",
    ...d.paragrafos,
    d.valor ? `\nCompetência ${d.referencia}: ${d.valor}` : "",
    "",
    config.remetente_nome,
  ].join("\n");

  return { html, text };
}

export interface ResultadoEnvio {
  enviado: boolean;
  erro: string | null;
  message_id: string | null;
  em: string;
}

/** Envio real via infraestrutura gerenciada de e-mail. */
export async function enviarEmailCinap(
  config: ConfigAlertas,
  para: string,
  assunto: string,
  conteudo: { html: string; text: string },
  idempotencyKey?: string,
): Promise<ResultadoEnvio> {
  const em = new Date().toISOString();
  if (!config.emails_ativos) {
    return { enviado: false, erro: "Alertas por e-mail desativados na configuração.", message_id: null, em };
  }
  if (!config.remetente_email || !config.dominio_email) {
    return { enviado: false, erro: "Remetente/domínio de e-mail não configurado.", message_id: null, em };
  }
  const apiKey = process.env["CINAP_EMAIL_API_KEY"];
  const apiUrl = process.env["CINAP_EMAIL_API_URL"];
  if (!apiKey || !apiUrl) {
    return { enviado: false, erro: "Chave de API de e-mail indisponível no servidor.", message_id: null, em };
  }

  try {
    const resposta = await fetch(apiUrl, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        to: para,
        from: `${config.remetente_nome} <${config.remetente_email}>`,
        sender_domain: config.dominio_email,
        subject: assunto,
        html: conteudo.html,
        text: conteudo.text,
        purpose: "transactional",
        ...(config.copia_admin ? { reply_to: config.copia_admin } : {}),
        ...(idempotencyKey ? { idempotency_key: idempotencyKey } : {}),
      }),
    });
    const r = (await resposta.json().catch(() => ({}))) as { message_id?: string; status?: string };
    return {
      enviado: resposta.ok,
      erro: resposta.ok ? null : (r.status ?? "Envio recusado pelo provedor."),
      message_id: r.message_id ?? null,
      em: new Date().toISOString(),
    };
  } catch (erro) {
    return {
      enviado: false,
      erro: erro instanceof Error ? erro.message : "Falha desconhecida no envio.",
      message_id: null,
      em: new Date().toISOString(),
    };
  }
}
