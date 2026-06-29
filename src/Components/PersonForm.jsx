import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axios from "axios";

function PersonForm({ type, initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      nom: "",
      adresse: "",
      email: "",
      telephone: "",
      matriculeFiscaleF: "",
      matriculeFiscaleC: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
      isValid = false;
    }
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est requis";
      isValid = false;
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Numéro de téléphone invalide";
      isValid = false;
    }
    if (type === "fournisseurs" && !formData.matriculeFiscaleF.trim()) {
      newErrors.matriculeFiscaleF = "Le matricule fiscal est requis pour les fournisseurs";
      isValid = false;
    }
    if (type === "clients" && !formData.matriculeFiscaleC.trim()) {
      newErrors.matriculeFiscaleC = "Le matricule fiscal est requis pour les clients";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs requis correctement");
      return;
    }
    setIsLoading(true);
    try {
      const typeUrlMap = {
        clients: "clients",
        fournisseurs: "fournisseurs",
        employes: "employees",
      };
      const typePath = typeUrlMap[type] || "clients";
      const personData = {
        ...formData,
        matriculeFiscale: formData.matriculeFiscaleF || formData.matriculeFiscaleC || null,
      };
      let response;
      console.log("Données envoyées :", personData); // Debug
      console.log("URL de la requête :", initialData ? `http://localhost:8081/personne/${typePath}/${initialData.id}` : `http://localhost:8081/personne/${typePath}`); // Debug
      if (initialData) {
        response = await axios.put(
          `http://localhost:8081/personne/${typePath}/${initialData.id}`,
          personData
        );
        toast.success("Personne modifiée avec succès");
      } else {
        response = await axios.post(
          `http://localhost:8081/personne/${typePath}`,
          personData
        );
        toast.success("Personne créée avec succès");
      }
      onSave(response.data);
    } catch (err) {
      let errorMsg = "Erreur lors de la sauvegarde";
      if (err.code === "ERR_NETWORK") {
        errorMsg = "Erreur réseau : impossible de se connecter au serveur. Vérifiez si le serveur est en cours d'exécution ou les paramètres CORS.";
      } else if (err.response) {
        if (err.response.status === 405) {
          errorMsg = "Méthode non autorisée. Vérifiez l'URL de l'endpoint.";
        } else if (err.response.status === 400) {
          errorMsg = err.response.data.message || "Données invalides.";
        } else if (err.response.status === 500) {
          errorMsg = err.response.data.message || "Erreur interne du serveur.";
        } else {
          errorMsg = `Erreur ${err.response.status} : ${err.response.statusText || "Erreur serveur"}`;
        }
      }
      setErrors({ global: errorMsg });
      toast.error(errorMsg);
      console.error("Erreur:", err.response?.data || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {initialData ? "Modifier" : "Ajouter"} {type === "clients" ? "Client" : type === "fournisseurs" ? "Fournisseur" : "Employé"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Entrez le nom"
            className="w-full"
            required
            aria-invalid={errors.nom ? "true" : "false"}
            aria-describedby={errors.nom ? "nom-error" : undefined}
          />
          {errors.nom && (
            <p id="nom-error" className="text-red-500 text-sm mt-1">{errors.nom}</p>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse *
          </label>
          <Input
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Entrez l'adresse"
            className="w-full"
            required
            aria-invalid={errors.adresse ? "true" : "false"}
            aria-describedby={errors.adresse ? "adresse-error" : undefined}
          />
          {errors.adresse && (
            <p id="adresse-error" className="text-red-500 text-sm mt-1">{errors.adresse}</p>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez l'email"
            className="w-full"
            required
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <Input
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="Entrez le numéro de téléphone"
            className="w-full"
            required
            aria-invalid={errors.telephone ? "true" : "false"}
            aria-describedby={errors.telephone ? "telephone-error" : undefined}
          />
          {errors.telephone && (
            <p id="telephone-error" className="text-red-500 text-sm mt-1">{errors.telephone}</p>
          )}
        </div>
        {(type === "fournisseurs" || type === "clients") && (
          <div className="col-span-1">
            <label
              htmlFor={type === "fournisseurs" ? "matriculeFiscaleF" : "matriculeFiscaleC"}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Matricule Fiscal *
            </label>
            <Input
              id={type === "fournisseurs" ? "matriculeFiscaleF" : "matriculeFiscaleC"}
              name={type === "fournisseurs" ? "matriculeFiscaleF" : "matriculeFiscaleC"}
              value={type === "fournisseurs" ? formData.matriculeFiscaleF : formData.matriculeFiscaleC}
              onChange={handleChange}
              placeholder="Entrez le matricule fiscal"
              className="w-full"
              required
              aria-invalid={
                type === "fournisseurs"
                  ? errors.matriculeFiscaleF ? "true" : "false"
                  : errors.matriculeFiscaleC ? "true" : "false"
              }
              aria-describedby={
                type === "fournisseurs"
                  ? errors.matriculeFiscaleF ? "matriculeFiscaleF-error" : undefined
                  : errors.matriculeFiscaleC ? "matriculeFiscaleC-error" : undefined
              }
            />
            {type === "fournisseurs" && errors.matriculeFiscaleF && (
              <p id="matriculeFiscaleF-error" className="text-red-500 text-sm mt-1">
                {errors.matriculeFiscaleF}
              </p>
            )}
            {type === "clients" && errors.matriculeFiscaleC && (
              <p id="matriculeFiscaleC-error" className="text-red-500 text-sm mt-1">
                {errors.matriculeFiscaleC}
              </p>
            )}
          </div>
        )}
        {errors.global && (
          <div className="col-span-2 text-red-500 text-sm">{errors.global}</div>
        )}
        <div className="col-span-2 flex gap-4 mt-4">
          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonForm;