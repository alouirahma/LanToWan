import React, { useState } from "react";
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
import { ChevronDown, Tag, FileText, Package, DollarSign, Hash, Layers, BarChart, AlertCircle } from "lucide-react";

function ProductForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
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
    }
  );
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value) || ""
          : value,
    });
  };

  const handleTaxChange = (value) => {
    setFormData({ ...formData, taxProd: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (initialData) {
        response = await axios.put(
          `http://localhost:8081/produit/${initialData.id}`,
          formData
        );
        toast.success("Produit modifié avec succès");
      } else {
        response = await axios.post(`http://localhost:8081/produit`, formData);
        toast.success("Produit créé avec succès");
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
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Erreur création :", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">
        {initialData ? "Modifier le produit" : "Ajouter un produit"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ref" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" /> Référence
          </label>
          <Input
            id="ref"
            name="ref"
            value={formData.ref}
            onChange={handleChange}
            placeholder="Entrer la référence"
            required
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" /> Nom du produit
          </label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Entrer le nom"
            required
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="qtePhy" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" /> Quantité physique
          </label>
          <Input
            id="qtePhy"
            name="qtePhy"
            type="number"
            value={formData.qtePhy}
            onChange={handleChange}
            placeholder="Entrer la quantité physique"
            required
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="qteTheo" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" /> Quantité théorique
          </label>
          <Input
            id="qteTheo"
            name="qteTheo"
            type="number"
            value={formData.qteTheo}
            onChange={handleChange}
            placeholder="Entrer la quantité théorique"
            required
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="prixUnitaire" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" /> Prix unitaire
          </label>
          <Input
            id="prixUnitaire"
            name="prixUnitaire"
            type="number"
            value={formData.prixUnitaire}
            onChange={handleChange}
            placeholder="Entrer le prix unitaire"
            step="0.01"
            required
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="numSerie" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" /> Numéro de série
          </label>
          <Input
            id="numSerie"
            name="numSerie"
            value={formData.numSerie}
            onChange={handleChange}
            placeholder="Entrer le numéro de série"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="bareCode" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <BarChart className="h-4 w-4 text-gray-500" /> Code-barres
          </label>
          <Input
            id="bareCode"
            name="bareCode"
            value={formData.bareCode}
            onChange={handleChange}
            placeholder="Entrer le code-barres"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="catProd" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Layers className="h-4 w-4 text-gray-500" /> Catégorie
          </label>
          <Input
            id="catProd"
            name="catProd"
            value={formData.catProd}
            onChange={handleChange}
            placeholder="Entrer la catégorie"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="taxProd" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" /> Taxe
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300 hover:bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
              >
                {formData.taxProd ? (formData.taxProd === "TAX_19" ? "19%" : "7%") : "Sélectionner une taxe"}
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-white shadow-lg rounded-md">
              <DropdownMenuLabel className="text-gray-700">Choisir une taxe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleTaxChange("TAX_19")}
                className="hover:bg-blue-50 text-gray-700 cursor-pointer"
              >
                19%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTaxChange("TAX_7")}
                className="hover:bg-blue-50 text-gray-700 cursor-pointer"
              >
                7%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTaxChange("")}
                className="hover:bg-blue-50 text-gray-700 cursor-pointer"
              >
                Aucune
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="comptable" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" /> Comptable
          </label>
          <Checkbox
            id="comptable"
            name="comptable"
            checked={formData.comptable}
            onCheckedChange={(checked) => setFormData({ ...formData, comptable: checked })}
            className="border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex gap-4 justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-sm"
        >
          Enregistrer
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-md shadow-sm"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;