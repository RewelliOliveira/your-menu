import { api } from "./api";

interface RestaurantAdress {
  restaurantId: string;
  cep: number;
  state: string;
  city: string;
  street: string;
  number: number;
  district: string;
  complement: string | null;
  reference: string | null;
}

export async function restaurantAdress(data: RestaurantAdress, token: string) {
  try {
    const response = await api.post("/restaurantAdress", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar endereço do restaurante:", error);
    throw error;
  }
}
