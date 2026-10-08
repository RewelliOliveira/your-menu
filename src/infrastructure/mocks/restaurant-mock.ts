import { DeliveryZone, DeliveryZonePayload } from "@/core/types/delivery-zone-types";
import {
  RestaurantAddress,
  RestaurantAddressPayload,
  RestaurantHours,
  RestaurantProfile,
  RestaurantProfilePayload,
} from "@/core/types/restaurant-types";

export const INITIAL_MOCK_RESTAURANT: RestaurantProfile = {
  id: "rest-mock-123",
  slug: "your-burger",
  name: "YourBurger Artesanal",
  deliveryTimeMin: 30,
  deliveryTimeMax: 45,
  isOpen: true,
  profilePicUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80",
  bannerPicUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
};

export const INITIAL_MOCK_HOURS: RestaurantHours[] = [
  { id_businessHours: "h-1", weekday: "MONDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-2", weekday: "TUESDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-3", weekday: "WEDNESDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-4", weekday: "THURSDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-5", weekday: "FRIDAY", openingTime: "18:00", closingTime: "00:00" },
  { id_businessHours: "h-6", weekday: "SATURDAY", openingTime: "18:00", closingTime: "00:00" },
  { id_businessHours: "h-7", weekday: "SUNDAY", openingTime: "18:00", closingTime: "23:00" },
];

export const INITIAL_MOCK_ADDRESS: RestaurantAddress = {
  restaurantId: "rest-mock-123",
  cep: "01310-100",
  state: "SP",
  city: "São Paulo",
  district: "Bela Vista",
  street: "Avenida Paulista",
  number: 1000,
  complement: "Loja 04",
  reference: "Próximo ao MASP",
};

export const INITIAL_MOCK_ZONES: DeliveryZone[] = [
  { id: "zone-1", zone: "Centro", deliveryFee: 5.0, restaurantSlug: "your-burger" },
  { id: "zone-2", zone: "Bela Vista", deliveryFee: 7.0, restaurantSlug: "your-burger" },
  { id: "zone-3", zone: "Consolação", deliveryFee: 6.5, restaurantSlug: "your-burger" },
  { id: "zone-4", zone: "Jardins", deliveryFee: 9.0, restaurantSlug: "your-burger" },
  { id: "zone-5", zone: "Pinheiros", deliveryFee: 12.0, restaurantSlug: "your-burger" },
];

const PROFILE_KEY = "your_menu_mock_profile";
const HOURS_KEY = "your_menu_mock_hours";
const ADDRESS_KEY = "your_menu_mock_address";
const ZONES_KEY = "your_menu_mock_zones";

function getStoredProfile(): RestaurantProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_RESTAURANT;
}

function saveProfile(profile: RestaurantProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    void 0;
  }
}

