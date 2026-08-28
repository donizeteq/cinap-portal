CREATE OR REPLACE FUNCTION public.vincular_obreiro_usuario()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS NULL AND NEW.email IS NOT NULL THEN
    SELECT u.id INTO NEW.user_id FROM auth.users u WHERE lower(u.email) = lower(NEW.email) LIMIT 1;
  END IF;
  RETURN NEW;
END; $$;

REVOKE ALL ON FUNCTION public.vincular_obreiro_usuario() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS obreiros_vincular_usuario ON public.obreiros;
CREATE TRIGGER obreiros_vincular_usuario
BEFORE INSERT OR UPDATE OF email ON public.obreiros
FOR EACH ROW EXECUTE FUNCTION public.vincular_obreiro_usuario();