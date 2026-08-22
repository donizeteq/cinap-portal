# Banco de dados CINAP — exportação

## Conteúdo
- `schema/` — migrations SQL (tabelas, enums, funções, triggers, RLS/GRANTs). Aplique na ordem do nome do arquivo.
- `dados/` — dados atuais de cada tabela em CSV.

## Restaurar em outro Postgres/Supabase
1. Rode os arquivos de `schema/` em ordem.
2. Importe os CSVs:
   `\copy public.congregacoes FROM 'dados/congregacoes.csv' WITH CSV HEADER`
   (repita para obreiros, pagamentos, profiles, user_roles — nessa ordem por causa das chaves estrangeiras)

Obs.: usuários de autenticação (auth.users) não são exportáveis por aqui; recrie os logins no novo projeto.
