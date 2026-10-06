export interface MockCategory {
  Id: number;
  name: string;
  restaurantId: string;
}

export interface MockSizeOption {
  id: number;
  magnitude: string;
  measureUnit: string;
  abbreviation: string;
}

export interface MockDishSizeOptionPrice {
  dishSizeOptionId: number;
  sizeOptionId: number;
  magnitude: number | null;
  measureUnit: string;
  price: number;
}

export interface MockDish {
  id: number;
  restaurantId: string;
  categoryId: number;
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: MockDishSizeOptionPrice[];
}

export const INITIAL_MOCK_CATEGORIES: MockCategory[] = [
  { Id: 1, name: "Hambúrgueres", restaurantId: "rest-mock-123" },
  { Id: 2, name: "Pizzas", restaurantId: "rest-mock-123" },
  { Id: 3, name: "Acompanhamentos", restaurantId: "rest-mock-123" },
  { Id: 4, name: "Bebidas", restaurantId: "rest-mock-123" },
  { Id: 5, name: "Sobremesas", restaurantId: "rest-mock-123" },
];

export const INITIAL_MOCK_SIZE_OPTIONS: MockSizeOption[] = [
  { id: 1, magnitude: "Individual", measureUnit: "UN", abbreviation: "IND" },
  { id: 2, magnitude: "Médio", measureUnit: "UN", abbreviation: "M" },
  { id: 3, magnitude: "Grande", measureUnit: "UN", abbreviation: "G" },
  { id: 4, magnitude: "350", measureUnit: "ML", abbreviation: "350ml" },
  { id: 5, magnitude: "2", measureUnit: "L", abbreviation: "2L" },
  { id: 6, magnitude: "Porção", measureUnit: "300g", abbreviation: "300g" },
];

