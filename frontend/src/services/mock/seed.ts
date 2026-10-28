import type { Category, Dish } from "@/types/menu";
import type { Order } from "@/types/order";
import {
  WEEKDAYS,
  type BusinessHours,
  type DeliveryZone,
  type Restaurant,
  type RestaurantAddress,
} from "@/types/restaurant";

const img = (id: string, width = 600) =>
  `https://images.unsplash.com/${id}?w=${width}&auto=format&fit=crop&q=80`;

export const DEMO_ACCOUNT = {
  email: "demo@yourburger.com.br",
  password: "demonstracao",
};

export const SEED_RESTAURANT: Restaurant = {
  id: "rest-1",
  slug: "your-burger",
  name: "YourBurger Artesanal",
  description: "Hambúrgueres artesanais, pizzas de fermentação natural e sobremesas da casa.",
  logoUrl: img("photo-1550547660-d9450f859349", 300),
  bannerUrl: img("photo-1555396273-367ea4eb4db5", 1400),
  deliveryTimeMin: 30,
  deliveryTimeMax: 45,
  isOpen: true,
  pickupEnabled: true,
  pixKey: "contato@yourburger.com.br",
};

export const SEED_HOURS: BusinessHours[] = WEEKDAYS.map((weekday) => ({
  weekday,
  isOpen: true,
  openingTime: "00:00",
  closingTime: "00:00",
}));

export const SEED_ADDRESS: RestaurantAddress = {
  cep: "01310-100",
  state: "SP",
  city: "São Paulo",
  district: "Bela Vista",
  street: "Avenida Paulista",
  number: "1000",
  complement: "Loja 04",
  reference: "Próximo ao MASP",
};

export const SEED_ZONES: DeliveryZone[] = [
  { id: "zone-centro", name: "Centro", fee: 5 },
  { id: "zone-bela-vista", name: "Bela Vista", fee: 7 },
  { id: "zone-consolacao", name: "Consolação", fee: 6.5 },
  { id: "zone-jardins", name: "Jardins", fee: 9 },
  { id: "zone-pinheiros", name: "Pinheiros", fee: 12 },
];

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-burgers", name: "Hambúrgueres" },
  { id: "cat-pizzas", name: "Pizzas" },
  { id: "cat-sides", name: "Acompanhamentos" },
  { id: "cat-drinks", name: "Bebidas" },
  { id: "cat-desserts", name: "Sobremesas" },
];

