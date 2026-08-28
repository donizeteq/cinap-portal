import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Notificacao } from "@/lib/cinap-alertas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function useNotificacoes(limite = 30) {
  return useQuery({
    queryKey: ["notificacoes", limite],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .not("situacao", "in", "(rascunho,cancelado,agendado,aprovado)")
        .order("created_at", { ascending: false })
        .limit(limite);
      if (error) throw error;
      return (data ?? []) as unknown as Notificacao[];
    },
    refetchInterval: 120_000,
  });
}

export function SinoNotificacoes() {
  const [aberto, setAberto] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useNotificacoes();
  const lista = data ?? [];
  const naoLidas = lista.filter((n) => !n.lida);

  const marcar = useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length === 0) return;
      const { error } = await supabase.from("notificacoes").update({ lida: true }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
  });

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notificações (${naoLidas.length} não lidas)`}
          className="relative border border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Avisos
          {naoLidas.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-primary px-1 font-mono text-[10px] text-primary-foreground">
              {naoLidas.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 rounded-none border-border p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="label-registro">Notificações</p>
          {naoLidas.length > 0 && (
            <button
              type="button"
              onClick={() => marcar.mutate(naoLidas.map((n) => n.id))}
              className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Marcar lidas
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {lista.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum aviso registrado.</p>
          )}
          {lista.map((n) => (
            <div
              key={n.id}
              className={`border-b border-border px-4 py-3 ${n.lida ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{n.titulo}</p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {n.tipo === "vencimento" ? "Vencimento" : `${n.meses_atraso}m atraso`}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{n.mensagem}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
