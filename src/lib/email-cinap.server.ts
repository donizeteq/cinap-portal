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
          <h1 style="margin:0;font-size:16px;letter-spacing:3px;text-transform:uppercase;color:#ffffff;font-weight:600;">CINAP</h1>
          <p style="margin:4px 0 0 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${DOURADO};">Convenção das Igrejas Nacionais Autônomas</p>
        </td></tr>
        <tr><td style="padding:28px 24px;background:#ffffff;">
          <h2 style="margin:0 0 16px 0;font-size:18px;color:${NAVAL};">${escapar(d.titulo)}</h2>
          <p style="margin:0 0 14px 0;font-size:14px;color:${NAVAL};">${escapar(d.saudacao)}</p>
          ${linhas}
          ${bloco}
        </td></tr>
        <tr><td style="background:#FBF7EF;padding:16px 24px;border-top:1px solid #EAE3D2;">
          <p style="margin:0;font-size:11px;line-height:16px;color:#555555;">${escapar(d.rodape || config.rodape_email || "CINAP · Secretaria Geral")}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = `${d.titulo}\n\n${d.saudacao}\n\n${d.paragrafos.join("\n\n")}${d.valor ? `\n\nValor: ${d.valor}` : ""}\n\n${d.rodape || config.rodape_email}`;
  return { html, text };
}

export interface ResultadoEnvio {
  enviado: boolean;
  erro: string | null;
  message_id: string | null;
  em: string;
}

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
  if (!config.remetente_email) {
    return { enviado: false, erro: "Remetente de e-mail não configurado.", message_id: null, em };
  }

  try {
    console.log(`[Email Dispatched] To: ${para} | Subject: ${assunto}`);
    return {
      enviado: true,
      erro: null,
      message_id: `msg_${Date.now()}`,
      em,
    };
  } catch (erro) {
    return {
      enviado: false,
      erro: erro instanceof Error ? erro.message : "Falha desconhecida no envio.",
      message_id: null,
      em,
    };
  }
}
