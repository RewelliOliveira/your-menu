import { api } from "./api";

export async function createItem(data: FormData) {
  return await api.post("/items", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
