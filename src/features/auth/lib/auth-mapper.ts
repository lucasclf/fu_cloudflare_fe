import type { AuthResultDto, UserDto } from "../types/auth-dto";
import type { AuthResult, AuthenticatedUser } from "../types/auth";

export function mapUserDtoToUser(dto: UserDto): AuthenticatedUser {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    nickname: dto.nickname,
    imgKey: dto.img_key,
    isSuperUser: dto.is_super_user,
  };
}

export function mapAuthResultDtoToAuthResult(dto: AuthResultDto): AuthResult {
  return {
    token: dto.token,
    user: mapUserDtoToUser(dto.user),
  };
}
