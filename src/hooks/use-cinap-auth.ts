import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export function useSessao() {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSession(s);
      setCarregando(false);
    });
    void supabase.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setCarregando(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return { session, carregando };
}

export function usePapel() {
  const { session, carregando } = useSessao();
  const userId = session?.user.id;

  const query = useQuery({
    queryKey: ["papel", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      if (error) throw error;
      return data.map((r) => r.role as string);
    },
  });

  const papeis = query.data ?? [];
  return {
    session,
    userId,
    papeis,
    isAdmin: papeis.includes("admin"),
    carregando: carregando || query.isLoading,
  };
}
