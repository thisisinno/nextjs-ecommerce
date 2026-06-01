export type AuthTokens = {
  access: string;
  refresh: string;
};

export type ApiUser = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
};
