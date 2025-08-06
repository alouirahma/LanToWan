
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Download, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ProductForm from "@/Components/ProductForm";

function Produit() {
  const [produits, setProduits] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/produit")
      .then((response) => {
        setProduits(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des produits");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const filteredProduits = produits.filter((produit) =>
    (produit.nom || "").toLowerCase().includes(filter.toLowerCase())
  );

  const getTaxLabel = (taxProd) => {
    if (!taxProd) return '-';
    const taxMap = {
      TAX_19: '19%',
      TAX_7: '7%',
    };
    return taxMap[taxProd] || taxProd;
  };

  const exportToCSV = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const fileName = `produits_${formattedDate}.csv`;

    const headers = [
      "Référence",
      "Nom",
      "Quantité physique",
      "Quantité théorique",
      "Prix unitaire",
      "Comptable",
      "Numéro de série",
      "Code-barres",
      "Catégorie",
      "Taxe",
    ];
    const rows = filteredProduits.map((produit) => [
      `"${produit.ref || '-'}"`,
      `"${produit.nom || '-'}"`,
      produit.qtePhy || '-',
      produit.qteTheo || '-',
      produit.prixUnitaire || '-',
      produit.comptable ? "Oui" : "Non",
      `"${produit.numSerie || '-'}"`,
      `"${produit.bareCode || '-'}"`,
      `"${produit.catProd || '-'}"`,
      `"${getTaxLabel(produit.taxProd)}"`,
    ]);
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleAdd = () => {
    setSelectedProduit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (produit) => {
    setSelectedProduit(produit);
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedProduit) => {
    try {
      let response;
      if (selectedProduit) {
        response = await axios.put(
          `http://localhost:8081/produit/${updatedProduit.id}`,
          updatedProduit
        );
        setProduits(
          produits.map((p) =>
            p.id === updatedProduit.id ? response.data : p
          )
        );
        toast.success("Produit modifié avec succès");
      } else {
        response = await axios.post(`http://localhost:8081/produit`, updatedProduit);
        setProduits([...produits, response.data]);
        toast.success("Produit créé avec succès");
      }
      setIsDialogOpen(false);
      setSelectedProduit(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Erreur lors de la sauvegarde : ${err.response?.status} - ${err.response?.statusText}`;
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Erreur sauvegarde :", err);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedProduit(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/produit/${id}`);
      setProduits(produits.filter((p) => p.id !== id));
      toast.success("Produit supprimé avec succès");
    } catch (err) {
      let errorMsg = `Erreur lors de la suppression : ${err.response?.status} - ${err.response?.statusText}`;
      if (err.response?.status === 404) {
        errorMsg = "Le produit n'existe pas.";
      } else if (err.response?.status === 409) {
        errorMsg = err.response.data.message || "Impossible de supprimer : le produit est associé à des ventes.";
      } else if (err.response?.status === 500) {
        errorMsg = err.response.data.message || "Erreur interne du serveur.";
      }
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Erreur suppression :", err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Gestion des Produits</h1>
      <div className="flex items-center gap-4 mb-6">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedProduit(null);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAdd}
            >
              <Plus className="w-5 h-5" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <ProductForm
              initialData={selectedProduit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
        <Button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-5 h-5" />
          Exporter
        </Button>
        <Input
          placeholder="Filtrer par nom..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table table-striped w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="px-4 py-2">Référence</th>
              <th className="px-4 py-2">Nom</th>
             <th className="px-4 py-2">Numéro de série</th>
              <th className="px-4 py-2">Qté Physique</th>
              <th className="px-4 py-2">Qté Théorique</th>
              <th className="px-4 py-2">Prix Unitaire</th>
              <th className="px-4 py-2">Comptable</th>
              <th className="px-4 py-2">Taxe</th>
              <th className="px-4 py-2">Catégorie</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduits.map((produit) => (
              <tr key={produit.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{produit.ref || '-'}</td>
                <td className="px-4 py-2">{produit.nom || '-'}</td>
                <td className="px-4 py-2">{produit.numSerie || '-'}</td>
                <td className="px-4 py-2">{produit.qtePhy || '-'}</td>
                <td className="px-4 py-2">{produit.qteTheo || '-'}</td>
                <td className="px-4 py-2">{produit.prixUnitaire || '-'}</td>
                <td className="px-4 py-2">{produit.comptable ? "Oui" : "Non"}</td>
                <td className="px-4 py-2">{getTaxLabel(produit.taxProd)}</td>
                 <td className="px-4 py-2">{produit.catProd || '-'}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    variant="outline"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-100"
                    onClick={() => handleEdit(produit)}
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(produit.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Produit;
