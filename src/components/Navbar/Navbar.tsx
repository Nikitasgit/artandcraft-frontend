import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="navbar-loading">Loading...</div>;
  }

  const isLoggedIn = !!user;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/">Art & Craft</Link>
          </div>

          <ul className="navbar-menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {isLoggedIn ? (
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
