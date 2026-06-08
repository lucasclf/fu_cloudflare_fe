import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { login as requestLogin } from "../api/login";
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
 * O JWT em si vive exclusivamente em auth-session-store (memória); este
 * provider apenas projeta esse estado para a árvore React e oferece as
 * operações de login/logout/modo visitante, para que nenhum componente
 * precise ler, gravar ou remover o token diretamente.
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

  const logout = useCallback(() => {
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
