import {
  mockGetRestaurantProfile,
  mockUpdateRestaurantProfile,
  MockRestaurantProfile,
} from "@/mocks/restaurant";

export interface RestaurantProfileApiProps {
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  profilePicFile?: File | null;
  bannerPicFile?: File | null;
}

export interface RestaurantApiResponse {
  id: string;
  slug: string;
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  profilePicUrl: string | null;
  bannerPicUrl: string | null;
  closingTime?: string | null;
  openingTime?: string | null;
}

function mapToApiResponse(profile: MockRestaurantProfile): RestaurantApiResponse {
  return {
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    deliveryTimeMin: profile.deliveryTimeMin,
    deliveryTimeMax: profile.deliveryTimeMax,
    isOpen: profile.isOpen,
    profilePicUrl: profile.profilePicUrl,
    bannerPicUrl: profile.bannerPicUrl,
  };
}

export async function restaurantProfileApi(
  data: RestaurantProfileApiProps,
  _token?: string
): Promise<RestaurantApiResponse> {
  const updated = await mockUpdateRestaurantProfile({
    name: data.name,
    deliveryTimeMin: data.deliveryTimeMin,
    deliveryTimeMax: data.deliveryTimeMax,
  });
  return mapToApiResponse(updated);
}

export async function getRestaurantProfileApi(
  _token?: string
): Promise<RestaurantApiResponse> {
  const profile = await mockGetRestaurantProfile();
  return mapToApiResponse(profile);
}

export async function updateRestaurantProfileApi(
  _restaurantId: string,
  data: RestaurantProfileApiProps,
  _token?: string
): Promise<RestaurantApiResponse> {
  const updated = await mockUpdateRestaurantProfile({
    name: data.name,
    deliveryTimeMin: data.deliveryTimeMin,
    deliveryTimeMax: data.deliveryTimeMax,
  });
  return mapToApiResponse(updated);
}
