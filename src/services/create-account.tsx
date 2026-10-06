import { mockCreateAccount, RegisterData } from "@/mocks/auth";

export type CreateAccountData = RegisterData;

export async function createAccount(data: CreateAccountData) {
  try {
    const response = await mockCreateAccount(data);
    return response;
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    throw error;
  }
}
