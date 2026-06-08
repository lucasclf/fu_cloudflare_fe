import type { AuthenticatedUser } from "../types/auth";

export type AuthSession = {
  token: string;
  user: AuthenticatedUser;
};

type Listener = () => void;

/**
 * Estado de sessão mantido somente em memória (variável de módulo).
 *
 * Não persiste em localStorage/sessionStorage/cookies: isso reduz a janela de
 * exposição do JWT a scripts maliciosos (XSS) e evita que ele fique disponível
 * indefinidamente em um storage acessível por qualquer script da página. Como
 * contrapartida, a sessão não sobrevive a um reload — ver auth-context.tsx.
 */
let session: AuthSession | null = null;
const listeners = new Set<Listener>();

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getAuthSession(): AuthSession | null {
  return session;
}

export function getAuthToken(): string | null {
  return session?.token ?? null;
}

export function setAuthSession(next: AuthSession): void {
  session = next;
  notifyListeners();
}

export function clearAuthSession(): void {
  if (session === null) {
    return;
  }

  session = null;
  notifyListeners();
}

export function subscribeToAuthSession(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
