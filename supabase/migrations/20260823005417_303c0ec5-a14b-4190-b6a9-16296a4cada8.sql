DROP POLICY IF EXISTS congregacoes_select ON public.congregacoes;
CREATE POLICY congregacoes_select ON public.congregacoes
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.obreiros o
      WHERE o.user_id = auth.uid() AND o.congregacao_id = congregacoes.id
    )
  );

DROP POLICY IF EXISTS config_alertas_select ON public.config_alertas;
CREATE POLICY config_alertas_select ON public.config_alertas
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));