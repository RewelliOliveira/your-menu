import { AuthSession, LoginCredentials, RegisterCredentials } from "@/core/types/auth-types";

export const DEFAULT_MOCK_USER = {
  id: "user-mock-1",
  email: "admin@yourmenu.com",
  fullName: "Administrador YourMenu",
  restaurantId: "rest-mock-123",
  token: "mock-jwt-token-yourmenu-admin-2026",
};

export async function mockLoginAccount(credentials: LoginCredentials): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!credentials.email || !credentials.password) {
    throw new Error("Email e senha são obrigatórios.");
  }

  const user = {
    id: DEFAULT_MOCK_USER.id,
    email: credentials.email,
    fullName:
      credentials.email === DEFAULT_MOCK_USER.email
        ? DEFAULT_MOCK_USER.fullName
        : credentials.email.split("@")[0],
  };

  return {
    token: DEFAULT_MOCK_USER.token,
    restaurantId: DEFAULT_MOCK_USER.restaurantId,
    user,
  };
}

export async function mockCreateAccount(data: RegisterCredentials): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    token: DEFAULT_MOCK_USER.token,
    restaurantId: DEFAULT_MOCK_USER.restaurantId,
    user: {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
    },
  };
}
