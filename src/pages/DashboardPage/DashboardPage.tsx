import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import FurnitureCard from "../../components/FurnitureCard/FurnitureCard";
import "./DashboardPage.css";

interface Furniture {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  materials: {
    material: {
      _id: string;
      name: string;
      supplier: {
        _id: string;
        name: string;
      };
    };
    quantity: number;
  }[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserFurniture = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3001/api/furniture/user",
          {
            withCredentials: true,
          }
        );
        setFurniture(response.data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des meubles:", err);
        setError("Erreur lors du chargement de vos meubles");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFurniture();
  }, []);

  const handleDeleteFurniture = (furnitureId: string) => {
    setFurniture((prevFurniture) =>
      prevFurniture.filter((item) => item._id !== furnitureId)
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.email}</p>
        <button
          onClick={() => navigate("/furniture/create")}
          className="btn btn-primary"
        >
          Créer un nouveau meuble
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Chargement de vos meubles...</div>
      ) : furniture.length === 0 ? (
        <div className="empty-state">
          <p>Vous n'avez pas encore créé de meubles.</p>
        </div>
      ) : (
        <div className="furniture-grid">
          {furniture.map((item) => (
            <FurnitureCard
              key={item._id}
              furniture={item}
              onDelete={handleDeleteFurniture}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
