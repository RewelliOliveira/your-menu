import {
  mockGetRestaurantAddress,
  mockUpdateRestaurantAddress,
  mockGetRestaurantLink,
} from "@/mocks/restaurant";

export interface RestaurantAdressApiProps {
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

export async function restaurantAdressApi(
  data: RestaurantAdressApiProps,
  _token?: string
) {
  const address = await mockUpdateRestaurantAddress(data);
  return address;
}

export async function getRestaurantAdressApi(
  _restaurantId: string,
  _token?: string
) {
  const address = await mockGetRestaurantAddress();
  return address;
}

export async function getRestaurantLinkApi(
  restaurantId: string,
  _token?: string
) {
  return await mockGetRestaurantLink(restaurantId);
}

export async function updateRestaurantAdressApi(
  data: RestaurantAdressApiProps,
  _token?: string
) {
  const address = await mockUpdateRestaurantAddress(data);
  return address;
}
