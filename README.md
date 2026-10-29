# Your Menu

Plataforma web de pedidos para pequenos restaurantes: cada restaurante tem seu cardápio digital
(vitrine pública) e um painel para acompanhar pedidos em tempo real, editar o cardápio e configurar a loja.

## Funcionalidades

**Vitrine do cliente** (`/:slug`)
- Cardápio por categorias, com busca, navegação fixa e destaque da seção visível
- Detalhes do prato com opções (tamanhos), quantidade e observação
- Sacola persistente com múltiplos itens
- Checkout em uma página: entrega ou retirada, CEP com preenchimento automático, Pix, cartão ou dinheiro (com troco)
- Acompanhamento do pedido em tempo real e QR Code Pix gerado localmente

**Painel do restaurante** (`/admin`)
- Cadastro cria a conta e a loja (com endereço próprio `/:slug`)
- Quadro de pedidos (Novo → Em preparo → Em entrega), métricas do dia e histórico
- Cardápio: categorias, pratos, opções de preço, fotos e pausa rápida de itens
- Financeiro: receitas, despesas, perdas, gráficos e exportação do extrato
- Ajustes: perfil, logo e capa, horários por dia, endereço, bairros atendidos e retirada

## Stack

- **Frontend:** React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Motion · React Router · Sonner
- **Backend:** Node · Express 5 · TypeScript · Kysely · SQLite (better-sqlite3) ou Postgres · Zod · JWT · Multer

## Como rodar

```bash
npm install
cp backend/.env.example backend/.env     # defina JWT_SECRET
cp frontend/.env.example frontend/.env
npm run dev      # API em :3333 e Vite em :5173
npm run build
npm run lint
npm test
```

- Painel: `http://localhost:5173/admin` (botão "Entrar com a conta demo" quando `VITE_DEMO_*` estão definidas)
- Vitrine demo: `http://localhost:5173/your-burger`
- API: `http://localhost:3333/api/health`

Com `SEED_DEMO=true`, o backend cria no primeiro boot a conta demo com cardápio, pedidos e seis meses de histórico financeiro.

## Estrutura

```
your-menu/
├── frontend/                  # SPA (Vite)
│   └── src/
│       ├── app/               # rotas (lazy por página), layout raiz e 404
│       ├── components/        # ui (shadcn) e shared (componentes de produto)
│       ├── config/            # variáveis de ambiente
│       ├── features/          # auth, admin, storefront, theme
│       ├── hooks/ · lib/      # hooks e utilitários puros
│       ├── services/          # http-client + um serviço por recurso da API
│       └── types/             # contratos da API
└── backend/                   # API REST (Express)
    ├── api/index.ts           # entrypoint serverless (Vercel)
    ├── src/
    │   ├── config/            # validação das envs
    │   ├── database/          # conexão, schema, migrations e seed demo
    │   ├── domain/            # regras puras (horários, status, mês, dinheiro)
    │   ├── repositories/      # acesso a dados (Kysely) e mapeamento
    │   ├── services/          # regras de negócio
    │   ├── controllers/       # entrada/saída HTTP
    │   ├── routes/            # rotas por recurso, montadas em /api
    │   ├── middlewares/       # auth, erros, upload, preparo do banco
    │   ├── validators/        # schemas Zod
    │   ├── storage/           # provedor de arquivos (imagens)
    │   └── types/             # DTOs da API
    └── tests/                 # Vitest + Supertest (SQLite em memória)
```

## API

Rotas públicas: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/storefronts/:slug`,
`GET /api/storefronts/:slug/menu`, `POST /api/storefronts/:slug/orders`,
`GET /api/storefronts/:slug/orders/:trackingCode`, `GET /api/uploads/:id`.

Rotas do painel (`Authorization: Bearer <token>`): `/api/auth/me`, `/api/restaurant` (perfil, `status`, `hours`,
`address`), `/api/delivery-zones`, `/api/menu`, `/api/categories`, `/api/dishes`, `/api/orders`,
`/api/finance` (`report`, `ledger`, `transactions`) e `POST /api/uploads`.

Regras aplicadas no servidor: dados sempre escopados ao restaurante do token; preços, taxa e total recalculados
a partir do cardápio; pedidos só com a loja aberta e dentro do horário (inclusive turnos após a meia-noite);
transições de status validadas; acompanhamento por código aleatório.

## Banco de dados

Por padrão a API usa SQLite (`DB_CLIENT=sqlite`). Para persistir em Postgres (ex.: Supabase), basta trocar as envs:

```env
DB_CLIENT=postgres
DATABASE_URL=postgresql://postgres.<ref>:<senha>@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

As migrations rodam automaticamente na primeira requisição. Valores monetários são guardados em centavos e
datas em ISO, para o mesmo código funcionar nos dois bancos.

## Deploy na Vercel

Crie dois projetos apontando para este repositório:

| Projeto  | Root Directory | Variáveis |
| -------- | -------------- | --------- |
| API      | `backend`      | `JWT_SECRET`, `CORS_ORIGIN=<url do frontend>`, `SEED_DEMO=true`, `DB_CLIENT`, `DATABASE_URL` |
| Frontend | `frontend`     | `VITE_API_URL=<url da API>/api`, `VITE_DEMO_EMAIL`, `VITE_DEMO_PASSWORD`, `VITE_DEMO_SLUG` |

Com SQLite na Vercel o arquivo fica em `/tmp` da função: os dados são recriados a cada cold start/deploy
(o seed demo volta ao estado inicial). Para dados permanentes, use Postgres.
