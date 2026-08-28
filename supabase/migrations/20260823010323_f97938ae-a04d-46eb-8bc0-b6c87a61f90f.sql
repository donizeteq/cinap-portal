-- 1. Fluxo de prévia / aprovação / agendamento dos avisos
ALTER TABLE public.notificacoes
  ADD COLUMN IF NOT EXISTS situacao text NOT NULL DEFAULT 'enviado',
  ADD COLUMN IF NOT EXISTS agendado_para timestamp with time zone,
  ADD COLUMN IF NOT EXISTS aprovado_por uuid,
  ADD COLUMN IF NOT EXISTS aprovado_em timestamp with time zone;

UPDATE public.notificacoes SET situacao = CASE WHEN email_enviado THEN 'enviado' ELSE 'aprovado' END;
ALTER TABLE public.notificacoes ALTER COLUMN situacao SET DEFAULT 'rascunho';

CREATE OR REPLACE FUNCTION public.validar_situacao_notificacao()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.situacao NOT IN ('rascunho','aprovado','agendado','enviado','cancelado') THEN
    RAISE EXCEPTION 'Situação inválida: %', NEW.situacao;
  END IF;
  IF NEW.situacao = 'agendado' AND NEW.agendado_para IS NULL THEN
    RAISE EXCEPTION 'Aviso agendado exige data de envio';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS notificacoes_validar_situacao ON public.notificacoes;
CREATE TRIGGER notificacoes_validar_situacao
  BEFORE INSERT OR UPDATE ON public.notificacoes
  FOR EACH ROW EXECUTE FUNCTION public.validar_situacao_notificacao();

CREATE INDEX IF NOT EXISTS notificacoes_situacao_idx ON public.notificacoes (situacao, agendado_para);

-- 2. Auditoria das ações da Secretaria Geral
CREATE TABLE IF NOT EXISTS public.auditoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid,
  usuario_email text NOT NULL DEFAULT '',
  usuario_nome text NOT NULL DEFAULT '',
  acao text NOT NULL,
  entidade text NOT NULL DEFAULT '',
  entidade_id text,
  descricao text NOT NULL DEFAULT '',
  detalhes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.auditoria TO authenticated;
GRANT ALL ON public.auditoria TO service_role;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auditoria_admin_select" ON public.auditoria
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS auditoria_created_at_idx ON public.auditoria (created_at DESC);

-- 3. Anti-abuso de recuperação de senha / verificação de e-mail
CREATE TABLE IF NOT EXISTS public.auth_tentativas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL,
  tipo text NOT NULL,
  tentativas integer NOT NULL DEFAULT 0,
  janela_inicio timestamp with time zone NOT NULL DEFAULT now(),
  bloqueado_ate timestamp with time zone,
  ultima_tentativa timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (chave, tipo)
);

GRANT ALL ON public.auth_tentativas TO service_role;
ALTER TABLE public.auth_tentativas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_tentativas_admin_select" ON public.auth_tentativas
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

CREATE TRIGGER auth_tentativas_updated_at
  BEFORE UPDATE ON public.auth_tentativas
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();