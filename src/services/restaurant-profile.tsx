import { api } from "./api";

interface RestaurantProfileApiProps {
    name: string,
    deliveryTimeMin: number,
    deliveryTimeMax: number,
}

export async function restaurantProfileApi(data: RestaurantProfileApiProps, token: string) {
  try {
    const response = await api.post("/restaurant", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar restaurante:", error);
    throw error;
  }
}
