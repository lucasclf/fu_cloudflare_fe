import { getAuthToken } from "./auth-session-store";

/**
 * Ponto único para anexar o JWT em chamadas autenticadas futuras.
 *
 * Uso esperado quando a API exigir `Authorization: Bearer <token>`:
 *
 *   httpGet(url, { headers: { ...getAuthorizationHeader() } })
 *
 * Nenhum componente ou feature deve ler o token diretamente — sempre passar
 * por aqui (que por sua vez delega a leitura ao auth-session-store).
 */
export function getAuthorizationHeader(): Record<string, string> {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}