export const INITIAL_MOCK_DISHES: MockDish[] = [
  // Hambúrgueres
  {
    id: 101,
    restaurantId: "rest-mock-123",
    categoryId: 1,
    name: "Smash Burger Clássico",
    description: "Blend bovino 160g prensado, queijo cheddar inglês derretido, cebola caramelizada, picles artesanal e molho da casa em pão brioche dourado.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 1001, sizeOptionId: 1, magnitude: 1, measureUnit: "IND", price: 28.90 },
      { dishSizeOptionId: 1002, sizeOptionId: 2, magnitude: 2, measureUnit: "Duplo", price: 36.90 },
    ],
  },
  {
    id: 102,
    restaurantId: "rest-mock-123",
    categoryId: 1,
    name: "Bacon Crispy Supreme",
    description: "Dois smash burgers de 120g, fatias generosas de bacon crocante, queijo gouda, maionese defumada e cebola crispy no pão australiano tostado.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 1003, sizeOptionId: 1, magnitude: 1, measureUnit: "IND", price: 34.50 },
      { dishSizeOptionId: 1004, sizeOptionId: 2, magnitude: 2, measureUnit: "Combo c/ Fritas", price: 44.90 },
    ],
  },
  {
    id: 103,
    restaurantId: "rest-mock-123",
    categoryId: 1,
    name: "Truffled Monster Burger",
    description: "Blend Angus 200g, queijo brie maçaricado, cogumelos salteados, rúcula fresca e maionese trufada no pão de brioche artesanal.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 1005, sizeOptionId: 1, magnitude: 1, measureUnit: "IND", price: 42.00 },
    ],
  },

  // Pizzas
  {
    id: 201,
    restaurantId: "rest-mock-123",
    categoryId: 2,
    name: "Pizza Margherita Especial",
    description: "Molho de tomate San Marzano artesanal, mozzarella de búfala fatiada, folhas frescas de manjericão orgânico e azeite extravirgem.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 2001, sizeOptionId: 2, magnitude: null, measureUnit: "M (6 fatias)", price: 48.00 },
      { dishSizeOptionId: 2002, sizeOptionId: 3, magnitude: null, measureUnit: "G (8 fatias)", price: 62.00 },
    ],
  },
  {
    id: 202,
    restaurantId: "rest-mock-123",
    categoryId: 2,
    name: "Pizza Pepperoni & Honey",
    description: "Molho rústico da casa, mozzarella derretida, fatias crocantes de pepperoni artesanal e fio especial de mel picante para finalizar.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 2003, sizeOptionId: 2, magnitude: null, measureUnit: "M (6 fatias)", price: 54.00 },
      { dishSizeOptionId: 2004, sizeOptionId: 3, magnitude: null, measureUnit: "G (8 fatias)", price: 69.90 },
    ],
  },

  // Acompanhamentos
  {
    id: 301,
    restaurantId: "rest-mock-123",
    categoryId: 3,
    name: "Batata Rústica c/ Alecrim",
    description: "Batatas rústicas cortadas à mão, douradas e crocantes, temperadas com sal marinho, alecrim fresco e páprica defumada. Acompanha maionese verde.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 3001, sizeOptionId: 6, magnitude: 300, measureUnit: "300g", price: 19.90 },
    ],
  },
  {
    id: 302,
    restaurantId: "rest-mock-123",
    categoryId: 3,
    name: "Onion Rings Empanadas",
    description: "Anéis de cebola doce empanados em massa crocante temperada com cerveja. Acompanha molho barbecue artesanal.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1639024471285-0afc3831652c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 3002, sizeOptionId: 6, magnitude: 250, measureUnit: "250g", price: 22.00 },
    ],
  },

  // Bebidas
  {
    id: 401,
    restaurantId: "rest-mock-123",
    categoryId: 4,
    name: "Coca-Cola Original",
    description: "Refrigerante Coca-Cola super gelado para acompanhar seu pedido.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 4001, sizeOptionId: 4, magnitude: 350, measureUnit: "Lata 350ml", price: 6.50 },
      { dishSizeOptionId: 4002, sizeOptionId: 5, magnitude: 2, measureUnit: "Garrafa 2L", price: 14.00 },
    ],
  },
  {
    id: 402,
    restaurantId: "rest-mock-123",
    categoryId: 4,
    name: "Suco Natural de Laranja",
    description: "Suco de laranja espremido na hora, 100% natural, sem conservantes e sem adição de água ou açúcar.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 4003, sizeOptionId: 4, magnitude: 400, measureUnit: "Copo 400ml", price: 9.90 },
    ],
  },

  // Sobremesas
  {
    id: 501,
    restaurantId: "rest-mock-123",
    categoryId: 5,
    name: "Brownie Artesanal c/ Nutella",
    description: "Brownie quentinho e molhadinho de chocolate nobre 70%, nozes tostadas e generosa cobertura de Nutella cremosa.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 5001, sizeOptionId: 1, magnitude: 1, measureUnit: "Fatia", price: 18.50 },
    ],
  },
  {
    id: 502,
    restaurantId: "rest-mock-123",
    categoryId: 5,
    name: "Cheesecake de Frutas Vermelhas",
    description: "Receita clássica nova-iorquina com base amanteigada crocante e calda de framboesas, amoras e morangos frescos.",
    isAvailable: true,
    imgUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: [
      { dishSizeOptionId: 5002, sizeOptionId: 1, magnitude: 1, measureUnit: "Fatia", price: 21.00 },
    ],
  },
];

const CATEGORIES_KEY = "your_menu_mock_categories";
const DISHES_KEY = "your_menu_mock_dishes";

function getStoredCategories(): MockCategory[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao ler categorias do localStorage:", e);
  }
  return INITIAL_MOCK_CATEGORIES;
}

function saveCategories(categories: MockCategory[]) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn("Erro ao salvar categorias no localStorage:", e);
  }
}

function getStoredDishes(): MockDish[] {
  try {
    const raw = localStorage.getItem(DISHES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao ler pratos do localStorage:", e);
  }
  return INITIAL_MOCK_DISHES;
}

function saveDishes(dishes: MockDish[]) {
  try {
    localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
  } catch (e) {
    console.warn("Erro ao salvar pratos no localStorage:", e);
  }
}

// ========================
// Categorias
// ========================

export async function mockGetCategories(restaurantId?: string): Promise<MockCategory[]> {
  await new Promise((r) => setTimeout(r, 150));
  const list = getStoredCategories();
  if (!restaurantId) return list;
  return list;
}

export async function mockCreateCategory(restaurantId: string, name: string): Promise<MockCategory> {
  await new Promise((r) => setTimeout(r, 150));
  const categories = getStoredCategories();
  const nextId = categories.length ? Math.max(...categories.map((c) => c.Id)) + 1 : 1;
  const newCat: MockCategory = {
    Id: nextId,
    name,
    restaurantId: restaurantId || "rest-mock-123",
  };
  categories.push(newCat);
  saveCategories(categories);
  return newCat;
}

export async function mockDeleteCategory(categoryId: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 150));
  const categories = getStoredCategories().filter((c) => c.Id !== categoryId);
  saveCategories(categories);
  // Remove também pratos da categoria
  const dishes = getStoredDishes().filter((d) => d.categoryId !== categoryId);
  saveDishes(dishes);
}

