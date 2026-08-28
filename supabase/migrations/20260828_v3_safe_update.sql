-- ============================================================
-- CINAP · Safe Update Migration (v3)
-- Atualização segura SEM apagar dados existentes.
-- Execute no SQL Editor do Supabase.
-- ============================================================

-- ---------- 1. TIPOS (se não existirem) ----------
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'obreiro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.categoria_congregacao AS ENUM ('Bronze', 'Prata', 'Ouro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.status_pagamento AS ENUM ('pago', 'pendente', 'atrasado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- 2. FUNÇÕES BASE ----------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.aplicar_mensalidade()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.valor_mensalidade := CASE NEW.categoria
    WHEN 'Bronze' THEN 40 WHEN 'Prata' THEN 50 WHEN 'Ouro' THEN 60 END;
  RETURN NEW;
END; $$;

-- ---------- 3. PERFIS E PAPÉIS ----------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  cpf text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ---------- 4. CONGREGAÇÕES ----------
CREATE TABLE IF NOT EXISTS public.congregacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  categoria public.categoria_congregacao NOT NULL DEFAULT 'Bronze',
  qdt_obreiros integer NOT NULL DEFAULT 0,
  valor_mensalidade numeric NOT NULL DEFAULT 40,
  cidade text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT '',
  ativa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.congregacoes TO authenticated;
GRANT ALL ON public.congregacoes TO service_role;
ALTER TABLE public.congregacoes ENABLE ROW LEVEL SECURITY;

-- ---------- 5. OBREIROS ----------
CREATE TABLE IF NOT EXISTS public.obreiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  congregacao_id uuid REFERENCES public.congregacoes(id) ON DELETE SET NULL,
  cargo text NOT NULL DEFAULT 'Obreiro',
  status_pagamento public.status_pagamento NOT NULL DEFAULT 'pendente',
  registro text NOT NULL DEFAULT ('CIN-' || upper(substr(md5(random()::text), 1, 6))),
  cpf text,
  email text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  validade date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '2 years'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obreiros TO authenticated;
GRANT ALL ON public.obreiros TO service_role;
ALTER TABLE public.obreiros ENABLE ROW LEVEL SECURITY;

-- ---------- 6. PAGAMENTOS ----------
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obreiro_id uuid NOT NULL REFERENCES public.obreiros(id) ON DELETE CASCADE,
  valor numeric NOT NULL DEFAULT 0,
  data date NOT NULL DEFAULT CURRENT_DATE,
  status public.status_pagamento NOT NULL DEFAULT 'pendente',
  referencia text NOT NULL DEFAULT to_char(CURRENT_DATE, 'MM/YYYY'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pagamentos TO authenticated;
GRANT ALL ON public.pagamentos TO service_role;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- ---------- 7. CONFIGURAÇÃO DE ALERTAS ----------
CREATE TABLE IF NOT EXISTS public.config_alertas (
  id boolean PRIMARY KEY DEFAULT true,
  remetente_nome text NOT NULL DEFAULT 'CINAP - Secretaria Geral',
  remetente_email text NOT NULL DEFAULT '',
  dominio_email text NOT NULL DEFAULT '',
  dia_vencimento integer NOT NULL DEFAULT 10,
  dias_antes_aviso integer NOT NULL DEFAULT 3,
  meses_intervalo_atraso integer NOT NULL DEFAULT 1,
  emails_ativos boolean NOT NULL DEFAULT false,
  copia_admin text NOT NULL DEFAULT '',
  ultima_execucao timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  assunto_vencimento text NOT NULL DEFAULT 'CINAP · Mensalidade de {{referencia}} a vencer',
  corpo_vencimento text NOT NULL DEFAULT 'A contribuição referente a {{referencia}} vence no dia {{dia_vencimento}}. Regularize a mensalidade para manter sua credencial ministerial ativa.',
  assunto_atraso text NOT NULL DEFAULT 'CINAP · {{meses}} mensalidade(s) em aberto',
  corpo_atraso text NOT NULL DEFAULT 'Constam {{meses}} mensalidade(s) em aberto, desde a competência {{referencia}}. Procure a tesouraria da sua congregação para regularização.',
  rodape_email text NOT NULL DEFAULT 'Em caso de dúvida, procure a tesouraria da sua congregação.',
  CONSTRAINT config_alertas_unica CHECK (id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.config_alertas TO authenticated;
GRANT ALL ON public.config_alertas TO service_role;
ALTER TABLE public.config_alertas ENABLE ROW LEVEL SECURITY;
INSERT INTO public.config_alertas (id) VALUES (true) ON CONFLICT DO NOTHING;

-- ---------- 8. NOTIFICAÇÕES / AVISOS ----------
CREATE TABLE IF NOT EXISTS public.notificacoes (
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
  destinatario text,
  tentativas integer NOT NULL DEFAULT 0,
  enviado_em timestamptz,
  ultima_tentativa_em timestamptz,
  valor numeric NOT NULL DEFAULT 0,
  message_id text,
  situacao text NOT NULL DEFAULT 'rascunho',
  agendado_para timestamptz,
  aprovado_por uuid,
  aprovado_em timestamptz,
  UNIQUE (obreiro_id, tipo, referencia, meses_atraso)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notificacoes TO authenticated;
GRANT ALL ON public.notificacoes TO service_role;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.validar_situacao_notificacao()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.situacao NOT IN ('rascunho','aprovado','agendado','enviado','falhou','cancelado') THEN
    RAISE EXCEPTION 'Situação inválida: %', NEW.situacao;
  END IF;
  IF NEW.situacao = 'agendado' AND NEW.agendado_para IS NULL THEN
    RAISE EXCEPTION 'Aviso agendado exige data de envio';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS notificacoes_validar_situacao ON public.notificacoes;
CREATE TRIGGER notificacoes_validar_situacao BEFORE INSERT OR UPDATE ON public.notificacoes
  FOR EACH ROW EXECUTE FUNCTION public.validar_situacao_notificacao();

-- ---------- 9. AUDITORIA DA SECRETARIA ----------
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
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.auditoria TO authenticated;
GRANT ALL ON public.auditoria TO service_role;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

-- ---------- 10. ANTI-ABUSO (rate limiting) ----------
CREATE TABLE IF NOT EXISTS public.auth_tentativas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL,
  tipo text NOT NULL,
  tentativas integer NOT NULL DEFAULT 0,
  janela_inicio timestamptz NOT NULL DEFAULT now(),
  bloqueado_ate timestamptz,
  ultima_tentativa timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chave, tipo)
);
GRANT SELECT ON public.auth_tentativas TO authenticated;
GRANT ALL ON public.auth_tentativas TO service_role;
ALTER TABLE public.auth_tentativas ENABLE ROW LEVEL SECURITY;

-- ---------- 11. CHAVES DE AGENTE (API externa) ----------
CREATE TABLE IF NOT EXISTS public.agent_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  chave_hash text NOT NULL,
  permissoes text[] NOT NULL DEFAULT '{read}',
  ativa boolean NOT NULL DEFAULT true,
  ultimo_uso timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_keys TO authenticated;
GRANT ALL ON public.agent_keys TO service_role;
ALTER TABLE public.agent_keys ENABLE ROW LEVEL SECURITY;

-- ---------- 12. VALIDAÇÃO PÚBLICA DA CREDENCIAL (QR Code) ----------
CREATE OR REPLACE FUNCTION public.validar_credencial(_registro text)
RETURNS TABLE(nome text, cargo text, registro text, congregacao text, cidade text,
              estado text, validade date, status_pagamento text, valida boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.nome, o.cargo, o.registro,
         COALESCE(c.nome, 'Sem vínculo'), COALESCE(c.cidade, ''), COALESCE(c.estado, ''),
         o.validade, o.status_pagamento::text,
         (o.validade >= CURRENT_DATE AND o.status_pagamento <> 'atrasado')
  FROM public.obreiros o
  LEFT JOIN public.congregacoes c ON c.id = o.congregacao_id
  WHERE upper(o.registro) = upper(trim(_registro))
  LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.validar_credencial(text) TO anon, authenticated;

-- ---------- 13. TRIGGERS E POLÍTICAS DE RLS ----------
DO $$ BEGIN
  CREATE POLICY profiles_own ON public.profiles FOR ALL TO authenticated
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY user_roles_own_select ON public.user_roles FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY obreiros_select ON public.obreiros FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY obreiros_admin_write ON public.obreiros FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY congregacoes_select ON public.congregacoes FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.obreiros o WHERE o.user_id = auth.uid() AND o.congregacao_id = congregacoes.id));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY congregacoes_admin_write ON public.congregacoes FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY pagamentos_select ON public.pagamentos FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.obreiros o WHERE o.id = pagamentos.obreiro_id AND o.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY pagamentos_admin_write ON public.pagamentos FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY config_alertas_admin ON public.config_alertas FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY notificacoes_select ON public.notificacoes FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.obreiros o WHERE o.id = notificacoes.obreiro_id AND o.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY notificacoes_admin ON public.notificacoes FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY auditoria_admin_select ON public.auditoria FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY auth_tentativas_admin_select ON public.auth_tentativas FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY agent_keys_admin_all ON public.agent_keys FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
