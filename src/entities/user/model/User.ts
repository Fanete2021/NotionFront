export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  accessToken: string;
  user: Pick<User, 'id' | 'email'>;
}
