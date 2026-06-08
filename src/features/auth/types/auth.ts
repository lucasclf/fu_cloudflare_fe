export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string;
  nickname: string;
  imgKey: string | null;
  isSuperUser: boolean;
};

export type AuthResult = {
  token: string;
  user: AuthenticatedUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  name: string;
  nickname: string;
  password: string;
};
