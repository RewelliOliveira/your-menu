import { CreateOrderPayload, OrderEntity, OrderItemSummary, OrderStatus } from "@/core/types/order-types";

export const INITIAL_MOCK_ORDERS: OrderEntity[] = [
  {
    id: 101,
    restaurantId: "rest-mock-123",
    dateTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    price: 113.7,
    status: "PENDING",
    note: "Sem cebola no segundo hambúrguer, por favor.",
    orderItems: [
      {
        id: 1,
        dishSizeOptionId: 1002,
        dishName: "Smash Burger Clássico",
        foodImg: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 2,
          magnitude: "Duplo",
          measureUnit: "UN",
          abbreviation: "Duplo",
        },
        quantity: 2,
        price: 36.9,
      },
      {
        id: 2,
        dishSizeOptionId: 3001,
        dishName: "Batata Rústica c/ Alecrim",
        foodImg: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 6,
          magnitude: "Porção",
          measureUnit: "300g",
          abbreviation: "300g",
        },
        quantity: 1,
        price: 19.9,
      },
      {
        id: 3,
        dishSizeOptionId: 4001,
        dishName: "Coca-Cola Original",
        foodImg: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 4,
          magnitude: "350",
          measureUnit: "ML",
          abbreviation: "350ml",
        },
        quantity: 2,
        price: 6.5,
      },
    ],
    orderAdress: {
      id: 1,
      deliveryZone: {
        id: 1,
        zone: "Centro",
        deliveryFee: 7.0,
      },
      cep: 1001000,
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 42",
      reference: "Próximo à praça central",
    },
    orderClient: {
      firstName: "Carlos",
      lastName: "Eduardo Silva",
      phone: "11987654321",
    },
  },
  {
    id: 102,
    restaurantId: "rest-mock-123",
    dateTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    price: 80.4,
    status: "CONFIRMED",
    note: "Enviar talheres descartáveis.",
    orderItems: [
      {
        id: 4,
        dishSizeOptionId: 1004,
        dishName: "Bacon Crispy Supreme",
        foodImg: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 2,
          magnitude: "Combo",
          measureUnit: "UN",
          abbreviation: "Combo c/ Fritas",
        },
        quantity: 1,
        price: 44.9,
      },
      {
        id: 5,
        dishSizeOptionId: 5002,
        dishName: "Cheesecake de Frutas Vermelhas",
        foodImg: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 1,
          magnitude: "Fatia",
          measureUnit: "UN",
          abbreviation: "Fatia",
        },
        quantity: 1,
        price: 21.0,
      },
      {
        id: 6,
        dishSizeOptionId: 4002,
        dishName: "Coca-Cola Original",
        foodImg: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 5,
          magnitude: "2",
          measureUnit: "L",
          abbreviation: "2L",
        },
        quantity: 1,
        price: 14.5,
      },
    ],
    orderAdress: {
      id: 2,
      deliveryZone: {
        id: 2,
        zone: "Bela Vista",
        deliveryFee: 7.0,
      },
      cep: 1311200,
      street: "Av. Paulista",
      number: "1500",
      complement: "Bloco B, 12º andar",
      reference: "Edifício Horizon",
    },
    orderClient: {
      firstName: "Mariana",
      lastName: "Souza Santos",
      phone: "11976543210",
    },
  },
  {
    id: 103,
    restaurantId: "rest-mock-123",
    dateTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    price: 93.0,
    status: "IN_DELIVERY",
    note: "Tocar o interfone número 302.",
    orderItems: [
      {
        id: 7,
        dishSizeOptionId: 2002,
        dishName: "Pizza Margherita Especial",
        foodImg: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 3,
          magnitude: "Grande",
          measureUnit: "UN",
          abbreviation: "G (8 fatias)",
        },
        quantity: 1,
        price: 62.0,
      },
      {
        id: 8,
        dishSizeOptionId: 3002,
        dishName: "Onion Rings Empanadas",
        foodImg: "https://images.unsplash.com/photo-1639024471285-0afc3831652c?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 6,
          magnitude: "Porção",
          measureUnit: "250g",
          abbreviation: "250g",
        },
        quantity: 1,
        price: 22.0,
      },
    ],
    orderAdress: {
      id: 3,
      deliveryZone: {
        id: 3,
        zone: "Jardins",
        deliveryFee: 9.0,
      },
      cep: 1426001,
      street: "Rua Oscar Freire",
      number: "850",
      complement: "Apto 302",
      reference: "Em frente à galeria",
    },
    orderClient: {
      firstName: "Lucas",
      lastName: "Mendes Oliveira",
      phone: "11965432109",
    },
  },
  {
    id: 104,
    restaurantId: "rest-mock-123",
    dateTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    price: 126.0,
    status: "DELIVERED",
    note: null,
    orderItems: [
      {
        id: 9,
        dishSizeOptionId: 1005,
        dishName: "Truffled Monster Burger",
        foodImg: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 1,
          magnitude: "Individual",
          measureUnit: "UN",
          abbreviation: "IND",
        },
        quantity: 2,
        price: 42.0,
      },
      {
        id: 10,
        dishSizeOptionId: 5001,
        dishName: "Brownie Artesanal c/ Nutella",
        foodImg: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 1,
          magnitude: "Fatia",
          measureUnit: "UN",
          abbreviation: "Fatia",
        },
        quantity: 2,
        price: 18.5,
      },
    ],
    orderAdress: {
      id: 4,
      deliveryZone: {
        id: 1,
        zone: "Centro",
        deliveryFee: 5.0,
      },
      cep: 1304000,
      street: "Rua Augusta",
      number: "420",
      complement: "Casa 2",
      reference: "Vila de casas amarelas",
    },
    orderClient: {
      firstName: "Beatriz",
      lastName: "Lima Santos",
      phone: "11954321098",
    },
  },
  {
    id: 105,
    restaurantId: "rest-mock-123",
    dateTime: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    price: 80.8,
    status: "DELIVERED",
    note: null,
    orderItems: [
      {
        id: 11,
        dishSizeOptionId: 2003,
        dishName: "Pizza Pepperoni & Honey",
        foodImg: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 2,
          magnitude: "Média",
          measureUnit: "UN",
          abbreviation: "M (6 fatias)",
        },
        quantity: 1,
        price: 54.0,
      },
      {
        id: 12,
        dishSizeOptionId: 4003,
        dishName: "Suco Natural de Laranja",
        foodImg: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 4,
          magnitude: "400",
          measureUnit: "ML",
          abbreviation: "Copo 400ml",
        },
        quantity: 2,
        price: 9.9,
      },
    ],
    orderAdress: {
      id: 5,
      deliveryZone: {
        id: 2,
        zone: "Bela Vista",
        deliveryFee: 7.0,
      },
      cep: 1418100,
      street: "Alameda Santos",
      number: "900",
      complement: "Apto 101",
      reference: "Portão cinza",
    },
    orderClient: {
      firstName: "Rafael",
      lastName: "Alencar Prado",
      phone: "11943210987",
    },
  },
  {
    id: 106,
    restaurantId: "rest-mock-123",
    dateTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    price: 34.9,
    status: "CANCELLED",
    note: "Cancelado pelo cliente por mudança de planos.",
    orderItems: [
      {
        id: 13,
        dishSizeOptionId: 1001,
        dishName: "Smash Burger Clássico",
        foodImg: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        sizeOption: {
          id: 1,
          magnitude: "Individual",
          measureUnit: "UN",
          abbreviation: "IND",
        },
        quantity: 1,
        price: 28.9,
      },
    ],
    orderAdress: {
      id: 6,
      deliveryZone: {
        id: 1,
        zone: "Centro",
        deliveryFee: 6.0,
      },
      cep: 1307000,
      street: "Rua Frei Caneca",
      number: "300",
      complement: "Apto 54",
      reference: "Ao lado do shopping",
    },
    orderClient: {
      firstName: "Fernanda",
      lastName: "Rocha",
      phone: "11932109876",
    },
  },
];

