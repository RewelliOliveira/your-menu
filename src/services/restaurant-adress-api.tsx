import { api } from "./api";
//Post
interface RestaurantAdressApiProps {
  restaurantId: string;
  cep: string;
  state: string;
  city: string;
  street: string;
  number: number;
  district: string;
  complement: string | null;
  reference: string | null;
}

export async function restaurantAdressApi(data: RestaurantAdressApiProps, token: string) {
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

//GET
export async function getRestaurantAdressApi(restaurantId: string, token: string) {
  try {
    const response = await api.get(`/restaurantAdress/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar endereço do restaurante:", error);
    throw error;
  }
}
//PUT
export async function updateRestaurantAdressApi(data: RestaurantAdressApiProps, token: string) {
  try {
    const response = await api.put("/restaurantAdress", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar endereço do restaurante:", error);
    throw error;
  }
}
