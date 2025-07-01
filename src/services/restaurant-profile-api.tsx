import { api } from "./api";

interface RestaurantProfileApiProps {
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  profilePicFile: File | null;
  bannerPicFile: File | null;
}

export interface RestaurantApiResponse {
  closingTime: any;
  openingTime(openingTime: any): unknown;
  id: string;
  slug: string;
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  profilePicUrl: string | null;
  bannerPicUrl: string | null;
}

// POST
export async function restaurantProfileApi(
  data: RestaurantProfileApiProps,
  token: string
): Promise<RestaurantApiResponse> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("deliveryTimeMin", data.deliveryTimeMin.toString());
    formData.append("deliveryTimeMax", data.deliveryTimeMax.toString());

    if (data.profilePicFile) {
      formData.append("profilePic", data.profilePicFile);
    }
    if (data.bannerPicFile) {
      formData.append("bannerPic", data.bannerPicFile);
    }

    const response = await api.post("/restaurant", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as RestaurantApiResponse;

  } catch (error) {
    console.error("Erro ao cadastrar restaurante:", error);
    throw error;
  }
}

// GET
export async function getRestaurantProfileApi(token: string): Promise<RestaurantApiResponse> {
  try {
    const response = await api.get("/restaurant", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as RestaurantApiResponse;
  } catch (error) {
    console.error("Erro ao buscar perfil do restaurante:", error);
    throw error;
  }
}