export const SEED_DISHES: Dish[] = [
  {
    id: "dish-smash",
    categoryId: "cat-burgers",
    name: "Smash Burger Clássico",
    description:
      "Blend bovino 160g prensado, cheddar inglês, cebola caramelizada, picles artesanal e molho da casa no pão brioche.",
    imageUrl: img("photo-1568901346375-23c9450c58cd"),
    isAvailable: true,
    variants: [
      { id: "var-smash-1", label: "Simples", price: 28.9 },
      { id: "var-smash-2", label: "Duplo", price: 36.9 },
    ],
  },
  {
    id: "dish-bacon",
    categoryId: "cat-burgers",
    name: "Bacon Crispy Supreme",
    description:
      "Dois smash de 120g, bacon crocante, queijo gouda, maionese defumada e cebola crispy no pão australiano.",
    imageUrl: img("photo-1586190848861-99aa4a171e90"),
    isAvailable: true,
    variants: [
      { id: "var-bacon-1", label: "Individual", price: 34.5 },
      { id: "var-bacon-2", label: "Combo c/ fritas", price: 44.9 },
    ],
  },
  {
    id: "dish-truffle",
    categoryId: "cat-burgers",
    name: "Truffled Monster Burger",
    description: "Blend Angus 200g, brie maçaricado, cogumelos salteados, rúcula e maionese trufada.",
    imageUrl: img("photo-1553979459-d2229ba7433b"),
    isAvailable: true,
    variants: [{ id: "var-truffle-1", label: "Individual", price: 42 }],
  },
  {
    id: "dish-margherita",
    categoryId: "cat-pizzas",
    name: "Pizza Margherita Especial",
    description: "Molho San Marzano, mozzarella de búfala, manjericão orgânico e azeite extravirgem.",
    imageUrl: img("photo-1604382355076-af4b0eb60143"),
    isAvailable: true,
    variants: [
      { id: "var-margherita-m", label: "Média (6 fatias)", price: 48 },
      { id: "var-margherita-g", label: "Grande (8 fatias)", price: 62 },
    ],
  },
  {
    id: "dish-pepperoni",
    categoryId: "cat-pizzas",
    name: "Pizza Pepperoni & Honey",
    description: "Molho rústico, mozzarella, pepperoni artesanal e fio de mel picante.",
    imageUrl: img("photo-1628840042765-356cda07504e"),
    isAvailable: true,
    variants: [
      { id: "var-pepperoni-m", label: "Média (6 fatias)", price: 54 },
      { id: "var-pepperoni-g", label: "Grande (8 fatias)", price: 69.9 },
    ],
  },
  {
    id: "dish-fries",
    categoryId: "cat-sides",
    name: "Batata Rústica c/ Alecrim",
    description: "Batatas rústicas crocantes com sal marinho, alecrim e páprica defumada. Acompanha maionese verde.",
    imageUrl: img("photo-1573080496219-bb080dd4f877"),
    isAvailable: true,
    variants: [{ id: "var-fries-1", label: "Porção 300g", price: 19.9 }],
  },
  {
    id: "dish-onion",
    categoryId: "cat-sides",
    name: "Onion Rings",
    description: "Anéis de cebola empanados em massa de cerveja. Acompanha barbecue artesanal.",
    imageUrl: img("photo-1639024471283-03518883512d"),
    isAvailable: false,
    variants: [{ id: "var-onion-1", label: "Porção 250g", price: 22 }],
  },
  {
    id: "dish-coke",
    categoryId: "cat-drinks",
    name: "Coca-Cola Original",
    description: "Refrigerante bem gelado para acompanhar seu pedido.",
    imageUrl: img("photo-1622483767028-3f66f32aef97"),
    isAvailable: true,
    variants: [
      { id: "var-coke-lata", label: "Lata 350ml", price: 6.5 },
      { id: "var-coke-2l", label: "Garrafa 2L", price: 14 },
    ],
  },
  {
    id: "dish-orange",
    categoryId: "cat-drinks",
    name: "Suco Natural de Laranja",
    description: "Espremido na hora, 100% natural e sem conservantes.",
    imageUrl: img("photo-1613478223719-2ab802602423"),
    isAvailable: true,
    variants: [{ id: "var-orange-1", label: "Copo 400ml", price: 9.9 }],
  },
  {
    id: "dish-brownie",
    categoryId: "cat-desserts",
    name: "Brownie c/ Nutella",
    description: "Brownie de chocolate 70%, nozes tostadas e cobertura generosa de Nutella.",
    imageUrl: img("photo-1606313564200-e75d5e30476c"),
    isAvailable: true,
    variants: [{ id: "var-brownie-1", label: "Fatia", price: 18.5 }],
  },
  {
    id: "dish-cheesecake",
    categoryId: "cat-desserts",
    name: "Cheesecake de Frutas Vermelhas",
    description: "Receita nova-iorquina com calda de framboesa, amora e morango frescos.",
    imageUrl: img("photo-1533134242443-d4fd215305ad"),
    isAvailable: true,
    variants: [{ id: "var-cheesecake-1", label: "Fatia", price: 21 }],
  },
];

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export type SeedItem = [dishId: string, variantId: string, quantity: number];

