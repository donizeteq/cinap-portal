
CREATE TABLE public.config_alertas (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  remetente_nome text NOT NULL DEFAULT 'CINAP - Secretaria Geral',
  remetente_email text NOT NULL DEFAULT '',
  dominio_email text NOT NULL DEFAULT '',
  dia_vencimento integer NOT NULL DEFAULT 10 CHECK (dia_vencimento BETWEEN 1 AND 28),
  dias_antes_aviso integer NOT NULL DEFAULT 3 CHECK (dias_antes_aviso BETWEEN 0 AND 20),
  meses_intervalo_atraso integer NOT NULL DEFAULT 1 CHECK (meses_intervalo_atraso BETWEEN 1 AND 12),
  emails_ativos boolean NOT NULL DEFAULT false,
  copia_admin text NOT NULL DEFAULT '',
  ultima_execucao timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.config_alertas TO authenticated;
GRANT ALL ON public.config_alertas TO service_role;
ALTER TABLE public.config_alertas ENABLE ROW LEVEL SECURITY;
CREATE POLICY config_alertas_select ON public.config_alertas FOR SELECT TO authenticated USING (true);
CREATE POLICY config_alertas_admin ON public.config_alertas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.config_alertas TO authenticated;
INSERT INTO public.config_alertas (id) VALUES (true) ON CONFLICT DO NOTHING;

CREATE TABLE public.notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obreiro_id uuid REFERENCES public.obreiros(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'atraso',
  referencia text NOT NULL DEFAULT '',
  meses_atraso integer NOT NULL DEFAULT 0,
  titulo text NOT NULL DEFAULT '',
  mensagem text NOT NULL DEFAULT '',
  email_enviado boolean NOT NULL DEFAULT false,
  email_erro text,
  lida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (obreiro_id, tipo, referencia, meses_atraso)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notificacoes TO authenticated;
GRANT ALL ON public.notificacoes TO service_role;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notificacoes_select ON public.notificacoes FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.obreiros o WHERE o.id = notificacoes.obreiro_id AND o.user_id = auth.uid())
);
CREATE POLICY notificacoes_admin ON public.notificacoes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY notificacoes_marcar_lida ON public.notificacoes FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.obreiros o WHERE o.id = notificacoes.obreiro_id AND o.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.obreiros o WHERE o.id = notificacoes.obreiro_id AND o.user_id = auth.uid())
);
CREATE INDEX notificacoes_created_idx ON public.notificacoes (created_at DESC);
