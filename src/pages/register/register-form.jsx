import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLoginLayout from "../../app/components/default-login-layout/default-login-layout";
import PrimaryInput from "../../app/components/primary-input/primary-input";
import { ApiError } from "../../services/api-client.service";
import { useAuth } from "../../context/auth.context";
import { formatCpf, isValidCpf, normalizeCpf } from "../../utils/cpf.utils";
import { getPasswordRulesMessage, isStrongPassword } from "../../utils/password.utils";
import { isValidEmail, normalizeEmail } from "../../utils/validation.utils";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState({ message: "", errors: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Nome é obrigatório";
    }

    if (!email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!isValidEmail(email)) {
      errors.email = "E-mail inválido";
    }

    if (!cpf.trim()) {
      errors.cpf = "CPF é obrigatório";
    } else if (!isValidCpf(cpf)) {
      errors.cpf = "CPF inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
    } else if (!isStrongPassword(password)) {
      errors.password = getPasswordRulesMessage();
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "As senhas não coincidem";
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
      await register({
        name: name.trim(),
        email: normalizeEmail(email),
        password,
        cpf: normalizeCpf(cpf),
      });

      navigate("/login", {
        replace: true,
        state: { successMessage: "Cadastro realizado com sucesso. Faça login." },
      });
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
      title="Cadastre-se"
      subtitle="Preencha os dados para criar sua conta."
      primaryLabel={isSubmitting ? "Cadastrando..." : "Cadastrar"}
      onPrimaryAction={handleSubmit}
      primaryDisabled={isSubmitting}
      secondaryLabel="Já tenho conta"
      onSecondaryAction={() => navigate("/login")}
      errorMessage={apiError.message}
      errors={apiError.errors}
    >
      <PrimaryInput
        id="name"
        label="Nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
        autoComplete="name"
        placeholder="Seu nome completo"
      />

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
        id="cpf"
        label="CPF"
        value={cpf}
        onChange={(event) => setCpf(formatCpf(event.target.value))}
        error={fieldErrors.cpf}
        autoComplete="off"
        placeholder="000.000.000-00"
      />

      <PrimaryInput
        id="password"
        label="Senha"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        autoComplete="new-password"
        placeholder="Crie uma senha forte"
      />

      <PrimaryInput
        id="confirmPassword"
        label="Confirmar senha"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={fieldErrors.confirmPassword}
        autoComplete="new-password"
        placeholder="Repita a senha"
      />
    </DefaultLoginLayout>
  );
}
