import type { AuthenticatedUser } from "../types/auth";

// O JWT vive exclusivamente no cookie HttpOnly gerenciado pelo navegador —
// o JavaScript da página nunca o acessa. A sessão em memória carrega apenas
// os dados do usuário necessários para a UI.
export type AuthSession = {
  user: AuthenticatedUser;
};

type Listener = () => void;

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
