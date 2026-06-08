export type UserDto = {
  id: number;
  email: string;
  name: string;
  nickname: string;
  img_key: string | null;
  is_super_user: boolean;
  created_at: string;
  updated_at: string | null;
};

export type AuthResultDto = {
  token: string;
  user: UserDto;
};
