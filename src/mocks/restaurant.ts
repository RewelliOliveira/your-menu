export interface MockRestaurantProfile {
  id: string;
  slug: string;
  name: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  profilePicUrl: string | null;
  bannerPicUrl: string | null;
}

export interface MockRestaurantHour {
  id_businessHours: string;
  weekday: string;
  openingTime: string | null;
  closingTime: string | null;
}

export interface MockRestaurantAddress {
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

export interface MockDeliveryZone {
  id: string;
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}

export const INITIAL_MOCK_RESTAURANT: MockRestaurantProfile = {
  id: "rest-mock-123",
  slug: "your-burger",
  name: "YourBurger Artesanal",
  deliveryTimeMin: 30,
  deliveryTimeMax: 45,
  isOpen: true,
  profilePicUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80",
  bannerPicUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
};

export const INITIAL_MOCK_HOURS: MockRestaurantHour[] = [
  { id_businessHours: "h-1", weekday: "MONDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-2", weekday: "TUESDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-3", weekday: "WEDNESDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-4", weekday: "THURSDAY", openingTime: "18:00", closingTime: "23:30" },
  { id_businessHours: "h-5", weekday: "FRIDAY", openingTime: "18:00", closingTime: "00:00" },
  { id_businessHours: "h-6", weekday: "SATURDAY", openingTime: "18:00", closingTime: "00:00" },
  { id_businessHours: "h-7", weekday: "SUNDAY", openingTime: "18:00", closingTime: "23:00" },
];

export const INITIAL_MOCK_ADDRESS: MockRestaurantAddress = {
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

export const INITIAL_MOCK_ZONES: MockDeliveryZone[] = [
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

function getStoredProfile(): MockRestaurantProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao ler perfil do localStorage:", e);
  }
  return INITIAL_MOCK_RESTAURANT;
}

function saveProfile(profile: MockRestaurantProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn("Erro ao salvar perfil no localStorage:", e);
  }
}

function getStoredHours(): MockRestaurantHour[] {
  try {
    const raw = localStorage.getItem(HOURS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao ler horários do localStorage:", e);
  }
  return INITIAL_MOCK_HOURS;
}

function saveHours(hours: MockRestaurantHour[]) {
  try {
    localStorage.setItem(HOURS_KEY, JSON.stringify(hours));
  } catch (e) {
    console.warn("Erro ao salvar horários no localStorage:", e);
  }
}

function getStoredAddress(): MockRestaurantAddress {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao ler endereço do localStorage:", e);
  }
  return INITIAL_MOCK_ADDRESS;
}

function saveAddress(address: MockRestaurantAddress) {
  try {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
  } catch (e) {
    console.warn("Erro ao salvar endereço no localStorage:", e);
  }
}

function getStoredZones(): MockDeliveryZone[] {
  try {
    const raw = localStorage.getItem(ZONES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao ler zonas do localStorage:", e);
  }
  return INITIAL_MOCK_ZONES;
}

function saveZones(zones: MockDeliveryZone[]) {
  try {
    localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
  } catch (e) {
    console.warn("Erro ao salvar zonas no localStorage:", e);
  }
}

// ========================
// Perfil do Restaurante
// ========================

export async function mockGetRestaurantProfile(): Promise<MockRestaurantProfile> {
  await new Promise((r) => setTimeout(r, 100));
  return getStoredProfile();
}

export async function mockUpdateRestaurantProfile(data: Partial<MockRestaurantProfile>): Promise<MockRestaurantProfile> {
  await new Promise((r) => setTimeout(r, 150));
  const current = getStoredProfile();
  const updated: MockRestaurantProfile = {
    ...current,
    ...data,
  };
  saveProfile(updated);
  return updated;
}

export async function mockToggleRestaurantOpenStatus(isOpen: boolean): Promise<{ success: boolean; isOpen: boolean }> {
  await new Promise((r) => setTimeout(r, 100));
  const profile = getStoredProfile();
  profile.isOpen = isOpen;
  saveProfile(profile);
  return { success: true, isOpen };
}

// ========================
// Horários de Funcionamento
// ========================

export async function mockGetRestaurantHours(): Promise<MockRestaurantHour[]> {
  await new Promise((r) => setTimeout(r, 100));
  return getStoredHours();
}

export async function mockUpdateRestaurantHours(
  weekday_start: string,
  weekday_end: string,
  openingTime: string,
  closingTime: string
): Promise<MockRestaurantHour[]> {
  await new Promise((r) => setTimeout(r, 150));
  const orderWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const startIndex = orderWeek.indexOf(weekday_start);
  const endIndex = orderWeek.indexOf(weekday_end);

  const hours = orderWeek.map((day, idx) => {
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

// ========================
// Endereço do Restaurante
// ========================

export async function mockGetRestaurantAddress(): Promise<MockRestaurantAddress> {
  await new Promise((r) => setTimeout(r, 100));
  return getStoredAddress();
}

export async function mockUpdateRestaurantAddress(data: Partial<MockRestaurantAddress>): Promise<MockRestaurantAddress> {
  await new Promise((r) => setTimeout(r, 150));
  const current = getStoredAddress();
  const updated: MockRestaurantAddress = {
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

// ========================
// Zonas de Entrega
// ========================

export async function mockGetDeliveryZones(slug?: string): Promise<MockDeliveryZone[]> {
  await new Promise((r) => setTimeout(r, 100));
  const zones = getStoredZones();
  return slug ? zones.filter((z) => z.restaurantSlug === slug) : zones;
}

export async function mockSaveDeliveryZone(data: {
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}): Promise<MockDeliveryZone> {
  await new Promise((r) => setTimeout(r, 150));
  const zones = getStoredZones();
  const newZone: MockDeliveryZone = {
    id: `zone-${Date.now()}`,
    zone: data.zone,
    deliveryFee: data.deliveryFee,
    restaurantSlug: data.restaurantSlug || "your-burger",
  };
  zones.push(newZone);
  saveZones(zones);
  return newZone;
}

export async function mockUpdateDeliveryZone(
  id: string,
  data: { zone: string; deliveryFee: number; restaurantSlug: string }
): Promise<MockDeliveryZone> {
  await new Promise((r) => setTimeout(r, 150));
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
  await new Promise((r) => setTimeout(r, 150));
  const zones = getStoredZones().filter((z) => z.id !== id);
  saveZones(zones);
}

