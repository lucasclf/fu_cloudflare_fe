import { createContext } from "react";

import type { AuthenticatedUser, LoginInput } from "../types/auth";

export type AuthStatus = "unauthenticated" | "authenticated" | "guest";

export type AuthContextValue = {
  status: AuthStatus;
  initializing: boolean;
  user: AuthenticatedUser | null;
  login: (input: LoginInput, signal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
