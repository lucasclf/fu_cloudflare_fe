import { useNavigate } from "react-router-dom";

import "./guest-login-button.css";

/**
 * Ocupa, para visitantes, o lugar onde o UserMenu mostraria o apelido —
 * um atalho direto de volta para a página principal de login.
 */
export function GuestLoginButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="guest-login-button"
      onClick={() => navigate("/login")}
    >
      Entrar
    </button>
  );
}
