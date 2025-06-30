import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate("/");
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div>
      <h1>Logout</h1>
      <p>You have been successfully logged out.</p>
    </div>
  );
}

export default LogoutPage;
