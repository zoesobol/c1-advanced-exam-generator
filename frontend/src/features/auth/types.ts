export interface AuthUser {
  id: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

export interface AuthSuccessResponse {
  user: AuthUser;
  access: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}
