export interface RestaurantProfile {
  id: string;
  slug: string;
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  profilePicUrl: string | null;
  bannerPicUrl: string | null;
}

export interface RestaurantProfilePayload {
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  profilePicFile?: File | null;
  bannerPicFile?: File | null;
}

export interface RestaurantHours {
  id_businessHours: string;
  weekday: string;
  openingTime: string | null;
  closingTime: string | null;
}

export interface RestaurantHoursPayload {
  weekday_start: string;
  weekday_end: string;
  openingTime: string;
  closingTime: string;
}

export interface RestaurantAddress {
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

export interface RestaurantAddressPayload {
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
