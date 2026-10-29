import type { Order } from "../../types/order";
import type { DeliveryZone } from "../../types/restaurant";
import { createId } from "../../utils/id";
import { DEMO_DISHES, DEMO_RESTAURANT, DEMO_STREETS, DEMO_ZONES } from "./demo-catalog";

type SeedItem = [dishId: string, variantId: string, quantity: number];

type SeedOrderInput = Pick<Order, "status" | "createdAt" | "customer" | "fulfillment" | "address" | "paymentMethod" | "note"> & {
  items: SeedItem[];
};

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

function seedOrder(id: number, input: SeedOrderInput): Order {
  const items = input.items.map(([dishId, variantId, quantity]) => {
    const dish = DEMO_DISHES.find((d) => d.id === dishId)!;
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
  const deliveryFee = input.address ? (DEMO_ZONES.find((z) => z.id === input.address!.zoneId)?.fee ?? 0) : 0;

  return {
    ...input,
    id,
    trackingCode: createId(),
    restaurantId: DEMO_RESTAURANT.id,
    changeFor: null,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

function seedAddress(zone: Pick<DeliveryZone, "id" | "name">, index: number): NonNullable<Order["address"]> {
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

type EarlierOrder = [minutes: number, name: string, zoneId: string | null, paymentMethod: Order["paymentMethod"], items: SeedItem[]];

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
      address: zoneId ? seedAddress(DEMO_ZONES.find((zone) => zone.id === zoneId)!, index) : null,
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
