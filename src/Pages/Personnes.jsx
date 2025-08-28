import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import NavigationMenu from "@/Pages/NavigationMenu";
import PersonForm from "@/Components/PersonForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Download, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Personnes() {
  const [personnes, setPersonnes] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navOptions = [
    { label: "Tous", value: "all" },
    { label: "Clients", value: "clients" },
    { label: "Fournisseurs", value: "fournisseurs" },
    { label: "Employés", value: "employes" },
  ];

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8081/personne/fournisseurs"),
      axios.get("http://localhost:8081/personne/employes"),
      axios.get("http://localhost:8081/personne/clients"),
    ])
      .then(([fournisseurs, employes, clients]) => {
        const allPersonnes = [
          ...fournisseurs.data.map((p) => ({ ...p, type: "fournisseurs" })),
          ...employes.data.map((p) => ({ ...p, type: "employes" })),
          ...clients.data.map((p) => ({ ...p, type: "clients" })),
        ];
        setPersonnes(allPersonnes);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des personnes");
        toast.error("Erreur lors du chargement des personnes");
        console.error("Erreur chargement :", err);
        setLoading(false);
      });
  }, []);

  const filteredPersonnes = personnes
    .filter((person) => selectedType === "all" || person.type === selectedType)
    .filter((person) =>
      person.nom.toLowerCase().includes(filter.toLowerCase()) ||
      person.telephone.includes(filter)
    );

  const exportToCSV = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const fileName = `liste des personnes_${formattedDate}.csv`;
    const headers = ["Nom", "Adresse", "Email", "Téléphone", "Matricule Fiscal", "Type"];
    const rows = filteredPersonnes.map((person) => [
      `"${person.nom}"`,
      `"${person.adresse}"`,
      `"${person.email}"`,
      `"${person.telephone}"`,
      `"${person.matriculeFiscaleF || person.matriculeFiscaleC || '-'}"`,
      `"${person.type}"`,
    ]);
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleAdd = (type) => {
    setSelectedType(type);
    setSelectedPerson(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setSelectedType(person.type);
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedPerson) => {
    try {
      let response;
      const personData = { ...updatedPerson, type: selectedType };
      const typeUrlMap = {
        clients: "clients",
        fournisseurs: "fournisseurs",
        employes: "employees",
      };
      const baseUrl = "http://localhost:8081/personne";
      const typePath = typeUrlMap[selectedType] || "clients";

      if (selectedPerson) {
        response = await axios.put(
          `${baseUrl}/${typePath}/${updatedPerson.id}`,
          personData
        );
        setPersonnes(
          personnes.map((p) =>
            p.id === updatedPerson.id ? { ...response.data, type: selectedType } : p
          )
        );
        toast.success("Personne modifiée avec succès");
      } else {
        response = await axios.post(`${baseUrl}/${typePath}`, personData);
        setPersonnes([...personnes, { ...response.data, type: selectedType }]);
        toast.success("Personne ajoutée avec succès");
      }

      setIsDialogOpen(false);
      setSelectedType("all");
      setSelectedPerson(null);
    } catch (err) {
      let errorMsg = "Erreur lors de la sauvegarde";
      if (err.code === "ERR_NETWORK") {
        errorMsg = "Erreur réseau : impossible de se connecter au serveur. Vérifiez si le serveur est en cours d'exécution ou les paramètres CORS.";
      } else if (err.response) {
        errorMsg = `Erreur ${err.response.status} : ${err.response.statusText || "Erreur serveur"}`;
      }
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Erreur sauvegarde :", err.response?.data || err);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedType("all");
    setSelectedPerson(null);
  };

  const handleDelete = async (id, type) => {
    try {
      const typeUrlMap = {
        clients: "clients",
        fournisseurs: "fournisseurs",
        employes: "employees",
      };
      const typePath = typeUrlMap[type] || "clients";
      const url = `http://localhost:8081/personne/${typePath}/${id}`;
      console.log("Tentative de suppression :", url); // Debug
      await axios.delete(url);
      setPersonnes(personnes.filter((p) => p.id !== id));
      toast.success("Personne supprimée avec succès");
    } catch (err) {
      let errorMsg = "Erreur lors de la suppression";
      if (err.code === "ERR_NETWORK") {
        errorMsg = "Erreur réseau : impossible de se connecter au serveur. Vérifiez si le serveur est en cours d'exécution ou les paramètres CORS.";
      } else if (err.response) {
        errorMsg = `Erreur ${err.response.status} : ${err.response.statusText || "Erreur serveur"}`;
      }
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Erreur suppression :", err.response?.data || err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-4 text-gray-800">Gestion des Personnes</h1>

      <NavigationMenu
        options={navOptions}
        selectedOption={selectedType}
        onSelect={(value) => setSelectedType(value)}
      />

      <div className="flex items-center gap-4 mb-6">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedType("all");
              setSelectedPerson(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2 px-4 py-2"
              onClick={() => handleAdd(selectedType === "all" ? "clients" : selectedType)}
              aria-label="Ajouter une personne"
            >
              <Plus className="w-5 h-5" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <PersonForm
              type={selectedType === "all" ? "clients" : selectedType}
              initialData={selectedPerson}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
        <Button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2 px-4 py-2"
          aria-label="Exporter en CSV"
        >
          <Download className="w-5 h-5" />
          Exporter
        </Button>
        <Input
          placeholder="Filtrer par nom ou téléphone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-striped w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Adresse</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone</th>
              <th className="px-4 py-2">Matricule Fiscal</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonnes.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{person.nom}</td>
                <td className="px-4 py-2">{person.adresse}</td>
                <td className="px-4 py-2">{person.email}</td>
                <td className="px-4 py-2">{person.telephone}</td>
                <td className="px-4 py-2">{person.matriculeFiscaleF || person.matriculeFiscaleC || "-"}</td>
                <td className="px-4 py-2">{person.type}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    variant="outline"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all duration-200 flex items-center gap-2 px-3 py-1"
                    onClick={() => handleEdit(person)}
                    aria-label={`Modifier ${person.nom}`}
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all duration-200 flex items-center gap-2 px-3 py-1"
                    onClick={() => handleDelete(person.id, person.type)}
                    aria-label={`Supprimer ${person.nom}`}
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

export default Personnes;