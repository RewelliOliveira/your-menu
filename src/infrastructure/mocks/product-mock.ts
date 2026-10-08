import { Category } from "@/core/types/category-types";
import { Dish, DishFormPayload, DishSizePrice, SizeOption } from "@/core/types/dish-types";

export const INITIAL_MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Hambúrgueres", restaurantId: "rest-mock-123" },
  { id: 2, name: "Pizzas", restaurantId: "rest-mock-123" },
  { id: 3, name: "Acompanhamentos", restaurantId: "rest-mock-123" },
  { id: 4, name: "Bebidas", restaurantId: "rest-mock-123" },
  { id: 5, name: "Sobremesas", restaurantId: "rest-mock-123" },
];

export const INITIAL_MOCK_SIZE_OPTIONS: SizeOption[] = [
  { id: 1, magnitude: "Individual", measureUnit: "UN", abbreviation: "IND" },
  { id: 2, magnitude: "Médio", measureUnit: "UN", abbreviation: "M" },
  { id: 3, magnitude: "Grande", measureUnit: "UN", abbreviation: "G" },
  { id: 4, magnitude: "350", measureUnit: "ML", abbreviation: "350ml" },
  { id: 5, magnitude: "2", measureUnit: "L", abbreviation: "2L" },
  { id: 6, magnitude: "Porção", measureUnit: "300g", abbreviation: "300g" },
];

