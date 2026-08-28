import { createServerFn } from "@tanstack/react-start";

export const validarCredencial = createServerFn({ method: "GET" })
  .inputValidator((input: { registro: string }) => {
    const registro = (input?.registro ?? "").trim();
    if (!registro || registro.length > 40) throw new Error("Registro inválido.");
    return { registro };
  })
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "";
    const supabasePublic = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: linhas, error } = await supabasePublic.rpc("validar_credencial", {
      _registro: data.registro,
    });
    if (error) throw new Error("Não foi possível consultar a credencial no momento.");

    const registro = (linhas as unknown[] | null)?.[0] as
      | {
          nome: string;
          cargo: string;
          registro: string;
          congregacao: string;
          cidade: string;
          estado: string;
          validade: string;
          status_pagamento: string;
          valida: boolean;
        }
      | undefined;

    if (!registro) return { encontrada: false as const };
    return { encontrada: true as const, credencial: registro };
  });
