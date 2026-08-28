ALTER TABLE public.config_alertas
  ADD COLUMN IF NOT EXISTS assunto_vencimento text NOT NULL DEFAULT 'CINAP · Mensalidade de {{referencia}} a vencer',
  ADD COLUMN IF NOT EXISTS corpo_vencimento text NOT NULL DEFAULT 'A contribuição referente a {{referencia}} vence no dia {{dia_vencimento}}.
Regularize a mensalidade para manter sua credencial ministerial ativa.',
  ADD COLUMN IF NOT EXISTS assunto_atraso text NOT NULL DEFAULT 'CINAP · {{meses}} mensalidade(s) em aberto',
  ADD COLUMN IF NOT EXISTS corpo_atraso text NOT NULL DEFAULT 'Constam {{meses}} mensalidade(s) em aberto, desde a competência {{referencia}}.
Procure a tesouraria da sua congregação para regularização.',
  ADD COLUMN IF NOT EXISTS rodape_email text NOT NULL DEFAULT 'Em caso de dúvida, procure a tesouraria da sua congregação.';