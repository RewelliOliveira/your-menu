import { api } from "./api";

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
      formData.append("file", imgFile);
    }

    const response = await api.post(
      `/restaurant/${restaurantId}/category/${categoryId}/dish`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar prato:", error);
    throw error;
  }
}
