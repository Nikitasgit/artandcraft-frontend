import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FurnitureCardStats from "../FurnitureCardStats/FurnitureCardStats";
import "./FurnitureCard.css";

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

interface FurnitureCardProps {
  furniture: Furniture;
  onDelete?: (furnitureId: string) => void;
}

function FurnitureCard({ furniture, onDelete }: FurnitureCardProps) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleKeywordClick = (keyword: string) => {
    navigate(`/material/${encodeURIComponent(keyword)}`);
  };

  const handleEditClick = () => {
    navigate(`/furniture/edit/${furniture._id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await axios.delete(
        `http://localhost:3001/api/furniture/${furniture._id}`,
        {
          withCredentials: true,
        }
      );

      // Call the parent's onDelete callback to refresh the list
      if (onDelete) {
        onDelete(furniture._id);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du meuble:", error);
      setDeleteError(
        "Erreur lors de la suppression du meuble. Veuillez réessayer."
      );
    } finally {
      setDeleting(false);
      if (!deleteError) {
        setShowDeleteConfirm(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  return (
    <div className="furniture-card">
      <div className="furniture-header">
        <h3>{furniture.name}</h3>
        <div className="furniture-header-actions">
          <span className="category-badge">{furniture.category?.name}</span>
          <button
            className="edit-button"
            onClick={handleEditClick}
            disabled={deleting}
            title="Modifier ce meuble"
          >
            ✏️
          </button>
          <button
            className="delete-button"
            onClick={handleDeleteClick}
            disabled={deleting}
            title="Supprimer ce meuble"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="furniture-details">
        <p>
          <strong>Quantité:</strong> {furniture.quantity || 0}
        </p>

        <div className="materials-section">
          <strong>Matériaux:</strong>
          <ul className="materials-list">
            {furniture.materials?.map((material, index) => (
              <li key={index}>
                {material.material?.name} - {material.quantity} unités
                <span className="supplier-info">
                  (Fournisseur: {material.material?.supplier?.name})
                </span>
              </li>
            )) || <li>Aucun matériau</li>}
          </ul>
        </div>

        {furniture.keywords?.length > 0 && (
          <div className="keywords-section">
            <strong>Mots-clés:</strong>
            <div className="keywords-tags">
              {furniture.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="keyword-tag clickable"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <FurnitureCardStats materials={furniture.materials || []} />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-modal">
            <h3>Confirmer la suppression</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer le meuble "{furniture.name}" ?
              Cette action est irréversible.
            </p>

            {deleteError && <div className="error-message">{deleteError}</div>}

            <div className="delete-confirmation-actions">
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FurnitureCard;
