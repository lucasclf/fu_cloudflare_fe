import { API_BASE_URL } from "@/shared/services/api";
import { httpPost } from "@/shared/lib/http-client";
import { mapAuthResultDtoToAuthResult } from "../lib/auth-mapper";
import type { AuthResultDto } from "../types/auth-dto";
import type { AuthResult, LoginInput } from "../types/auth";

export async function login(
  input: LoginInput,
  signal?: AbortSignal,
): Promise<AuthResult> {
  const dto = await httpPost<AuthResultDto>(
    `${API_BASE_URL}/auth/login`,
    input,
    {
      signal,
    },
  );

  return mapAuthResultDtoToAuthResult(dto);
}
