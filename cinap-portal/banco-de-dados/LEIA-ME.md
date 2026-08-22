# Banco de dados CINAP — migração local

## Conteúdo
- `01-estrutura-completa.sql` — todas as migrations (tabelas, enums, triggers, RLS, grants).
- `02-dados.sql` — INSERTs com os dados atuais.
- `csv/` — mesmos dados em CSV.

## Restaurar em Postgres/Supabase local
```bash
createdb cinap
psql -d cinap -f 01-estrutura-completa.sql
psql -d cinap -f 02-dados.sql
```
Em Postgres puro (sem Supabase), crie antes os papéis e o esquema auth:
```sql
CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY, email text);
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULL::uuid $$;
```
Usuários de login ficam no esquema `auth` gerenciado pelo Supabase e não são exportados — recrie as contas e vincule `obreiros.user_id`.

## Rodar o app localmente
```bash
bun install
cp .env.example .env   # preencha URL e chave do seu backend
bun run dev
```
