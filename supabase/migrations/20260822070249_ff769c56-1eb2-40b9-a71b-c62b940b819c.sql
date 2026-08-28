
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('cinap-alertas-diarios') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cinap-alertas-diarios');

SELECT cron.schedule(
  'cinap-alertas-diarios',
  '0 12 * * *',
  $$
  SELECT net.http_post(
    url := 'https://portal.cinap.org.br/api/public/hooks/alertas',
    headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_W-2uBhUALzH0tq_79T3phg_9OdrqOcV"}'::jsonb,
    body := '{"origem": "cron"}'::jsonb
  ) as request_id;
  $$
);
