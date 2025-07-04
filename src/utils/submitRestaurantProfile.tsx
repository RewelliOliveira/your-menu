import { restaurantProfileApi } from "@/services/restaurant-profile-api";
import { restaurantHoursApi } from "@/services/restaurant-hours-api";

export async function submitRestaurantProfile({
    name,
    deliveryTimeMin,
    deliveryTimeMax,
    profilePicFile,
    bannerPicFile,
    weekdayStart,
    weekdayEnd,
    openingTime,
    closingTime,
    token,
}: {
    name: string;
    deliveryTimeMin: string;
    deliveryTimeMax: string;
    profilePicFile: File | null;
    bannerPicFile: File | null;
    weekdayStart: string;
    weekdayEnd: string;
    openingTime: string;
    closingTime: string;
    token: string;
}) {
    if (!weekdayStart || !weekdayEnd || !name || !deliveryTimeMin || !deliveryTimeMax || !openingTime || !closingTime) {
        throw new Error("Campos obrigatórios não preenchidos.");
    }

    const profileData = {
        name,
        deliveryTimeMin: parseInt(deliveryTimeMin),
        deliveryTimeMax: parseInt(deliveryTimeMax),
        profilePicFile,
        bannerPicFile,
    };

    const response = await restaurantProfileApi(profileData, token);
    const restaurantId = response.id;

    const scheduleData = {
        weekday_start: weekdayStart,
        weekday_end: weekdayEnd,
        openingTime,
        closingTime,
    };

    await restaurantHoursApi(restaurantId, scheduleData, token);
}
