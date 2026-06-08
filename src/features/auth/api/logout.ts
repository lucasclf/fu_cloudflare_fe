import { API_BASE_URL } from "@/shared/services/api";
import { httpPost } from "@/shared/lib/http-client";

// O cookie HttpOnly não pode ser removido pelo JavaScript — o endpoint de
// logout no backend emite um Set-Cookie com maxAge=0, instruindo o navegador
// a descartá-lo. Sem esta chamada, o cookie continuaria sendo enviado em
// requisições futuras mesmo após o usuário solicitar saída.
export async function logout(signal?: AbortSignal): Promise<void> {
  await httpPost<{ message: string }>(
    `${API_BASE_URL}/auth/logout`,
    {},
    { signal },
  );
}
