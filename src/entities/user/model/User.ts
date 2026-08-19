export interface User {
  id: string;
  email: string;
}

export interface UserData {
  accessToken: string;
  user: User;
}
