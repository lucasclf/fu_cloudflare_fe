import { Outlet } from "react-router-dom";

import { GuestLoginButton } from "@/features/auth/components/guest-login-button";
import { UserMenu } from "@/features/auth/components/user-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";

import "./app-layout.css";

/**
 * Camada fina sobre as páginas autenticáveis (Home etc.): sobrepõe, no canto
 * superior direito, o menu do usuário (autenticado) ou um atalho para login
 * (visitante) — sem alterar o layout/markup existente, por isso é posicionado
 * de forma flutuante (position: fixed) em vez de ocupar espaço no fluxo do
 * documento.
 */
export function AppLayout() {
  const { status } = useAuth();

  return (
    <>
      {status === "authenticated" ? (
        <div className="app-layout__user-menu">
          <UserMenu />
        </div>
      ) : status === "guest" ? (
        <div className="app-layout__user-menu">
          <GuestLoginButton />
        </div>
      ) : null}

      <Outlet />
    </>
  );
}
