import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearError();

    if (!email.trim() || !password.trim()) {
      return;
    }

    const success = await register({ email, password });
    if (success) {
      navigate("/login");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) clearError();
  };

  return (
    <div className="register">
      <div className="register-form">
        <h2>Inscription</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={loading}
            />
            <div className="password-requirements">
              <small>
                Le mot de passe doit contenir au moins :
                <ul>
                  <li>12 caractères</li>
                  <li>Une lettre majuscule</li>
                  <li>Un chiffre</li>
                  <li>Un caractère spécial (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                </ul>
              </small>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Enregistrement..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
