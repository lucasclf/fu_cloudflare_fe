import { API_BASE_URL } from "@/shared/services/api";
import { httpPost } from "@/shared/lib/http-client";
import type { RegisterInput } from "../types/auth";

type RegisterResponse = {
  message: string;
};

/**
 * Aponta para um endpoint público de auto-cadastro (`POST /v1/auth/register`)
 * que ainda NÃO existe no FUDB — hoje a única rota de criação de usuário é
 * `POST /v1/admin/users`, protegida pelo token mestre de administração, que
 * jamais deve ser exposto ao front-end público.
 *
 * Esta chamada é a integração "pronta" sugerida para o novo endpoint público;
 * ela retornará 404 até que o backend implemente essa rota (ver sugestões
 * de alteração no FUDB reportadas separadamente).
 */
export async function register(
  input: RegisterInput,
  signal?: AbortSignal,
): Promise<void> {
  await httpPost<RegisterResponse>(`${API_BASE_URL}/auth/register`, input, {
    signal,
  });
}