const ORDERS_KEY = "your_menu_mock_orders";

function getStoredOrders(): OrderEntity[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_ORDERS;
}

function saveOrders(orders: OrderEntity[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    void 0;
  }
}

export async function mockGetOrders(): Promise<OrderEntity[]> {
  await new Promise((r) => setTimeout(r, 120));
  return getStoredOrders();
}

export async function mockGetOrderById(orderId: number): Promise<OrderEntity | null> {
  await new Promise((r) => setTimeout(r, 100));
  const orders = getStoredOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export async function mockUpdateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
  await new Promise((r) => setTimeout(r, 120));
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
}

export async function mockCreateOrder(payload: CreateOrderPayload): Promise<{ orderId: number }> {
  await new Promise((r) => setTimeout(r, 180));
  const orders = getStoredOrders();
  const nextId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 101;

  const names = payload.orderClient.name.trim().split(" ");
  const firstName = names[0] || "Cliente";
  const lastName = names.slice(1).join(" ") || "";

  const items: OrderItemSummary[] = payload.orderItems.map((item, idx) => ({
    id: nextId * 10 + idx,
    dishSizeOptionId: item.dishSizeOptionId,
    dishName: item.dishName || "Prato Selecionado",
    foodImg:
      item.foodImg ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    sizeOption: item.sizeOption || {
      id: item.dishSizeOptionId,
      magnitude: "1",
      measureUnit: "UN",
      abbreviation: "UN",
    },
    quantity: item.quantity,
    price: item.price || 30.0,
  }));

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 7.0;

  const newOrder: OrderEntity = {
    id: nextId,
    restaurantId: payload.restaurantId || "rest-mock-123",
    dateTime: payload.dateTime || new Date().toISOString(),
    status: "PENDING",
    price: totalPrice,
    note: null,
    orderItems: items,
    orderAdress: {
      id: nextId,
      deliveryZone: {
        id: payload.orderAdress.deliveryZoneId,
        zone: "Zona Selecionada",
        deliveryFee: 7.0,
      },
      cep: parseInt(payload.orderAdress.cep.replace(/\D/g, "")) || 1000000,
      street: payload.orderAdress.street,
      number: payload.orderAdress.number,
      complement: payload.orderAdress.complement,
      reference: payload.orderAdress.reference,
    },
    orderClient: {
      firstName,
      lastName,
      phone: payload.orderClient.phone,
    },
  };

  orders.unshift(newOrder);
  saveOrders(orders);
  return { orderId: nextId };
}
