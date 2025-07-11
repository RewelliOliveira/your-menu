import { AxiosError } from "axios";
import { api } from "./api";

export async function toggleRestaurantOpenStatusApi(
  restaurantId: string,
  isOpen: boolean,
  token: string
) {
  try {
    const response = await api.patch(`/restaurant/is-open/${restaurantId}`, { isOpen }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Erro axios:", error.response?.data || error.message);
    } else {
      console.error("Erro desconhecido:", error);
    }
    throw error;
  }
}
