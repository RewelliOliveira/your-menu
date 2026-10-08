export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthSession {
  token: string;
  restaurantId: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}
