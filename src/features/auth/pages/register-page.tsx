import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/button";
import { register } from "../api/register";
import { AuthField } from "../components/auth-field";
import { AuthFormMessage } from "../components/auth-form-message";
import { AuthPageLayout } from "../components/auth-page-layout";

import "./register-page.css";

const MIN_PASSWORD_LENGTH = 8;

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmPasswordFilled = confirmPassword.length > 0;
  const passwordsMatch = confirmPasswordFilled && confirmPassword === password;
  const passwordsDiffer = confirmPasswordFilled && confirmPassword !== password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, nickname, email, password });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar a conta. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageLayout
      title="Criar conta"
      subtitle="Cadastre-se para acompanhar suas campanhas no Fábula Última"
      footer={
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={() => navigate("/login")}
        >
          Já tenho uma conta
        </Button>
      }
    >
      {error ? <AuthFormMessage variant="error" message={error} /> : null}

      <form className="register-page__form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="register-name"
          label="Nome"
          value={name}
          onChange={setName}
          autoComplete="name"
          required
        />

        <AuthField
          id="register-nickname"
          label="Apelido"
          value={nickname}
          onChange={setNickname}
          autoComplete="nickname"
          required
        />

        <AuthField
          id="register-email"
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />

        <AuthField
          id="register-password"
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />

        <AuthField
          id="register-confirm-password"
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          invalid={passwordsDiffer}
          errorMessage="As senhas não coincidem."
          valid={passwordsMatch}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </AuthPageLayout>
  );
}
