import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/button";
import { AuthField } from "../components/auth-field";
import { AuthFormMessage } from "../components/auth-form-message";
import { AuthPageLayout } from "../components/auth-page-layout";
import { useAuth } from "../hooks/use-auth";

import "./login-page.css";

type LoginLocationState = {
  registered?: boolean;
};

export function LoginPage() {
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const justRegistered = Boolean(
    (location.state as LoginLocationState | null)?.registered,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ identifier, password });
      navigate("/campaigns", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuestAccess() {
    continueAsGuest();
    navigate("/home", { replace: true });
  }

  return (
    <AuthPageLayout
      title="Entrar"
      subtitle="Acesse sua conta para continuar no Fábula Última"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate("/register")}
          >
            Criar nova conta
          </Button>

          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={handleGuestAccess}
          >
            Entrar sem login
          </Button>
        </>
      }
    >
      {justRegistered ? (
        <AuthFormMessage
          variant="success"
          message="Conta criada com sucesso. Faça login para continuar."
        />
      ) : null}

      {error ? <AuthFormMessage variant="error" message={error} /> : null}

      <form className="login-page__form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="login-identifier"
          label="E-mail ou apelido"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={setIdentifier}
          required
        />

        <AuthField
          id="login-password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthPageLayout>
  );
}
