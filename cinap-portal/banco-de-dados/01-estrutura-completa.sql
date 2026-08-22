CREATE TYPE public.app_role AS ENUM ('admin','obreiro');
CREATE TYPE public.categoria_congregacao AS ENUM ('Bronze','Prata','Ouro');
CREATE TYPE public.status_pagamento AS ENUM ('pago','pendente','atrasado');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  cpf text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "user_roles_own_select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'obreiro')
  ON CONFLICT (user_id, role) DO NOTHING;
  UPDATE public.obreiros SET user_id = NEW.id WHERE lower(email) = lower(NEW.email) AND user_id IS NULL;
  RETURN NEW;
END; $$;

CREATE TABLE public.congregacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  categoria public.categoria_congregacao NOT NULL DEFAULT 'Bronze',
  qdt_obreiros integer NOT NULL DEFAULT 0,
  valor_mensalidade numeric(10,2) NOT NULL DEFAULT 40,
  cidade text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT '',
  ativa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.congregacoes TO authenticated;
GRANT ALL ON public.congregacoes TO service_role;
ALTER TABLE public.congregacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "congregacoes_select" ON public.congregacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "congregacoes_admin_write" ON public.congregacoes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.aplicar_mensalidade()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.valor_mensalidade := CASE NEW.categoria
    WHEN 'Bronze' THEN 40 WHEN 'Prata' THEN 50 WHEN 'Ouro' THEN 60 END;
  RETURN NEW;
END; $$;
CREATE TRIGGER congregacoes_mensalidade BEFORE INSERT OR UPDATE ON public.congregacoes
FOR EACH ROW EXECUTE FUNCTION public.aplicar_mensalidade();

CREATE TABLE public.obreiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  congregacao_id uuid REFERENCES public.congregacoes(id) ON DELETE SET NULL,
  cargo text NOT NULL DEFAULT 'Obreiro',
  status_pagamento public.status_pagamento NOT NULL DEFAULT 'pendente',
  registro text NOT NULL DEFAULT ('CIN-' || upper(substr(md5(random()::text),1,6))),
  cpf text,
  email text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  validade date NOT NULL DEFAULT (current_date + interval '2 years'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obreiros TO authenticated;
GRANT ALL ON public.obreiros TO service_role;
ALTER TABLE public.obreiros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "obreiros_select" ON public.obreiros FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "obreiros_admin_write" ON public.obreiros FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obreiro_id uuid NOT NULL REFERENCES public.obreiros(id) ON DELETE CASCADE,
  valor numeric(10,2) NOT NULL DEFAULT 0,
  data date NOT NULL DEFAULT current_date,
  status public.status_pagamento NOT NULL DEFAULT 'pendente',
  referencia text NOT NULL DEFAULT to_char(current_date,'MM/YYYY'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pagamentos TO authenticated;
GRANT ALL ON public.pagamentos TO service_role;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pagamentos_select" ON public.pagamentos FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.obreiros o WHERE o.id = pagamentos.obreiro_id AND o.user_id = auth.uid())
);
CREATE POLICY "pagamentos_admin_write" ON public.pagamentos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.congregacoes (id, nome, categoria, qdt_obreiros, cidade, estado) VALUES
 ('11111111-1111-1111-1111-111111111101','Igreja Central de São Paulo','Ouro',42,'São Paulo','SP'),
 ('11111111-1111-1111-1111-111111111102','Congregação Sol Nascente','Prata',18,'Campinas','SP'),
 ('11111111-1111-1111-1111-111111111103','Comunidade Esperança','Bronze',12,'Curitiba','PR'),
 ('11111111-1111-1111-1111-111111111104','Missão Vale do Ribeira','Prata',15,'Registro','SP'),
 ('11111111-1111-1111-1111-111111111105','Monte Sinai Norte','Bronze',8,'Belém','PA'),
 ('11111111-1111-1111-1111-111111111106','Betel Vila Nova','Ouro',31,'Goiânia','GO');

INSERT INTO public.obreiros (id, nome, congregacao_id, cargo, status_pagamento, registro, cpf) VALUES
 ('22222222-2222-2222-2222-222222222201','Pr. Ricardo M. de Souza','11111111-1111-1111-1111-111111111101','Pastor Presidente','pago','CIN-8822','123.456.789-00'),
 ('22222222-2222-2222-2222-222222222202','Pb. Antônio dos Santos','11111111-1111-1111-1111-111111111101','Presbítero','pago','CIN-8823','223.456.789-00'),
 ('22222222-2222-2222-2222-222222222203','Ev. Marcos Aurélio Lima','11111111-1111-1111-1111-111111111102','Evangelista','pendente','CIN-8824','323.456.789-00'),
 ('22222222-2222-2222-2222-222222222204','Dc. José Carlos Ferreira','11111111-1111-1111-1111-111111111103','Diácono','atrasado','CIN-8825','423.456.789-00'),
 ('22222222-2222-2222-2222-222222222205','Pr. Elias Barbosa','11111111-1111-1111-1111-111111111104','Pastor Auxiliar','pago','CIN-8826','523.456.789-00'),
 ('22222222-2222-2222-2222-222222222206','Pb. Roberto Nogueira','11111111-1111-1111-1111-111111111106','Presbítero','pago','CIN-8827','623.456.789-00'),
 ('22222222-2222-2222-2222-222222222207','Dc. Paulo Henrique Alves','11111111-1111-1111-1111-111111111105','Diácono','pendente','CIN-8828','723.456.789-00');

INSERT INTO public.pagamentos (obreiro_id, valor, data, status, referencia) VALUES
 ('22222222-2222-2222-2222-222222222201',60,'2026-08-05','pago','08/2026'),
 ('22222222-2222-2222-2222-222222222202',60,'2026-08-06','pago','08/2026'),
 ('22222222-2222-2222-2222-222222222203',50,'2026-08-10','pendente','08/2026'),
 ('22222222-2222-2222-2222-222222222204',40,'2026-07-15','atrasado','07/2026'),
 ('22222222-2222-2222-2222-222222222205',50,'2026-08-02','pago','08/2026'),
 ('22222222-2222-2222-2222-222222222206',60,'2026-08-03','pago','08/2026'),
 ('22222222-2222-2222-2222-222222222207',40,'2026-08-12','pendente','08/2026'),
 ('22222222-2222-2222-2222-222222222201',60,'2026-07-05','pago','07/2026'),
 ('22222222-2222-2222-2222-222222222202',60,'2026-07-06','pago','07/2026'),
 ('22222222-2222-2222-2222-222222222205',50,'2026-07-02','pago','07/2026');REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.aplicar_mensalidade() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_primeiro boolean;
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO v_primeiro;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN v_primeiro THEN 'admin'::public.app_role ELSE 'obreiro'::public.app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.obreiros SET user_id = NEW.id WHERE lower(email) = lower(NEW.email) AND user_id IS NULL;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;CREATE TABLE public.agent_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  chave_hash text NOT NULL UNIQUE,
  permissoes text[] NOT NULL DEFAULT '{read}',
  ativa boolean NOT NULL DEFAULT true,
  ultimo_uso timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_keys TO authenticated;
GRANT ALL ON public.agent_keys TO service_role;

ALTER TABLE public.agent_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_keys_admin_all"
ON public.agent_keys
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.agent_keys
ADD CONSTRAINT permissoes_validas
CHECK (permissoes <@ ARRAY['read', 'write']::text[]);