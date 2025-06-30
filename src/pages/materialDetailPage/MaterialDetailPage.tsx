import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MaterialDetailPage.css";

interface Material {
  _id: string;
  name: string;
  description: string;
  keywords: string[];
  supplier: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

function MaterialDetailPage() {
  const { keyword } = useParams<{ keyword: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterialByKeyword = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/materials/keyword/${encodeURIComponent(
            keyword || ""
          )}`,
          {
            withCredentials: true,
          }
        );

        setMaterial(response.data.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(`Aucun matériau trouvé avec le mot-clé "${keyword}"`);
        } else {
          setError("Une erreur est survenue");
        }
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchMaterialByKeyword();
    }
  }, [keyword]);

  if (loading) {
    return (
      <div className="material-detail-page">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="material-detail-page">
        <div className="error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="material-detail-page">
        <div className="no-results">
          <p>Aucun matériau trouvé avec le mot-clé "{keyword}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="material-detail-page">
      <h1>Détails du matériau</h1>
      <div className="material-content">
        <div className="material-card">
          <div className="material-info">
            <h2>{material.name}</h2>

            {material.description && (
              <div className="description-section">
                <h3>Description</h3>
                <p>{material.description}</p>
              </div>
            )}

            <div className="supplier-section">
              <h3>Fournisseur</h3>
              <p className="supplier-name">{material.supplier.name}</p>
            </div>

            {material.keywords && material.keywords.length > 0 && (
              <div className="keywords-section">
                <h3>Mots-clés associés</h3>
                <div className="keywords-tags">
                  {material.keywords.map((kw, index) => (
                    <span key={index} className={`keyword-tag`}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="metadata-section">
              <p>
                <strong>Mot-clé sélectionné:</strong> {keyword}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialDetailPage;