export const INITIAL_MOCK_DISHES: Dish[] = [
  {
    id: 101,
    restaurantId: "rest-mock-123",
    categoryId: 1,
    name: "Smash Burger Clássico",
    description:
      "Blend bovino 160g prensado, queijo cheddar inglês derretido, cebola caramelizada, picles artesanal e molho da casa em pão brioche dourado.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 1001, sizeOptionId: 1, magnitude: 1, measureUnit: "IND", price: 28.9 },
      { dishSizeOptionId: 1002, sizeOptionId: 2, magnitude: 2, measureUnit: "Duplo", price: 36.9 },
    ],
  },
  {
    id: 102,
    restaurantId: "rest-mock-123",
    categoryId: 1,
    name: "Bacon Crispy Supreme",
    description:
      "Dois smash burgers de 120g, fatias generosas de bacon crocante, queijo gouda, maionese defumada e cebola crispy no pão australiano tostado.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 1003, sizeOptionId: 1, magnitude: 1, measureUnit: "IND", price: 34.5 },
      { dishSizeOptionId: 1004, sizeOptionId: 2, magnitude: 2, measureUnit: "Combo c/ Fritas", price: 44.9 },
    ],
  },
  {
    id: 103,
    restaurantId: "rest-mock-123",
    categoryId: 1,
    name: "Truffled Monster Burger",
    description:
      "Blend Angus 200g, queijo brie maçaricado, cogumelos salteados, rúcula fresca e maionese trufada no pão de brioche artesanal.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 1005, sizeOptionId: 1, magnitude: 1, measureUnit: "IND", price: 42.0 },
    ],
  },
  {
    id: 201,
    restaurantId: "rest-mock-123",
    categoryId: 2,
    name: "Pizza Margherita Especial",
    description:
      "Molho de tomate San Marzano artesanal, mozzarella de búfala fatiada, folhas frescas de manjericão orgânico e azeite extravirgem.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 2001, sizeOptionId: 2, magnitude: null, measureUnit: "M (6 fatias)", price: 48.0 },
      { dishSizeOptionId: 2002, sizeOptionId: 3, magnitude: null, measureUnit: "G (8 fatias)", price: 62.0 },
    ],
  },
  {
    id: 202,
    restaurantId: "rest-mock-123",
    categoryId: 2,
    name: "Pizza Pepperoni & Honey",
    description:
      "Molho rústico da casa, mozzarella derretida, fatias crocantes de pepperoni artesanal e fio especial de mel picante para finalizar.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 2003, sizeOptionId: 2, magnitude: null, measureUnit: "M (6 fatias)", price: 54.0 },
      { dishSizeOptionId: 2004, sizeOptionId: 3, magnitude: null, measureUnit: "G (8 fatias)", price: 69.9 },
    ],
  },
  {
    id: 301,
    restaurantId: "rest-mock-123",
    categoryId: 3,
    name: "Batata Rústica c/ Alecrim",
    description:
      "Batatas rústicas cortadas à mão, douradas e crocantes, temperadas com sal marinho, alecrim fresco e páprica defumada. Acompanha maionese verde.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 3001, sizeOptionId: 6, magnitude: 300, measureUnit: "300g", price: 19.9 },
    ],
  },
  {
    id: 302,
    restaurantId: "rest-mock-123",
    categoryId: 3,
    name: "Onion Rings Empanadas",
    description:
      "Anéis de cebola doce empanados em massa crocante temperada com cerveja. Acompanha molho barbecue artesanal.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1639024471285-0afc3831652c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 3002, sizeOptionId: 6, magnitude: 250, measureUnit: "250g", price: 22.0 },
    ],
  },
  {
    id: 401,
    restaurantId: "rest-mock-123",
    categoryId: 4,
    name: "Coca-Cola Original",
    description: "Refrigerante Coca-Cola super gelado para acompanhar seu pedido.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 4001, sizeOptionId: 4, magnitude: 350, measureUnit: "Lata 350ml", price: 6.5 },
      { dishSizeOptionId: 4002, sizeOptionId: 5, magnitude: 2, measureUnit: "Garrafa 2L", price: 14.0 },
    ],
  },
  {
    id: 402,
    restaurantId: "rest-mock-123",
    categoryId: 4,
    name: "Suco Natural de Laranja",
    description: "Suco de laranja espremido na hora, 100% natural, sem conservantes.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 4003, sizeOptionId: 4, magnitude: 400, measureUnit: "Copo 400ml", price: 9.9 },
    ],
  },
  {
    id: 501,
    restaurantId: "rest-mock-123",
    categoryId: 5,
    name: "Brownie Artesanal c/ Nutella",
    description: "Brownie de chocolate nobre 70%, nozes tostadas e generosa cobertura de Nutella cremosa.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 5001, sizeOptionId: 1, magnitude: 1, measureUnit: "Fatia", price: 18.5 },
    ],
  },
  {
    id: 502,
    restaurantId: "rest-mock-123",
    categoryId: 5,
    name: "Cheesecake de Frutas Vermelhas",
    description: "Receita clássica nova-iorquina com calda de framboesas, amoras e morangos frescos.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 5002, sizeOptionId: 1, magnitude: 1, measureUnit: "Fatia", price: 21.0 },
    ],
  },
];

const CATEGORIES_KEY = "your_menu_mock_categories";
const DISHES_KEY = "your_menu_mock_dishes";

function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_CATEGORIES;
}

function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch {
    void 0;
  }
}

function getStoredDishes(): Dish[] {
  try {
    const raw = localStorage.getItem(DISHES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_DISHES;
}

function saveDishes(dishes: Dish[]): void {
  try {
    localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
  } catch {
    void 0;
  }
}

export async function mockGetCategories(restaurantId?: string): Promise<Category[]> {
  await new Promise((r) => setTimeout(r, 120));
  const list = getStoredCategories();
  if (!restaurantId) return list;
  return list;
}

export async function mockCreateCategory(restaurantId: string, name: string): Promise<Category> {
  await new Promise((r) => setTimeout(r, 120));
  const categories = getStoredCategories();
  const nextId = categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
  const newCat: Category = {
    id: nextId,
    name,
    restaurantId: restaurantId || "rest-mock-123",
  };
  categories.push(newCat);
  saveCategories(categories);
  return newCat;
}

export async function mockDeleteCategory(categoryId: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 120));
  const categories = getStoredCategories().filter((c) => c.id !== categoryId);
  saveCategories(categories);
  const dishes = getStoredDishes().filter((d) => d.categoryId !== categoryId);
  saveDishes(dishes);
}

