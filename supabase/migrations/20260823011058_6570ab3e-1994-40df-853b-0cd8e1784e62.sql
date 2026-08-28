CREATE OR REPLACE FUNCTION public.validar_credencial(_registro text)
RETURNS TABLE (
  nome text,
  cargo text,
  registro text,
  congregacao text,
  cidade text,
  estado text,
  validade date,
  status_pagamento text,
  valida boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.nome,
         o.cargo,
         o.registro,
         COALESCE(c.nome, 'Sem vínculo'),
         COALESCE(c.cidade, ''),
         COALESCE(c.estado, ''),
         o.validade,
         o.status_pagamento::text,
         (o.validade >= CURRENT_DATE AND o.status_pagamento <> 'atrasado')
  FROM public.obreiros o
  LEFT JOIN public.congregacoes c ON c.id = o.congregacao_id
  WHERE upper(o.registro) = upper(trim(_registro))
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.validar_credencial(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_credencial(text) TO anon, authenticated, service_role;