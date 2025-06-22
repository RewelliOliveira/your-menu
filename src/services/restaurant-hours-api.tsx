import { api } from "./api";

interface RestaurantHoursApiProps {
    weekday_start: string,
    weekday_end: string,
    openingTime: string,
    closingTime: string
}

export async function restaurantHoursApi(restaurantId: string, data: RestaurantHoursApiProps, token: string) {
    try {
        const response = await api.post(`/business-hours/${restaurantId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao passar dias da semana:", error);
        throw error;
    }
}
