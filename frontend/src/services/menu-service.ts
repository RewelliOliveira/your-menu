import type { Category, Dish, DishInput, MenuSection } from "@/types/menu";
import { http } from "./http-client";

export function getPublicMenu(slug: string) {
  return http.get<MenuSection[]>(`/storefronts/${encodeURIComponent(slug)}/menu`);
}

export function getMenu() {
  return http.get<MenuSection[]>("/menu");
}

export function getCategories() {
  return http.get<Category[]>("/categories");
}

export function saveCategory({ id, name }: { id?: string; name: string }) {
  return id ? http.put<Category>(`/categories/${id}`, { name }) : http.post<Category>("/categories", { name });
}

export function deleteCategory(id: string) {
  return http.delete(`/categories/${id}`);
}

export function getDish(id: string) {
  return http.get<Dish>(`/dishes/${id}`);
}

export function saveDish({ id, ...input }: DishInput & { id?: string }) {
  return id ? http.put<Dish>(`/dishes/${id}`, input) : http.post<Dish>("/dishes", input);
}

export function setDishAvailability(id: string, isAvailable: boolean) {
  return http.patch<void>(`/dishes/${id}/availability`, { isAvailable });
}

export function deleteDish(id: string) {
  return http.delete(`/dishes/${id}`);
}
