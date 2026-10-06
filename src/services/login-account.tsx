import { mockLoginAccount, LoginCredentials } from "@/mocks/auth";

export type LoginAccountData = LoginCredentials;

export async function loginAccount(data: LoginAccountData) {
  return await mockLoginAccount(data);
}
