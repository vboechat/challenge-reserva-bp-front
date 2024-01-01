# RESERVA-BP (Front-end)

Repositório do desafio front-end para a Bem Protege.

## Getting Started

### Instale as dependências

```bash
npm install
```

## Rodando em desenvolvimento

Será executaod em `http://localhost:3000`:

```bash
npm run dev
```

## Produção

### Builde

```bash
npm run build
```

### Rode a preview da build de produção:

```bash
npm run preview
```

### Rode em produção

```bash
node .output/server/index.mjs
```

## Documentação

### Variáveis de ambiente

| Variável             | Descrição             | Padrão                       |
| -------------------- | --------------------- | ---------------------------- |
| API_PORT             | Porta do servidor     | http://localhost:3001/api/v1 |
| NITRO_PORT (ou PORT) | Porta do front-end    | 3000                         |
| NITRO_HOST (ou HOST) | Hostname do front-end | 0.0.0.0                      |

Outros em: https://nuxt.com/docs/getting-started/deployment
