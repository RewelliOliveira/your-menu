import {
  RestaurantAddress,
  RestaurantAddressPayload,
  RestaurantHours,
  RestaurantHoursPayload,
  RestaurantProfile,
  RestaurantProfilePayload,
} from "@/core/types/restaurant-types";
import {
  mockGetRestaurantAddress,
  mockGetRestaurantHours,
  mockGetRestaurantLink,
  mockGetRestaurantProfile,
  mockToggleRestaurantOpenStatus,
  mockUpdateRestaurantAddress,
  mockUpdateRestaurantHours,
  mockUpdateRestaurantProfile,
} from "../mocks/restaurant-mock";

export async function getRestaurantProfileApi(_token?: string): Promise<RestaurantProfile> {
  return await mockGetRestaurantProfile();
}

export async function updateRestaurantProfileApi(
  _restaurantId: string,
  data: RestaurantProfilePayload,
  _token?: string
): Promise<RestaurantProfile> {
  return await mockUpdateRestaurantProfile(data);
}

export async function restaurantProfileApi(
  data: RestaurantProfilePayload,
  _token?: string
): Promise<RestaurantProfile> {
  return await mockUpdateRestaurantProfile(data);
}

export async function toggleRestaurantOpenStatusApi(
  _restaurantId: string,
  isOpen: boolean,
  _token?: string
): Promise<{ success: boolean; isOpen: boolean }> {
  return await mockToggleRestaurantOpenStatus(isOpen);
}

export async function getRestaurantHoursApi(
  _restaurantId: string,
  _token?: string
): Promise<RestaurantHours[]> {
  return await mockGetRestaurantHours();
}

export async function restaurantHoursApi(
  _restaurantId: string,
  data: RestaurantHoursPayload,
  _token?: string
): Promise<RestaurantHours[]> {
  return await mockUpdateRestaurantHours(
    data.weekday_start,
    data.weekday_end,
    data.openingTime,
    data.closingTime
  );
}

export async function getRestaurantAddressApi(
  _restaurantId: string,
  _token?: string
): Promise<RestaurantAddress> {
  return await mockGetRestaurantAddress();
}

export async function saveRestaurantAddressApi(
  data: RestaurantAddressPayload,
  _token?: string
): Promise<RestaurantAddress> {
  return await mockUpdateRestaurantAddress(data);
}

export async function updateRestaurantAddressApi(
  data: RestaurantAddressPayload,
  _token?: string
): Promise<RestaurantAddress> {
  return await mockUpdateRestaurantAddress(data);
}

export async function getRestaurantLinkApi(
  restaurantId: string,
  _token?: string
): Promise<{ link: string }> {
  return await mockGetRestaurantLink(restaurantId);
}
