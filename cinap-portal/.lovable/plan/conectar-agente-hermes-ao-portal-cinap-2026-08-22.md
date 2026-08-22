# Conectar agente Hermes ao portal CINAP

## Objetivo
Permitir que um agente externo (Hermes) acesse e modifique dados do portal CINAP de forma segura, sem expor chaves de serviço ou senhas do banco.

## Restrições de segurança
- A chave de serviço (`SUPABASE_SERVICE_ROLE_KEY`) e a senha do banco não são exibidas em projetos Lovable Cloud.
- O agente não deve usar a chave publicável (anon) para operações administrativas, pois ela respeita as políticas de RLS e não permite acesso total.
- A conexão será feita por uma API própria do aplicativo, com autenticação por chave de API e auditoria das ações do agente.

## Escopo do acesso total controlado
O agente poderá, mediante chave válida:
- Listar congregações, obreiros e pagamentos.
- Criar/editar congregações e obreiros.
- Registrar pagamentos e consultar histórico.
- Gerar relatórios e recibos (via endpoints que reutilizam a lógica existente).

## Passos técnicos

### 1. Tabela de chaves de API para agentes
Criar `public.agent_keys` para armazenar chaves de acesso do agente externo, com controle de permissões e logs.
- Colunas: nome do agente, chave hash, permissões (leitura/escrita), ativa, último uso, created_at.
- Política: apenas admins podem gerenciar as chaves; a própria tabela só é acessível por service role dentro das funções de servidor.

### 2. Middleware de autenticação do agente
Criar função utilitária `verifyAgentKey` que:
- Lê o header `X-Agent-Key`.
- Valida a chave contra a tabela `agent_keys`.
- Rejeita requisições sem chave ou com chave desativada.
- Registra o `ultimo_uso` da chave.

### 3. Rotas públicas para o agente
Criar rotas em `src/routes/api/public/agent/`:
- `GET /api/public/agent/congregacoes` → lista congregações.
- `POST /api/public/agent/congregacoes` → cria congregação.
- `PATCH /api/public/agent/congregacoes/$id` → atualiza congregação.
- `GET /api/public/agent/obreiros` → lista obreiros.
- `POST /api/public/agent/obreiros` → cria obreiro.
- `PATCH /api/public/agent/obreiros/$id` → atualiza obreiro.
- `GET /api/public/agent/pagamentos` → lista pagamentos.
- `POST /api/public/agent/pagamentos` → registra pagamento.
- `GET /api/public/agent/relatorio-mensal` → retorna dados agregados para relatório.

Todas as rotas usam `supabaseAdmin` dentro do handler, após validar a chave do agente. Isso garante acesso total controlado sem vazar credenciais.

### 4. Painel administrativo para gerenciar chaves
Adicionar uma nova tela em `/_authenticated/agentes/`:
- Listar chaves existentes.
- Criar nova chave (exibida uma única vez após a criação).
- Revogar/desativar chave.
- Visualizar último uso.

### 5. Documentação de integração para o Hermes
Incluir no `README.md` (ou em um arquivo separado `AGENTE.md`):
- URL base da API pública.
- Header de autenticação `X-Agent-Key`.
- Exemplos de requisições para cada endpoint.
- Limites e boas práticas.

## Entregáveis
- Migration da tabela `agent_keys` com RLS e grants.
- Middleware `verifyAgentKey`.
- Rotas da API do agente.
- Tela de gerenciamento de chaves no painel admin.
- Documentação de integração.

## Não incluído
- Conexão direta ao banco com string de conexão ou service role key (não é possível nem seguro).
- MCP nativo no catálogo Lovable para Hermes (não está no catálogo de conectores disponíveis).
