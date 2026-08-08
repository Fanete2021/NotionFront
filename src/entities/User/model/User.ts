export interface User {
  id: string;
  email: string;
}

export interface UserDataResponse {
  accessToken: string;
  user: User;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLogoutRequest {
  allDevices: boolean;
}
