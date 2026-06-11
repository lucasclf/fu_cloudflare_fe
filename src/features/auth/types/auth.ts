export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string;
  nickname: string;
  imgKey: string | null;
  isSuperUser: boolean;
};

// O token não é armazenado no frontend — vive exclusivamente no cookie
// HttpOnly gerenciado pelo navegador. AuthResult só carrega os dados do usuário
// necessários para a interface.
export type AuthResult = {
  user: AuthenticatedUser;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  name: string;
  nickname: string;
  password: string;
};
