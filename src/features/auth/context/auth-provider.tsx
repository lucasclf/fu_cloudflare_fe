import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { login as requestLogin } from "../api/login";
import { logout as requestLogout } from "../api/logout";
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
  subscribeToAuthSession,
} from "../lib/auth-session-store";
import type { LoginInput } from "../types/auth";
import { AuthContext } from "./auth-context";
import type { AuthContextValue, AuthStatus } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Único ponto da aplicação que conhece o estado de autenticação.
 *
 * O JWT vive exclusivamente no cookie HttpOnly gerenciado pelo navegador —
 * este provider mantém apenas os dados do usuário necessários para a UI e
 * coordena login/logout com o backend.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const session = useSyncExternalStore(
    subscribeToAuthSession,
    getAuthSession,
    getAuthSession,
  );
  const [isGuest, setIsGuest] = useState(false);

  const login = useCallback(async (input: LoginInput, signal?: AbortSignal) => {
    const result = await requestLogin(input, signal);
    setAuthSession(result);
    setIsGuest(false);
  }, []);

  const logout = useCallback(async () => {
    // Tenta limpar o cookie no backend antes de apagar o estado local.
    // Mesmo que a chamada falhe (sem conexão, sessão já expirada), o estado
    // local é limpo — o usuário sempre consegue sair da interface.
    try {
      await requestLogout();
    } catch {
      // falha silenciosa intencional
    }
    clearAuthSession();
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  const status: AuthStatus = session
    ? "authenticated"
    : isGuest
      ? "guest"
      : "unauthenticated";

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      login,
      logout,
      continueAsGuest,
    }),
    [status, session, login, logout, continueAsGuest],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
