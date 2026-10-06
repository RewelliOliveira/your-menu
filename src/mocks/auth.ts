export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  restaurantId: string;
  token: string;
}

export const DEFAULT_MOCK_USER: MockUser = {
  id: "user-mock-1",
  email: "admin@yourmenu.com",
  fullName: "Administrador YourMenu",
  restaurantId: "rest-mock-123",
  token: "mock-jwt-token-yourmenu-admin-2026",
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  restaurantId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

/**
 * Realiza o login mocado.
 * Aceita as credenciais padrão ou qualquer email/senha preenchidos para facilitar testes de design.
 */
export async function mockLoginAccount(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simula pequena latência de rede para renderização de loading realista
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!credentials.email || !credentials.password) {
    throw new Error("Email e senha são obrigatórios.");
  }

  const user = {
    id: DEFAULT_MOCK_USER.id,
    email: credentials.email,
    fullName: credentials.email === DEFAULT_MOCK_USER.email ? DEFAULT_MOCK_USER.fullName : credentials.email.split("@")[0],
  };

  return {
    token: DEFAULT_MOCK_USER.token,
    restaurantId: DEFAULT_MOCK_USER.restaurantId,
    user,
  };
}

/**
 * Realiza o cadastro mocado.
 */
export async function mockCreateAccount(data: RegisterData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

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

