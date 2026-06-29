import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../../services/api-client.service";
import { getHomeMessage } from "../../services/home.service";
import { useAuth } from "../../context/auth.context";
import "./home.page.css";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  /** @type {[Record<string, unknown> | null, Function]} */
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeMessage() {
      try {
        setLoading(true);
        setError("");

        const data = await getHomeMessage();
        setApiData(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Erro inesperado ao carregar a página.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadHomeMessage();
  }, []);

  return (
    <main className="home-page">
      <section className="home-page__article">
        <header>
          <h1>Cardápio Digital</h1>
        </header>

        {loading && <p className="home-page__loading">Carregando...</p>}

        {!loading && error && <p className="home-page__error">{error}</p>}

        {!loading && !error && apiData && (
          <div className="home-page__api-response">
            {typeof apiData.message === "string" && (
              <p className="home-page__message">{apiData.message}</p>
            )}

{/*
            {typeof apiData.status === "string" && (
              <span className="home-page__status">
                Status: {apiData.status}
              </span>
            )}

          <div className="home-page__message">
              <span
                className={`home-page__status ${
                  apiData.status === "online" ? "home-page__status--online" : ""
                }`}
              >
                <span 
                className="home-page__status-dot" 
                aria-hidden="true" 
                />
                
                Sistema {apiData.status}
              </span>
            </div>
*/ }         </div>
        )}

        <nav className="home-page__nav">
          {isAuthenticated ? (
            <>
              <Link
                className="home-page__link home-page__link--primary"
                to="/dashboard"
              >
                Ir para área logada
              </Link>
              <Link
                className="home-page__link home-page__link--secondary"
                to="/profile"
              >
                Meu perfil
              </Link>
            </>
          ) : (
            <>
              <Link
                className="home-page__link home-page__link--primary"
                to="/login"
              >
                Entrar
              </Link>
              <Link
                className="home-page__link home-page__link--secondary"
                to="/register"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </section>
    </main>
  );
}
