import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import "./dashboard.page.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userName, user, logout, loadCurrentUser, token } = useAuth();

  useEffect(() => {
    if (token && !user) {
      loadCurrentUser(token);
    }
  }, [token, user, loadCurrentUser]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <section className="dashboard-page">
      <header className="dashboard-page__header">
        <div>
          <Link to={"/"}>Página Inicial</Link>
        </div>
        <div>
          <h2>Área logada</h2>
          <p>Bem-vindo{userName ? `, ${userName}` : ""}!</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className="dashboard-page__cards">
        <article>
          <h3>Meu perfil</h3>
          <p>Atualize nome, CPF e senha. O e-mail não pode ser alterado.</p>
          <Link to="/profile">Editar perfil</Link>
        </article>

        <article>
          <h3>Próximos módulos</h3>
          <p>Categorias, produtos e pedidos serão implementados na próxima fase.</p>
        </article>
      </div>
    </section>
  );
}
