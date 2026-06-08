import "./auth-form-message.css";

type AuthFormMessageVariant = "error" | "success";

type AuthFormMessageProps = {
  variant: AuthFormMessageVariant;
  message: string;
};

export function AuthFormMessage({ variant, message }: AuthFormMessageProps) {
  const classes = ["auth-form-message", `auth-form-message--${variant}`].join(
    " ",
  );

  return (
    <p className={classes} role={variant === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}
