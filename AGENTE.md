# Integração de Agentes Externos — CINAP

Este documento descreve como conectar agentes externos (ex: Hermes) ao portal CINAP via a API pública segura.

## Autenticação

Todas as requisições devem incluir o header:

```http
X-Agent-Key: cinap-agent_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

As chaves são geradas no painel **Agentes** (`/_authenticated/agentes`) por um usuário com perfil de secretaria (`admin`). O sistema armazena apenas o hash SHA-256 da chave; o valor completo é exibido uma única vez no momento da criação.

Cada chave possui uma ou mais permissões:

- `read` — consulta de dados e relatórios
- `write` — criação/alteração de congregações, obreiros e registro de pagamentos

## Endpoints

Base: `https://seu-dominio.example/api/public/agent`

> Em produção, substitua pelo domínio publicado do projeto.

### Congregações

#### Listar
```http
GET /api/public/agent/congregacoes/
```

#### Criar
```http
POST /api/public/agent/congregacoes/
Content-Type: application/json

{
  "nome": "Igreja Nova Vida",
  "categoria": "Prata",
  "qdt_obreiros": 12,
  "cidade": "São Paulo",
  "estado": "SP",
  "ativa": true
}
```

Categorias aceitas: `Bronze`, `Prata`, `Ouro`. A mensalidade é calculada automaticamente pelo trigger do banco (Art. 7º).

#### Atualizar
```http
PATCH /api/public/agent/congregacoes/<id>
Content-Type: application/json

{
  "nome": "Igreja Nova Vida Central",
  "ativa": false
}
```

### Obreiros

#### Listar
```http
GET /api/public/agent/obreiros/
```

#### Criar
```http
POST /api/public/agent/obreiros/
Content-Type: application/json

{
  "nome": "João Silva",
  "congregacao_id": "<uuid>",
  "cargo": "Pastor Auxiliar",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "status_pagamento": "pendente"
}
```

#### Atualizar
```http
PATCH /api/public/agent/obreiros/<id>
Content-Type: application/json

{
  "cargo": "Pastor Presidente",
  "status_pagamento": "pago"
}
```

### Pagamentos

#### Listar
```http
GET /api/public/agent/pagamentos/
```

#### Registrar pagamento
```http
POST /api/public/agent/pagamentos/
Content-Type: application/json

{
  "obreiro_id": "<uuid>",
  "referencia": "06/2026",
  "data": "2026-06-10",
  "valor": 50.00
}
```

Se `valor` for omitido, o sistema usa o valor da mensalidade da congregação do obreiro. Se `referencia` for omitida, usa o mês corrente. O status do obreiro é atualizado para `pago` automaticamente.

### Relatório mensal

```http
GET /api/public/agent/relatorio-mensal?referencia=06/2026
```

Retorna:

```json
{
  "referencia": "06/2026",
  "categorias": [
    {
      "categoria": "Bronze",
      "congregacoes": 3,
      "obreiros": 15,
      "quitados": 10,
      "arrecadado": 400,
      "previsto": 600
    }
  ],
  "total": {
    "arrecadado": 400,
    "previsto": 600,
    "obreiros": 15,
    "quitados": 10,
    "inadimplencia": 200,
    "indiceAdimplencia": 67
  }
}
```

## Segurança

- As chaves são revogáveis e auditáveis (campo `ultimo_uso`).
- Requisições sem chave, com chave inválida, desativada ou sem a permissão necessária retornam `401` ou `403`.
- As rotas usam o client `supabaseAdmin` no servidor, portanto bypassam o RLS; a validação da chave é a única porta de entrada.
- Nunca exponha a chave em código cliente ou repositórios públicos.

## Exemplo de uso com curl

```bash
curl -H "X-Agent-Key: cinap-agent_sua-chave-aqui" \
    https://seu-dominio.example/api/public/agent/relatorio-mensal?referencia=06/2026
```
