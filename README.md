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
- Quadro de pedidos (Novo → Em preparo → Em entrega), métricas do dia e histórico
- Aviso de novos pedidos e atualização automática
- Cardápio: categorias, pratos, opções de preço e pausa rápida de itens
- Ajustes: perfil, logo e capa, horários por dia, endereço, bairros atendidos e retirada
- Botão para abrir e fechar a loja

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Motion · React Router · Sonner

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # typecheck + build de produção
npm run lint
npm test         # testes unitários (Vitest)
```

- Painel: `http://localhost:5173/admin`. Em modo demonstração, entre com qualquer e-mail válido e uma senha de 8+ caracteres.
- Vitrine: `http://localhost:5173/your-burger`

## Arquitetura

```
src/
├── app/                 # App, rotas (lazy por página), layout raiz e 404
├── components/
│   ├── ui/              # componentes shadcn (button, dialog, sheet, select…)
│   └── shared/          # componentes de produto reutilizáveis (DishCard, ImageUpload…)
├── features/
│   ├── auth/            # sessão, login, cadastro e proteção de rotas
│   ├── admin/           # layout do painel, pedidos, cardápio e ajustes
│   └── storefront/      # vitrine, sacola, checkout e acompanhamento
├── hooks/               # hooks genéricos (useAsync, useNow, useCepAutofill)
├── lib/                 # utilitários puros (formatação, Pix, imagem, storage…)
├── services/            # fronteira com a API
│   └── mock/            # backend simulado (localStorage) e dados de exemplo
└── types/               # tipos de domínio
```

### Integração com o backend

Os arquivos em `src/services` são a única camada que conhece a origem dos dados. Hoje eles usam o
backend simulado em `services/mock`, que já aplica as regras que pertencem ao servidor:

- rotas do painel exigem sessão válida;
- **preços, taxa de entrega e total são recalculados a partir do cardápio**, já que o cliente envia só IDs e quantidades;
- pedidos só são aceitos com a loja aberta e dentro do horário de funcionamento (inclusive turnos que passam da meia-noite);
- transições de status de pedido são validadas;
- o acompanhamento de pedidos usa um código aleatório (não o número sequencial).

Para integrar a API real, substitua o corpo das funções dos serviços por chamadas HTTP, mantendo as
assinaturas. O backend deve repetir essas validações e emitir a sessão como cookie
`HttpOnly; Secure; SameSite`.
