import { api } from "./api";

export interface DishSizeOption {
  sizeOptionId: number;
  price: number;
}

export interface UpdateDishPayload {
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: DishSizeOption[];
  imgFile?: File | null;
}

export async function updateDishApi(
  restaurantId: string,
  categoryId: number,
  dishId: number,
  data: UpdateDishPayload,
  token: string
): Promise<any> {
  try {
    const formData = new FormData();
    const { imgFile, ...dto } = data;

    formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    if (imgFile) {
      formData.append("imageUrl", imgFile);
    }

    const response = await api.put(
      `/restaurant/${restaurantId}/category/${categoryId}/dish/${dishId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar prato:", error);
    throw error;
  }
}
