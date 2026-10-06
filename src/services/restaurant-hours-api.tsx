import {
  mockGetRestaurantHours,
  mockUpdateRestaurantHours,
} from "@/mocks/restaurant";

export interface RestaurantHour {
  id_businessHours: string;
  weekday: string;
  openingTime: string | null;
  closingTime: string | null;
}

export type RestaurantHoursApiResponse = RestaurantHour[];

interface RestaurantHoursApiProps {
  weekday_start: string;
  weekday_end: string;
  openingTime: string;
  closingTime: string;
}

export async function restaurantHoursApi(
  _restaurantId: string,
  data: RestaurantHoursApiProps,
  _token?: string
): Promise<RestaurantHoursApiResponse> {
  const hours = await mockUpdateRestaurantHours(
    data.weekday_start,
    data.weekday_end,
    data.openingTime,
    data.closingTime
  );
  return hours;
}

export async function getRestaurantHoursApi(
  _restaurantId: string,
  _token?: string
): Promise<RestaurantHoursApiResponse> {
  const hours = await mockGetRestaurantHours();
  return hours;
}
