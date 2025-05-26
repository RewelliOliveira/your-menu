import { api } from "./api";

interface CreateAccountData {
  email: string;
  password: string;
  fullName: string;
}

export async function createAccount(data: CreateAccountData) {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    throw error;
  }
}
