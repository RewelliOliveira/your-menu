import { api } from "./api";

export interface RestaurantHour {
  id_businessHours: string;
  weekday: string;
  openingTime: string | null;
  closingTime: string | null;
}

export type RestaurantHoursApiResponse = RestaurantHour[];
// PUT 
interface RestaurantHoursApiProps {
  weekday_start: string;
  weekday_end: string;
  openingTime: string;
  closingTime: string;
}

export async function restaurantHoursApi(
  restaurantId: string,
  data: RestaurantHoursApiProps,
  token: string
): Promise<RestaurantHoursApiResponse> {
  try {
    const response = await api.put(`/business-hours/${restaurantId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as RestaurantHoursApiResponse;
  } catch (error) {
    console.error("Erro ao passar dias da semana:", error);
    throw error;
  }
}

// GET
export async function getRestaurantHoursApi(
  restaurantId: string,
  token: string
): Promise<RestaurantHoursApiResponse> {
  try {
    const response = await api.get(`/business-hours/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as RestaurantHoursApiResponse;
  } catch (error) {
    console.error("Erro ao buscar dias e horários do restaurante:", error);
    throw error;
  }
}
