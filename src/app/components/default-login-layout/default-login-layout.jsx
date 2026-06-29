import FormAlert from "../form-alert/form-alert";
import "./styles/default-login-layout.css";
import { Link } from "react-router-dom";

export default function DefaultLoginLayout({
  title,
  subtitle,
  children,
  primaryLabel,
  primaryType = "submit",
  onPrimaryAction,
  primaryDisabled = false,
  secondaryLabel,
  onSecondaryAction,
  errorMessage = "",
  errors = [],
}) {
  return (
    <main className="default-login-layout">
      <section className="main-section">
        <h1>Cardápio Digital</h1>
        <p>Gestão de cardápio e pedidos para o seu negócio.</p>
      </section>

      <section className="form-section">
        <h2>{title}</h2>
        {subtitle && <p className="form-subtitle">{subtitle}</p>}

        <FormAlert message={errorMessage} errors={errors} />

        <form
          className="auth-form"
          onSubmit={onPrimaryAction}
          noValidate
        >
          {children}

          <div className="btn-wrapper">
            <button
              type={primaryType}
              className="btn-primary"
              disabled={primaryDisabled}
            >
              {primaryLabel}
            </button>

            {secondaryLabel && onSecondaryAction && (
              <>
                <div className="divider">
                  <div />
                  <span>ou</span>
                  <div />
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onSecondaryAction}
                >
                  {secondaryLabel}
                </button>

                <button
                type="button"
                className="btn-secondary"
                >
                  <Link to={"/"}>Voltar para página Inicial</Link>
                  </button>
                  
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
