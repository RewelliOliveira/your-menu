import { api } from "./api";
//POST
export interface DishSizeOption {
  sizeOptionId: number;
  price: number;
}

export interface CreateDishPayload {
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: DishSizeOption[];
  imgFile?: File | null;
}

export async function createDishApi(
  restaurantId: string,
  categoryId: number,
  data: CreateDishPayload,
  token: string
): Promise<any> {
  try {
    const formData = new FormData();
    const { imgFile, ...dto } = data;

    formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    if (imgFile) {
      formData.append("imageUrl", imgFile);
    }

    const response = await api.post(
      `/restaurant/${restaurantId}/category/${categoryId}/dish`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar prato:", error);
    throw error;
  }
}

//GET
export interface Prato {
  id: number;
  restaurantId: string;
  categoryId: number;
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: {
    dishSizeOptionId: number;
    sizeOptionId: number;
    magnitude: number | null;
    measureUnit: string;
    price: number;
  }[];
}

export async function getPratosPorCategoria(
  restaurantId: string,
  categoryId: number,
  token: string
): Promise<Prato[]> {
  try {
    const response = await api.get(`/restaurant/${restaurantId}/category/${categoryId}/dish`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pratos da categoria ${categoryId}:`, error);
    throw error;
  }
}