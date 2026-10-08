import { AuthSession, LoginCredentials, RegisterCredentials } from "@/core/types/auth-types";
import { mockCreateAccount, mockLoginAccount } from "../mocks/auth-mock";

export async function loginAccount(credentials: LoginCredentials): Promise<AuthSession> {
  return await mockLoginAccount(credentials);
}

export async function createAccount(data: RegisterCredentials): Promise<AuthSession> {
  return await mockCreateAccount(data);
}
