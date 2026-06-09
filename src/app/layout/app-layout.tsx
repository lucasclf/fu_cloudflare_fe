import { Outlet } from "react-router-dom";

import { GuestLoginButton } from "@/features/auth/components/guest-login-button";
import { UserMenu } from "@/features/auth/components/user-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";

import "./app-layout.css";

/**
 * Camada fina sobre as páginas autenticáveis (Home etc.): adiciona uma barra
 * fixa no topo com o menu do usuário (autenticado) ou um atalho para login
 * (visitante). O conteúdo recebe um espaçamento superior equivalente à altura
 * da barra para não ficar coberto por ela.
 */
export function AppLayout() {
  const { status, initializing } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-layout__topbar">
        {initializing ? null : status === "authenticated" ? (
          <UserMenu />
        ) : (
          <GuestLoginButton />
        )}
      </header>

      <div className="app-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
