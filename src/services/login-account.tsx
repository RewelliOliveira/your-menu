import { api } from "./api";

interface LoginAccountData {
  email: string;
  password: string;
}

export async function loginAccount(data: LoginAccountData) {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
