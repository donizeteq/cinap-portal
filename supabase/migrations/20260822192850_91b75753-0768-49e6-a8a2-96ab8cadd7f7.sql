ALTER TABLE public.notificacoes
  ADD COLUMN IF NOT EXISTS destinatario text,
  ADD COLUMN IF NOT EXISTS tentativas integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enviado_em timestamp with time zone,
  ADD COLUMN IF NOT EXISTS ultima_tentativa_em timestamp with time zone,
  ADD COLUMN IF NOT EXISTS valor numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS message_id text;