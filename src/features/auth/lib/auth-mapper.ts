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

// O token (dto.token) existe na resposta do backend mas não é armazenado:
// o navegador recebe e gerencia o JWT via cookie HttpOnly (Set-Cookie).
export function mapAuthResultDtoToAuthResult(dto: AuthResultDto): AuthResult {
  return {
    user: mapUserDtoToUser(dto.user),
  };
}
