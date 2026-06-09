import { API_BASE_URL } from "@/shared/services/api";
import { httpGet } from "@/shared/lib/http-client";
import { mapUserDtoToUser } from "../lib/auth-mapper";
import type { UserDto } from "../types/auth-dto";
import type { AuthResult } from "../types/auth";

export async function getMe(signal?: AbortSignal): Promise<AuthResult | null> {
  try {
    const dto = await httpGet<UserDto>(`${API_BASE_URL}/auth/me`, { signal });
    return { user: mapUserDtoToUser(dto) };
  } catch {
    return null;
  }
}
