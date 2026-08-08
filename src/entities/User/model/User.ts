export interface User {
  id: string;
  email: string;
}

export interface UserDataResponse {
  accessToken: string;
  user: User;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  allDevices: boolean;
}