export async function mockGetSizeOptions(): Promise<SizeOption[]> {
  await new Promise((r) => setTimeout(r, 80));
  return INITIAL_MOCK_SIZE_OPTIONS;
}

export async function mockGetDishesByCategory(categoryId: number): Promise<Dish[]> {
  await new Promise((r) => setTimeout(r, 120));
  const dishes = getStoredDishes();
  return dishes.filter((d) => d.categoryId === categoryId);
}

export async function mockGetAllDishes(): Promise<Dish[]> {
  await new Promise((r) => setTimeout(r, 120));
  return getStoredDishes();
}

export async function mockGetDishById(dishId: number): Promise<Dish | null> {
  await new Promise((r) => setTimeout(r, 100));
  const dishes = getStoredDishes();
  return dishes.find((d) => d.id === dishId) || null;
}

export async function mockCreateDish(
  restaurantId: string,
  categoryId: number,
  data: DishFormPayload
): Promise<Dish> {
  await new Promise((r) => setTimeout(r, 150));
  const dishes = getStoredDishes();
  const nextId = dishes.length ? Math.max(...dishes.map((d) => d.id)) + 1 : 101;

  const formattedSizes: DishSizePrice[] = (data.sizeOptionsPrices || []).map((s, idx) => {
    const sizeOpt = INITIAL_MOCK_SIZE_OPTIONS.find((opt) => opt.id === s.sizeOptionId);
    return {
      dishSizeOptionId: nextId * 10 + idx,
      sizeOptionId: s.sizeOptionId,
      magnitude: sizeOpt ? (isNaN(Number(sizeOpt.magnitude)) ? null : Number(sizeOpt.magnitude)) : null,
      measureUnit: sizeOpt?.abbreviation || "UN",
      price: s.price,
    };
  });

  const newDish: Dish = {
    id: nextId,
    restaurantId: restaurantId || "rest-mock-123",
    categoryId,
    name: data.name,
    description: data.description,
    isAvailable: data.isAvailable,
    imgUrl:
      data.imgUrl ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: formattedSizes,
  };

  dishes.push(newDish);
  saveDishes(dishes);
  return newDish;
}

export async function mockUpdateDish(
  dishId: number,
  categoryId: number,
  data: DishFormPayload
): Promise<Dish> {
  await new Promise((r) => setTimeout(r, 150));
  const dishes = getStoredDishes();
  const index = dishes.findIndex((d) => d.id === dishId);

  const formattedSizes: DishSizePrice[] = (data.sizeOptionsPrices || []).map((s, idx) => {
    const sizeOpt = INITIAL_MOCK_SIZE_OPTIONS.find((opt) => opt.id === s.sizeOptionId);
    return {
      dishSizeOptionId: dishId * 10 + idx,
      sizeOptionId: s.sizeOptionId,
      magnitude: sizeOpt ? (isNaN(Number(sizeOpt.magnitude)) ? null : Number(sizeOpt.magnitude)) : null,
      measureUnit: sizeOpt?.abbreviation || "UN",
      price: s.price,
    };
  });

  const updatedDish: Dish = {
    id: dishId,
    restaurantId: "rest-mock-123",
    categoryId,
    name: data.name,
    description: data.description,
    isAvailable: data.isAvailable,
    imgUrl:
      data.imgUrl ||
      dishes[index]?.imgUrl ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: formattedSizes,
  };

  if (index !== -1) {
    dishes[index] = updatedDish;
  } else {
    dishes.push(updatedDish);
  }

  saveDishes(dishes);
  return updatedDish;
}

export async function mockDeleteDish(dishId: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 120));
  const dishes = getStoredDishes().filter((d) => d.id !== dishId);
  saveDishes(dishes);
}
