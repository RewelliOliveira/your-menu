import { mockToggleRestaurantOpenStatus } from "@/mocks/restaurant";

export async function toggleRestaurantOpenStatusApi(
  _restaurantId: string,
  isOpen: boolean,
  _token?: string
) {
  const result = await mockToggleRestaurantOpenStatus(isOpen);
  return result;
}
