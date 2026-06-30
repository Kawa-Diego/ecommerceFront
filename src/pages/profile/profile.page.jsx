import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryInput from "../../app/components/primary-input/primary-input";
import FormAlert from "../../app/components/form-alert/form-alert";
import { ApiError } from "../../services/api-client.service";
import { useAuth } from "../../context/auth.context";
import { formatCpf, isValidCpf, normalizeCpf } from "../../utils/cpf.utils";
import { getPasswordRulesMessage, isStrongPassword } from "../../utils/password.utils";
import "./profile.page.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, loadCurrentUser, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState({ message: "", errors: [] });
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = user ?? (await loadCurrentUser(token));
        setName(currentUser?.name ?? "");
        setEmail(currentUser?.email ?? "");
        setCpf(formatCpf(currentUser?.cpf ?? ""));
      } catch (error) {
        if (error instanceof ApiError) {
          setApiError({ message: error.message, errors: error.errors });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [user, token, loadCurrentUser]);

  function validateForm() {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Nome é obrigatório";
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
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        name: name.trim(),
        cpf: normalizeCpf(cpf),
        password,
      });
      setPassword("");
      setConfirmPassword("");
      setSuccessMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError({ message: error.message, errors: error.errors });
      } else {
        setApiError({
          message: "Não foi possível atualizar o perfil. Tente novamente.",
          errors: [],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="profile-page__loading">Carregando perfil...</p>;
  }

  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <h2>Meu perfil</h2>
        <button type="button" onClick={() => navigate("/dashboard")}>
          Voltar
        </button>
      </header>

      {successMessage && (
        <div className="profile-page__success" role="status">
          {successMessage}
        </div>
      )}

      <FormAlert message={apiError.message} errors={apiError.errors} />

      <form className="profile-page__form" onSubmit={handleSubmit} noValidate>
        <PrimaryInput
          id="profile-name"
          label="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
        />

        <PrimaryInput
          id="profile-email"
          label="E-mail"
          value={email}
          readOnly
        />

        <PrimaryInput
          id="profile-cpf"
          label="CPF"
          value={cpf}
          onChange={(event) => setCpf(formatCpf(event.target.value))}
          error={fieldErrors.cpf}
        />

        <PrimaryInput
          id="profile-password"
          label="Nova senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <PrimaryInput
          id="profile-confirm-password"
          label="Confirmar nova senha"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </section>
  );
}
