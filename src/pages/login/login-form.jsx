import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DefaultLoginLayout from "../../app/components/default-login-layout/default-login-layout";
import PrimaryInput from "../../app/components/primary-input/primary-input";
import { ApiError } from "../../services/api-client.service";
import { useAuth } from "../../context/auth.context";
import { isValidEmail, normalizeEmail } from "../../utils/validation.utils";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState({ message: "", errors: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors = {};

    if (!email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!isValidEmail(email)) {
      errors.email = "E-mail inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError({ message: "", errors: [] });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: normalizeEmail(email),
        password,
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError({
          message: error.message,
          errors: error.errors,
        });
      } else {
        setApiError({
          message: "Não foi possível conectar ao servidor. Tente novamente.",
          errors: [],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DefaultLoginLayout
      title="Entrar"
      subtitle="Acesse sua conta com e-mail e senha."
      primaryLabel={isSubmitting ? "Entrando..." : "Entrar"}
      onPrimaryAction={handleSubmit}
      primaryDisabled={isSubmitting}
      secondaryLabel="Criar conta"
      onSecondaryAction={() => navigate("/register")}
      errorMessage={apiError.message}
      errors={apiError.errors}
    >
      <PrimaryInput
        id="email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        autoComplete="email"
        placeholder="seu@email.com"
      />

      <PrimaryInput
        id="password"
        label="Senha"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        autoComplete="current-password"
        placeholder="Digite sua senha"
      />
    </DefaultLoginLayout>
  );
}
