import * as React from "react";
import axios from "axios";
import NavigationMenu from "./NavigationMenu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PersonForm from "./PersonForm";

const GenericDataManager = ({ title, apiUrl, navOptions, columns, filterKey }) => {
  const [view, setView] = React.useState(navOptions[0].value);
  const [data, setData] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Charger les données depuis l'API
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [apiUrl]);

  // Filtrer les données
  const filteredData = data
    .filter((item) => view === "all" || item.type === view)
    .filter((item) => item[filterKey]?.toLowerCase().includes(filter.toLowerCase()));

  // Exporter en CSV
  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = filteredData.map((item) =>
      columns.map((col) => `"${item[col.key] || item[col.fallbackKey] || ""}"`).join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.csv`;
    link.click();
  };

  // Gérer l'ajout ou la modification
  const handleSave = (newItem) => {
    if (editingItem) {
      // Mise à jour
      setData(data.map((item) => (item.id === newItem.id ? newItem : item)));
    } else {
      // Ajout
      setData([...data, newItem]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  // Supprimer une personne
  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`http://localhost:8081/personne/${type}/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {/* Menu de navigation */}
      <NavigationMenu
        options={navOptions}
        selectedOption={view}
        onSelect={(value) => setView(value)}
      />

      {/* Boutons d'action et filtrage */}
      <div className="flex gap-4 mb-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingItem(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-transform">
              Créer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <PersonForm
              type={view === "all" ? "clients" : view}
              initialData={editingItem}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition-transform"
        >
          Exporter en CSV
        </Button>
        <Input
          placeholder={`Filtrer par ${filterKey}...`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Tableau */}
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {item[col.key] || item[col.fallbackKey] || ""}
                  </TableCell>
                ))}
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-100"
                    onClick={() => {
                      setEditingItem(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    Éditer
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleDelete(item.id, item.type)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default GenericDataManager;
