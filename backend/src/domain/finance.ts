export const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "LOSS"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_CATEGORIES: Record<TransactionType, readonly string[]> = {
  INCOME: ["Vendas no balcão", "Encomendas e eventos", "Outras entradas"],
  EXPENSE: [
    "Insumos",
    "Embalagens",
    "Salários",
    "Aluguel",
    "Energia",
    "Água",
    "Gás",
    "Internet",
    "Marketing",
    "Contabilidade",
    "Manutenção",
    "Taxas e impostos",
    "Outras saídas",
  ],
  LOSS: ["Desperdício", "Validade vencida", "Estornos", "Avarias", "Outras perdas"],
};

export const ONLINE_SALES_CATEGORY = "Pedidos online";
