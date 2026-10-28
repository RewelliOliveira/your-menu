import { WEEKDAYS } from "../../domain/business-hours";
import type { Category, Dish } from "../../types/menu";
import type { BusinessHours, DeliveryZone, Restaurant, RestaurantAddress } from "../../types/restaurant";

const img = (id: string, width = 600) => `https://images.unsplash.com/${id}?w=${width}&auto=format&fit=crop&q=80`;

export const DEMO_RESTAURANT: Restaurant = {
  id: "rest-demo",
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

export const DEMO_HOURS: BusinessHours[] = WEEKDAYS.map((weekday) => ({
  weekday,
  isOpen: true,
  openingTime: "00:00",
  closingTime: "00:00",
}));

export const DEMO_ADDRESS: RestaurantAddress = {
  cep: "01310-100",
  state: "SP",
  city: "São Paulo",
  district: "Bela Vista",
  street: "Avenida Paulista",
  number: "1000",
  complement: "Loja 04",
  reference: "Próximo ao MASP",
};

export const DEMO_ZONES: DeliveryZone[] = [
  { id: "zone-centro", name: "Centro", fee: 5 },
  { id: "zone-bela-vista", name: "Bela Vista", fee: 7 },
  { id: "zone-consolacao", name: "Consolação", fee: 6.5 },
  { id: "zone-jardins", name: "Jardins", fee: 9 },
  { id: "zone-pinheiros", name: "Pinheiros", fee: 12 },
];

export const DEMO_CATEGORIES: Category[] = [
  { id: "cat-burgers", name: "Hambúrgueres" },
  { id: "cat-pizzas", name: "Pizzas" },
  { id: "cat-sides", name: "Acompanhamentos" },
  { id: "cat-drinks", name: "Bebidas" },
  { id: "cat-desserts", name: "Sobremesas" },
];

export const DEMO_DISHES: Dish[] = [
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

export const DEMO_STREETS = [
  "Rua Haddock Lobo",
  "Alameda Santos",
  "Rua Bela Cintra",
  "Rua Teodoro Sampaio",
  "Rua da Consolação",
  "Rua Augusta",
  "Alameda Lorena",
];

export const FIRST_NAMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elisa",
  "Felipe",
  "Gabriela",
  "Heitor",
  "Isabela",
  "João",
  "Larissa",
  "Marcos",
  "Natália",
  "Otávio",
  "Paula",
  "Rafael",
  "Sofia",
  "Tiago",
];

export const LAST_NAMES = ["Silva", "Souza", "Oliveira", "Santos", "Lima", "Costa", "Almeida", "Ferreira", "Ribeiro", "Martins"];