function getStoredHours(): RestaurantHours[] {
  try {
    const raw = localStorage.getItem(HOURS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_HOURS;
}

function saveHours(hours: RestaurantHours[]): void {
  try {
    localStorage.setItem(HOURS_KEY, JSON.stringify(hours));
  } catch {
    void 0;
  }
}

function getStoredAddress(): RestaurantAddress {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_ADDRESS;
}

function saveAddress(address: RestaurantAddress): void {
  try {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
  } catch {
    void 0;
  }
}

function getStoredZones(): DeliveryZone[] {
  try {
    const raw = localStorage.getItem(ZONES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    void 0;
  }
  return INITIAL_MOCK_ZONES;
}

function saveZones(zones: DeliveryZone[]): void {
  try {
    localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
  } catch {
    void 0;
  }
}

export async function mockGetRestaurantProfile(): Promise<RestaurantProfile> {
  await new Promise((r) => setTimeout(r, 80));
  return getStoredProfile();
}

export async function mockUpdateRestaurantProfile(data: Partial<RestaurantProfilePayload>): Promise<RestaurantProfile> {
  await new Promise((r) => setTimeout(r, 120));
  const current = getStoredProfile();
  const updated: RestaurantProfile = {
    ...current,
    ...(data.name ? { name: data.name } : {}),
    ...(data.deliveryTimeMin ? { deliveryTimeMin: data.deliveryTimeMin } : {}),
    ...(data.deliveryTimeMax ? { deliveryTimeMax: data.deliveryTimeMax } : {}),
  };
  saveProfile(updated);
  return updated;
}

export async function mockToggleRestaurantOpenStatus(isOpen: boolean): Promise<{ success: boolean; isOpen: boolean }> {
  await new Promise((r) => setTimeout(r, 80));
  const profile = getStoredProfile();
  profile.isOpen = isOpen;
  saveProfile(profile);
  return { success: true, isOpen };
}

export async function mockGetRestaurantHours(): Promise<RestaurantHours[]> {
  await new Promise((r) => setTimeout(r, 80));
  return getStoredHours();
}

export async function mockUpdateRestaurantHours(
  weekday_start: string,
  weekday_end: string,
  openingTime: string,
  closingTime: string
): Promise<RestaurantHours[]> {
  await new Promise((r) => setTimeout(r, 120));
  const orderWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const startIndex = orderWeek.indexOf(weekday_start);
  const endIndex = orderWeek.indexOf(weekday_end);

  const hours: RestaurantHours[] = orderWeek.map((day, idx) => {
    let isOpenDay = false;
    if (startIndex <= endIndex) {
      isOpenDay = idx >= startIndex && idx <= endIndex;
    } else {
      isOpenDay = idx >= startIndex || idx <= endIndex;
    }

    return {
      id_businessHours: `h-${idx}`,
      weekday: day,
      openingTime: isOpenDay ? openingTime : null,
      closingTime: isOpenDay ? closingTime : null,
    };
  });

  saveHours(hours);
  return hours;
}

export async function mockGetRestaurantAddress(): Promise<RestaurantAddress> {
  await new Promise((r) => setTimeout(r, 80));
  return getStoredAddress();
}

export async function mockUpdateRestaurantAddress(data: Partial<RestaurantAddressPayload>): Promise<RestaurantAddress> {
  await new Promise((r) => setTimeout(r, 120));
  const current = getStoredAddress();
  const updated: RestaurantAddress = {
    ...current,
    ...data,
  };
  saveAddress(updated);
  return updated;
}

export async function mockGetRestaurantLink(restaurantId: string): Promise<{ link: string }> {
  await new Promise((r) => setTimeout(r, 50));
  const origin = window.location.origin;
  return { link: `${origin}/${restaurantId || "rest-mock-123"}` };
}

export async function mockGetDeliveryZones(slug?: string): Promise<DeliveryZone[]> {
  await new Promise((r) => setTimeout(r, 80));
  const zones = getStoredZones();
  return slug ? zones.filter((z) => z.restaurantSlug === slug) : zones;
}

export async function mockSaveDeliveryZone(data: DeliveryZonePayload): Promise<DeliveryZone> {
  await new Promise((r) => setTimeout(r, 120));
  const zones = getStoredZones();
  const newZone: DeliveryZone = {
    id: `zone-${Date.now()}`,
    zone: data.zone,
    deliveryFee: data.deliveryFee,
    restaurantSlug: data.restaurantSlug || "your-burger",
  };
  zones.push(newZone);
  saveZones(zones);
  return newZone;
}

export async function mockUpdateDeliveryZone(id: string, data: DeliveryZonePayload): Promise<DeliveryZone> {
  await new Promise((r) => setTimeout(r, 120));
  const zones = getStoredZones();
  const idx = zones.findIndex((z) => z.id === id);
  if (idx !== -1) {
    zones[idx] = {
      ...zones[idx],
      zone: data.zone,
      deliveryFee: data.deliveryFee,
      restaurantSlug: data.restaurantSlug || zones[idx].restaurantSlug,
    };
    saveZones(zones);
    return zones[idx];
  }
  return mockSaveDeliveryZone(data);
}

export async function mockDeleteDeliveryZone(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 120));
  const zones = getStoredZones().filter((z) => z.id !== id);
  saveZones(zones);
}
