CREATE TABLE public.agent_keys (
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