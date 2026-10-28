export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Session {
  token: string;
  expiresAt: number;
  restaurantId: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}
