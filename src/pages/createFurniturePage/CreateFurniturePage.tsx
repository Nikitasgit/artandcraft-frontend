import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { FurnitureFormData, Category, Material } from "../../types";
import "./CreateFurniturePage.css";

function CreateFurniturePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState<FurnitureFormData>({
    name: "",
    category: "",
    materials: [],
    keywords: [],
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const getSuggestedKeywords = () => {
    const selectedMaterials = materials.filter((material) =>
      formData.materials.some((m) => m.material === material._id)
    );

    const allKeywords = selectedMaterials.flatMap(
      (material) => material.keywords || []
    );
    const uniqueKeywords = [...new Set(allKeywords)];

    return uniqueKeywords;
  };

  const addKeyword = (keyword: string) => {
    if (!formData.keywords.includes(keyword)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
      }));
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keywordToRemove),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [categoriesResponse, materialsResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/categories"),
          axios.get("http://localhost:3001/api/materials"),
        ]);
        setCategories(categoriesResponse.data.data || []);
        setMaterials(materialsResponse.data.data || []);
        if (isEditMode && id) {
          const furnitureResponse = await axios.get(
            `http://localhost:3001/api/furniture/${id}`,
            { withCredentials: true }
          );
          const furniture = furnitureResponse.data.data;
          setFormData({
            name: furniture.name,
            category: furniture.category?._id || "",
            materials: furniture.materials.map(
              (m: { material: Material; quantity: number }) => ({
                material: m.material?._id,
                quantity: m.quantity,
              })
            ),
            keywords: furniture.keywords || [],
            quantity: furniture.quantity || 1,
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleMaterialChange = (materialId: string) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.some((m) => m.material === materialId)
        ? prev.materials.filter((m) => m.material !== materialId)
        : [...prev.materials, { material: materialId, quantity: 1 }],
    }));
  };

  const handleMaterialQuantityChange = (
    materialId: string,
    quantity: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.map((m) =>
        m.material === materialId
          ? { ...m, quantity: Math.max(1, quantity) }
          : m
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (isEditMode && id) {
        response = await axios.put(
          `http://localhost:3001/api/furniture/${id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          "http://localhost:3001/api/furniture",
          formData,
          { withCredentials: true }
        );
      }

      if (response.data.data) {
        setSuccess(
          isEditMode
            ? "Meuble modifié avec succès!"
            : "Meuble créé avec succès!"
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        axiosError.response?.data?.message ||
        (isEditMode
          ? "Une erreur est survenue lors de la modification du meuble"
          : "Une erreur est survenue lors de la création du meuble");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.category !== "" &&
      formData.materials.length > 0 &&
      formData.quantity > 0
    );
  };

  if (dataLoading) {
    return (
      <div className="create-furniture-container">
        <div>Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="create-furniture-container">
      <h2>{isEditMode ? "Modifier le meuble" : "Créer un nouveau meuble"}</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nom du meuble *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            required
            placeholder="Ex: Chaise de bureau ergonomique"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Catégorie *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="form-select"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Matériaux *</label>
          <div className="materials-grid">
            {materials.map((material) => (
              <div key={material._id} className="material-item">
                <div className="material-selection">
                  <input
                    type="checkbox"
                    id={`material-${material._id}`}
                    checked={formData.materials.some(
                      (m) => m.material === material._id
                    )}
                    onChange={() => handleMaterialChange(material._id)}
                    disabled={loading}
                    className="material-checkbox"
                  />
                  <label
                    htmlFor={`material-${material._id}`}
                    className="material-label"
                  >
                    {material.name}
                  </label>
                </div>
                {formData.materials.some(
                  (m) => m.material === material._id
                ) && (
                  <div className="material-quantity">
                    <label
                      htmlFor={`quantity-${material._id}`}
                      className="quantity-label"
                    >
                      Quantité:
                    </label>
                    <input
                      type="number"
                      id={`quantity-${material._id}`}
                      value={
                        formData.materials.find(
                          (m) => m.material === material._id
                        )?.quantity || 1
                      }
                      onChange={(e) =>
                        handleMaterialQuantityChange(
                          material._id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      disabled={loading}
                      min="1"
                      className="quantity-input"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Mots-clés</label>

          {formData.materials.length > 0 ? (
            <div className="suggested-keywords">
              <div className="keywords-suggestions">
                {getSuggestedKeywords().map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => addKeyword(keyword)}
                    className="keyword-suggestion-btn"
                    disabled={loading}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-materials-message">
              Sélectionnez des matériaux pour voir les mots-clés suggérés
            </div>
          )}

          {formData.keywords.length > 0 && (
            <div className="current-keywords">
              <label className="form-label">Mots-clés sélectionnés:</label>
              <div className="keywords-display">
                {formData.keywords.map((keyword) => (
                  <span key={keyword} className="keyword-tag">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="keyword-remove-btn"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quantity" className="form-label">
            Quantité *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            disabled={loading}
            required
            min="1"
            placeholder="1"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="btn btn-primary"
          >
            {loading
              ? isEditMode
                ? "Modification en cours..."
                : "Création en cours..."
              : isEditMode
              ? "Enregistrer les modifications"
              : "Créer le meuble"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="btn btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateFurniturePage;
