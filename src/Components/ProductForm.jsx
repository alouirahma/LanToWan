import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import axios from "axios";
import { ChevronDown, Tag, FileText, Package, DollarSign, Hash, Layers, BarChart, AlertCircle, CheckCircle, RotateCcw } from "lucide-react";

function ProductForm({ initialData, onSave, onCancel }) {
  const initialFormState = {
    ref: "",
    nom: "",
    qtePhy: "",
    qteTheo: "",
    prixUnitaire: "",
    comptable: false,
    numSerie: "",
    bareCode: "",
    catProd: "",
    taxProd: "",
  };

  const [formData, setFormData] = useState(initialData || initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function with enhanced rules
  const validateForm = () => {
    const newErrors = {};
    if (!formData.ref.trim()) newErrors.ref = "La référence est requise";
    else if (formData.ref.length > 50) newErrors.ref = "La référence ne doit pas dépasser 50 caractères";
    if (!formData.nom.trim()) newErrors.nom = "Le nom du produit est requis";
    else if (formData.nom.length > 100) newErrors.nom = "Le nom ne doit pas dépasser 100 caractères";
    if (formData.qtePhy === "" || formData.qtePhy < 0) newErrors.qtePhy = "Quantité physique invalide";
    else if (formData.qtePhy > 999999) newErrors.qtePhy = "Quantité physique trop grande";
    if (formData.qteTheo === "" || formData.qteTheo < 0) newErrors.qteTheo = "Quantité théorique invalide";
    else if (formData.qteTheo > 999999) newErrors.qteTheo = "Quantité théorique trop grande";
    if (formData.prixUnitaire === "" || formData.prixUnitaire <= 0) newErrors.prixUnitaire = "Prix unitaire invalide";
    else if (formData.prixUnitaire > 999999.99) newErrors.prixUnitaire = "Prix unitaire trop élevé";
    if (formData.taxProd === "") newErrors.taxProd = "Veuillez sélectionner une taxe";
    if (formData.numSerie && formData.numSerie.length > 50) newErrors.numSerie = "Numéro de série trop long";
    if (formData.bareCode && formData.bareCode.length > 50) newErrors.bareCode = "Code-barres trop long";
    if (formData.catProd && formData.catProd.length > 50) newErrors.catProd = "Catégorie trop longue";
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) || "" : value.trimStart(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle tax selection
  const handleTaxChange = (value) => {
    setFormData((prev) => ({ ...prev, taxProd: value }));
    setErrors((prev) => ({ ...prev, taxProd: "" }));
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialData || initialFormState);
    setErrors({});
    toast.info("Formulaire réinitialisé");
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Veuillez corriger les erreurs dans le formulaire", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (initialData) {
        response = await axios.put(`http://localhost:8081/produit/${initialData.id}`, formData);
        toast.success("Produit modifié avec succès", { icon: <CheckCircle className="h-5 w-5 text-green-500" /> });
      } else {
        response = await axios.post(`http://localhost:8081/produit`, formData);
        toast.success("Produit créé avec succès", { icon: <CheckCircle className="h-5 w-5 text-green-500" /> });
      }
      onSave(response.data);
    } catch (err) {
      let errorMsg = `Erreur lors de la ${initialData ? "modification" : "création"} : ${err.response?.status} - ${err.response?.statusText}`;
      if (err.response?.status === 405) {
        errorMsg = "Méthode non autorisée. Vérifiez l'URL de l'endpoint.";
      } else if (err.response?.status === 400) {
        errorMsg = err.response.data.message || "Données invalides. Vérifiez les champs requis.";
      } else if (err.response?.status === 500) {
        errorMsg = err.response.data.message || "Erreur interne du serveur.";
      }
      setErrors({ general: errorMsg });
      toast.error(errorMsg, { icon: <AlertCircle className="h-5 w-5 text-red-500" /> });
      console.error("Erreur :", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear errors when initialData changes
  useEffect(() => {
    setFormData(initialData || initialFormState);
    setErrors({});
  }, [initialData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-8 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-200"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Modifier le produit" : "Ajouter un produit"}
        </h2>
        <Button
          type="button"
          onClick={handleReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
          disabled={isSubmitting}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ref" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-500" /> Référence *
          </label>
          <Input
            id="ref"
            name="ref"
            value={formData.ref}
            onChange={handleChange}
            placeholder="Entrer la référence"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.ref ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.ref}
            aria-describedby={errors.ref ? "ref-error" : undefined}
          />
          {errors.ref && (
            <p id="ref-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.ref}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" /> Nom du produit *
          </label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Entrer le nom"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.nom ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? "nom-error" : undefined}
          />
          {errors.nom && (
            <p id="nom-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.nom}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="qtePhy" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500" /> Quantité physique *
          </label>
          <Input
            id="qtePhy"
            name="qtePhy"
            type="number"
            value={formData.qtePhy}
            onChange={handleChange}
            placeholder="Entrer la quantité physique"
            min="0"
            max="999999"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.qtePhy ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.qtePhy}
            aria-describedby={errors.qtePhy ? "qtePhy-error" : undefined}
          />
          {errors.qtePhy && (
            <p id="qtePhy-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.qtePhy}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="qteTheo" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500" /> Quantité théorique *
          </label>
          <Input
            id="qteTheo"
            name="qteTheo"
            type="number"
            value={formData.qteTheo}
            onChange={handleChange}
            placeholder="Entrer la quantité théorique"
            min="0"
            max="999999"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.qteTheo ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.qteTheo}
            aria-describedby={errors.qteTheo ? "qteTheo-error" : undefined}
          />
          {errors.qteTheo && (
            <p id="qteTheo-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.qteTheo}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="prixUnitaire" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" /> Prix unitaire *
          </label>
          <Input
            id="prixUnitaire"
            name="prixUnitaire"
            type="number"
            value={formData.prixUnitaire}
            onChange={handleChange}
            placeholder="Entrer le prix unitaire"
            step="0.01"
            min="0"
            max="999999.99"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.prixUnitaire ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.prixUnitaire}
            aria-describedby={errors.prixUnitaire ? "prixUnitaire-error" : undefined}
          />
          {errors.prixUnitaire && (
            <p id="prixUnitaire-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.prixUnitaire}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="numSerie" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Hash className="h-5 w-5 text-gray-500" /> Numéro de série
          </label>
          <Input
            id="numSerie"
            name="numSerie"
            value={formData.numSerie}
            onChange={handleChange}
            placeholder="Entrer le numéro de série"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.numSerie ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.numSerie}
            aria-describedby={errors.numSerie ? "numSerie-error" : undefined}
          />
          {errors.numSerie && (
            <p id="numSerie-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.numSerie}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="bareCode" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-gray-500" /> Code-barres
          </label>
          <Input
            id="bareCode"
            name="bareCode"
            value={formData.bareCode}
            onChange={handleChange}
            placeholder="Entrer le code-barres"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.bareCode ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.bareCode}
            aria-describedby={errors.bareCode ? "bareCode-error" : undefined}
          />
          {errors.bareCode && (
            <p id="bareCode-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.bareCode}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="catProd" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Layers className="h-5 w-5 text-gray-500" /> Catégorie
          </label>
          <Input
            id="catProd"
            name="catProd"
            value={formData.catProd}
            onChange={handleChange}
            placeholder="Entrer la catégorie"
            className={`border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
              errors.catProd ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isSubmitting}
            aria-invalid={!!errors.catProd}
            aria-describedby={errors.catProd ? "catProd-error" : undefined}
          />
          {errors.catProd && (
            <p id="catProd-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.catProd}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="taxProd" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" /> Taxe *
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between border-gray-300 hover:bg-gray-50 focus:border-indigo-600 focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200 ${
                  errors.taxProd ? "border-red-500 focus:ring-red-500" : ""
                }`}
                disabled={isSubmitting}
                aria-invalid={!!errors.taxProd}
                aria-describedby={errors.taxProd ? "taxProd-error" : undefined}
              >
                {formData.taxProd ? (formData.taxProd === "TAX_19" ? "19%" : "7%") : "Sélectionner une taxe"}
                <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
              <DropdownMenuLabel className="text-gray-700 font-medium">Choisir une taxe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleTaxChange("TAX_19")}
                className="hover:bg-indigo-50 text-gray-700 cursor-pointer py-2.5 font-medium"
              >
                19%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTaxChange("TAX_7")}
                className="hover:bg-indigo-50 text-gray-700 cursor-pointer py-2.5 font-medium"
              >
                7%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTaxChange("")}
                className="hover:bg-indigo-50 text-gray-700 cursor-pointer py-2.5 font-medium"
              >
                Aucune
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {errors.taxProd && (
            <p id="taxProd-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.taxProd}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="comptable" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" /> Comptable
          </label>
          <Checkbox
            id="comptable"
            name="comptable"
            checked={formData.comptable}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, comptable: checked }))}
            className="border-gray-300 focus:ring-indigo-600 h-5 w-5 rounded"
            disabled={isSubmitting}
            aria-describedby="comptable-description"
          />
          <span id="comptable-description" className="text-sm text-gray-500">
            Activer pour suivi comptable
          </span>
        </div>
      </div>
      {errors.general && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg shadow-sm">
          <AlertCircle className="h-6 w-6" />
          <span className="font-medium">{errors.general}</span>
        </div>
      )}
      <div className="flex gap-4 justify-end">
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Enregistrement...
            </span>
          ) : (
            "Enregistrer"
          )}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-2.5 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;