export function seedOrder(
  id: number,
  partial: Pick<Order, "status" | "createdAt" | "customer" | "fulfillment" | "address" | "paymentMethod" | "note"> & {
    items: SeedItem[];
  },
  trackingCode = `seed-${id}`,
): Order {
  const items = partial.items.map(([dishId, variantId, quantity]) => {
    const dish = SEED_DISHES.find((d) => d.id === dishId)!;
    const variant = dish.variants.find((v) => v.id === variantId)!;
    return {
      dishId,
      variantId,
      dishName: dish.name,
      variantLabel: variant.label,
      imageUrl: dish.imageUrl,
      unitPrice: variant.price,
      quantity,
      note: "",
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = partial.address ? (SEED_ZONES.find((z) => z.id === partial.address!.zoneId)?.fee ?? 0) : 0;

  return {
    ...partial,
    id,
    trackingCode,
    restaurantId: SEED_RESTAURANT.id,
    changeFor: null,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export const DEMO_STREETS = [
  "Rua Haddock Lobo",
  "Alameda Santos",
  "Rua Bela Cintra",
  "Rua Teodoro Sampaio",
  "Rua da Consolação",
  "Rua Augusta",
  "Alameda Lorena",
];

export function seedAddress(zone: Pick<DeliveryZone, "id" | "name">, index: number): NonNullable<Order["address"]> {
  return {
    zoneId: zone.id,
    zoneName: zone.name,
    cep: "01310100",
    street: DEMO_STREETS[index % DEMO_STREETS.length],
    number: String(120 + ((index * 37) % 1800)),
    complement: "",
    reference: "",
  };
}

type EarlierOrder = [
  minutes: number,
  name: string,
  zoneId: string | null,
  paymentMethod: Order["paymentMethod"],
  items: SeedItem[],
];

const EARLIER_TODAY: EarlierOrder[] = [
  [170, "Rafael Antunes", "zone-pinheiros", "CARD", [["dish-pepperoni", "var-pepperoni-g", 1], ["dish-coke", "var-coke-2l", 1]]],
  [155, "Camila Ferreira", "zone-jardins", "PIX", [["dish-smash", "var-smash-1", 2], ["dish-fries", "var-fries-1", 1]]],
  [140, "Thiago Moreira", null, "CASH", [["dish-bacon", "var-bacon-1", 1], ["dish-coke", "var-coke-lata", 1]]],
  [128, "Larissa Prado", "zone-consolacao", "PIX", [["dish-margherita", "var-margherita-m", 1], ["dish-brownie", "var-brownie-1", 1]]],
  [117, "Gustavo Ribeiro", "zone-bela-vista", "CARD", [["dish-truffle", "var-truffle-1", 1], ["dish-orange", "var-orange-1", 1]]],
  [104, "Patrícia Gomes", "zone-centro", "PIX", [["dish-bacon", "var-bacon-2", 2]]],
  [72, "Diego Carvalho", "zone-jardins", "CARD", [["dish-smash", "var-smash-2", 1], ["dish-cheesecake", "var-cheesecake-1", 1]]],
];

export function createRecentOrders(firstId: number): Order[] {
  const earlier = EARLIER_TODAY.map(([minutes, name, zoneId, paymentMethod, items], index) =>
    seedOrder(firstId + index, {
      status: "DELIVERED",
      createdAt: minutesAgo(minutes),
      customer: { name, phone: `119${81_000_000 + index * 731_337}` },
      fulfillment: zoneId ? "DELIVERY" : "PICKUP",
      address: zoneId ? seedAddress(SEED_ZONES.find((zone) => zone.id === zoneId)!, index) : null,
      paymentMethod,
      note: "",
      items,
    }),
  );
  const base = firstId + earlier.length;

  return [
    ...earlier,
    seedOrder(base + 6, {
      status: "PENDING",
      createdAt: minutesAgo(1),
      customer: { name: "Juliana Costa", phone: "11943218765" },
      fulfillment: "PICKUP",
      address: null,
      paymentMethod: "CARD",
      note: "",
      items: [
        ["dish-pepperoni", "var-pepperoni-m", 1],
        ["dish-orange", "var-orange-1", 1],
      ],
    }),
    seedOrder(base + 5, {
      status: "PENDING",
      createdAt: minutesAgo(4),
      customer: { name: "Carlos Eduardo Silva", phone: "11987654321" },
      fulfillment: "DELIVERY",
      address: {
        zoneId: "zone-centro",
        zoneName: "Centro",
        cep: "01001000",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 42",
        reference: "Próximo à praça central",
      },
      paymentMethod: "PIX",
      note: "Sem cebola no segundo hambúrguer, por favor.",
      items: [
        ["dish-smash", "var-smash-2", 2],
        ["dish-fries", "var-fries-1", 1],
        ["dish-coke", "var-coke-lata", 2],
      ],
    }),
    seedOrder(base + 4, {
      status: "CONFIRMED",
      createdAt: minutesAgo(18),
      customer: { name: "Mariana Souza", phone: "11976543210" },
      fulfillment: "DELIVERY",
      address: {
        zoneId: "zone-bela-vista",
        zoneName: "Bela Vista",
        cep: "01311200",
        street: "Av. Paulista",
        number: "1500",
        complement: "Bloco B, 12º andar",
        reference: "Edifício Horizon",
      },
      paymentMethod: "CARD",
      note: "Enviar talheres descartáveis.",
      items: [
        ["dish-bacon", "var-bacon-2", 1],
        ["dish-cheesecake", "var-cheesecake-1", 1],
      ],
    }),
    seedOrder(base + 3, {
      status: "CONFIRMED",
      createdAt: minutesAgo(25),
      customer: { name: "Pedro Henrique", phone: "11991234567" },
      fulfillment: "PICKUP",
      address: null,
      paymentMethod: "CASH",
      note: "",
      items: [["dish-margherita", "var-margherita-g", 1]],
    }),
    seedOrder(base + 2, {
      status: "IN_DELIVERY",
      createdAt: minutesAgo(41),
      customer: { name: "Lucas Mendes", phone: "11965432109" },
      fulfillment: "DELIVERY",
      address: {
        zoneId: "zone-jardins",
        zoneName: "Jardins",
        cep: "01426001",
        street: "Rua Oscar Freire",
        number: "850",
        complement: "Apto 302",
        reference: "Em frente à galeria",
      },
      paymentMethod: "PIX",
      note: "Tocar o interfone 302.",
      items: [
        ["dish-margherita", "var-margherita-g", 1],
        ["dish-orange", "var-orange-1", 2],
      ],
    }),
    seedOrder(base + 1, {
      status: "DELIVERED",
      createdAt: minutesAgo(95),
      customer: { name: "Beatriz Lima", phone: "11954321098" },
      fulfillment: "DELIVERY",
      address: {
        zoneId: "zone-centro",
        zoneName: "Centro",
        cep: "01304000",
        street: "Rua Augusta",
        number: "420",
        complement: "Casa 2",
        reference: "",
      },
      paymentMethod: "CARD",
      note: "",
      items: [
        ["dish-truffle", "var-truffle-1", 2],
        ["dish-brownie", "var-brownie-1", 2],
      ],
    }),
    seedOrder(base, {
      status: "CANCELLED",
      createdAt: minutesAgo(180),
      customer: { name: "Fernanda Rocha", phone: "11932109876" },
      fulfillment: "DELIVERY",
      address: {
        zoneId: "zone-consolacao",
        zoneName: "Consolação",
        cep: "01307000",
        street: "Rua Frei Caneca",
        number: "300",
        complement: "Apto 54",
        reference: "",
      },
      paymentMethod: "PIX",
      note: "Cancelado a pedido do cliente.",
      items: [["dish-smash", "var-smash-1", 1]],
    }),
  ];
}
