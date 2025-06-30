import { Link } from "react-router-dom";
import "./HomePage.css";
import { useAuth } from "../../hooks/useAuth";

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="home-content">
        <h1>Art & Craft</h1>
        <p>Gérez vos projets de meubles et matériaux en toute simplicité</p>
        <div className="home-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-secondary">
              Accéder au tableau de bord
            </Link>
          ) : (
            <Link to="/login" className="btn btn-secondary">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
