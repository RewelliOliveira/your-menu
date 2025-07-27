import { api } from "./api";
//POST
export async function createCategoryApi(
  restaurantId: string,
  categoryName: string,
  token: string
): Promise<unknown> {
  try {
    const response = await api.post(
      `/restaurant/${restaurantId}/category`,
      {
        name: categoryName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
}
//GET
export interface CategoryApi {
  Id: number;
  name: string;
  restaurantId: string;
}

export async function getCategoriesApi(
  restaurantId: string,
  token: string
): Promise<CategoryApi[]> {
  try {
    const response = await api.get(`/restaurant/${restaurantId}/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
}

export async function deleteCategoryApi(
  restaurantId: string,
  categoryId: number,
  token: string
): Promise<void> {
  try {
    await api.delete(`/restaurant/${restaurantId}/category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    throw error;
  }
}