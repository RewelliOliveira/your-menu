import { api } from "./api";

export async function createCategoryApi(
  restaurantId: string,
  categoryName: string,
  token: string
): Promise<any> {
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