// ========================
// Opções de Tamanho
// ========================

export async function mockGetSizeOptions(): Promise<MockSizeOption[]> {
  await new Promise((r) => setTimeout(r, 100));
  return INITIAL_MOCK_SIZE_OPTIONS;
}

// ========================
// Pratos / Produtos
// ========================

export async function mockGetDishesByCategory(categoryId: number): Promise<MockDish[]> {
  await new Promise((r) => setTimeout(r, 150));
  const dishes = getStoredDishes();
  return dishes.filter((d) => d.categoryId === categoryId);
}

export async function mockGetAllDishes(): Promise<MockDish[]> {
  await new Promise((r) => setTimeout(r, 150));
  return getStoredDishes();
}

export async function mockGetDishById(dishId: number): Promise<MockDish | null> {
  await new Promise((r) => setTimeout(r, 150));
  const dishes = getStoredDishes();
  return dishes.find((d) => d.id === dishId) || null;
}

export interface CreateDishInput {
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: { sizeOptionId: number; price: number }[];
  imgFile?: File | null;
}

export async function mockCreateDish(
  restaurantId: string,
  categoryId: number,
  data: CreateDishInput
): Promise<MockDish> {
  await new Promise((r) => setTimeout(r, 200));
  const dishes = getStoredDishes();
  const nextId = dishes.length ? Math.max(...dishes.map((d) => d.id)) + 1 : 101;

  // Monta tamanhos formatados
  const formattedSizes: MockDishSizeOptionPrice[] = (data.sizeOptionsPrices || []).map((s, idx) => {
    const sizeOpt = INITIAL_MOCK_SIZE_OPTIONS.find((opt) => opt.id === s.sizeOptionId);
    return {
      dishSizeOptionId: nextId * 10 + idx,
      sizeOptionId: s.sizeOptionId,
      magnitude: sizeOpt ? (isNaN(Number(sizeOpt.magnitude)) ? null : Number(sizeOpt.magnitude)) : null,
      measureUnit: sizeOpt?.abbreviation || "UN",
      price: s.price,
    };
  });

  const newDish: MockDish = {
    id: nextId,
    restaurantId: restaurantId || "rest-mock-123",
    categoryId,
    name: data.name,
    description: data.description,
    isAvailable: data.isAvailable,
    imgUrl: data.imgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    sizeOptionsPrices: formattedSizes,
  };

  dishes.push(newDish);
  saveDishes(dishes);
  return newDish;
}

export async function mockUpdateDish(
  dishId: number,
  categoryId: number,
  data: CreateDishInput
): Promise<MockDish> {
  await new Promise((r) => setTimeout(r, 200));
  const dishes = getStoredDishes();
  const index = dishes.findIndex((d) => d.id === dishId);

  const formattedSizes: MockDishSizeOptionPrice[] = (data.sizeOptionsPrices || []).map((s, idx) => {
    const sizeOpt = INITIAL_MOCK_SIZE_OPTIONS.find((opt) => opt.id === s.sizeOptionId);
    return {
      dishSizeOptionId: dishId * 10 + idx,
      sizeOptionId: s.sizeOptionId,
      magnitude: sizeOpt ? (isNaN(Number(sizeOpt.magnitude)) ? null : Number(sizeOpt.magnitude)) : null,
      measureUnit: sizeOpt?.abbreviation || "UN",
      price: s.price,
    };
  });

  const updatedDish: MockDish = {
    id: dishId,
    restaurantId: "rest-mock-123",
    categoryId,
    name: data.name,
    description: data.description,
    isAvailable: data.isAvailable,
    imgUrl: data.imgUrl || dishes[index]?.imgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
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
  await new Promise((r) => setTimeout(r, 150));
  const dishes = getStoredDishes().filter((d) => d.id !== dishId);
  saveDishes(dishes);
}

