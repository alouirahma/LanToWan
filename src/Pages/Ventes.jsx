import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Loader2,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { FactureComponent } from "@/Pages/Ventes/FacturePDF";
import { VenteProvider } from "@/Pages/Ventes/VenteContext";

const API_BASE_URL = "http://localhost:8081/vente";

const fetchVentes = async () => {
  const { data } = await axios.get(API_BASE_URL);
  return data;
};

const deleteVente = async (venteId) => {
  return axios.delete(`${API_BASE_URL}/${venteId}`);
};

const addVente = async (venteData) => {
  const { data } = await axios.post(API_BASE_URL, venteData);
  return data;
};

function Ventes() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([{ id: "dateCreation", desc: true }]);

  const {
    data: ventes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ventes"],
    queryFn: fetchVentes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVente,
    onSuccess: (data, venteId) => {
      const deletedVente = ventes.find((v) => v.id === venteId);
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
      toast.success(`La vente '${deletedVente?.numeroVente || ""}' a été supprimée.`);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || err.message || "Une erreur est survenue.";
      toast.error(`Erreur lors de la suppression: ${errorMsg}`);
    },
  });

  const addMutation = useMutation({
    mutationFn: addVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
      toast.success("Vente ajoutée avec succès.");
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleAdd = () => {
    // Utiliser un ID de client valide (par exemple, vérifiez dans votre base de données)
    const validClientId = 1; // Remplacez par un ID existant ou récupérez dynamiquement
    const newVente = {
      numeroVente: `00${ventes.length + 1}/2025`,
      client: { id: validClientId }, // Assurez-vous que cet ID existe
      modePaiement: "virement",
      dinardTimbre: true,
      venteProduits: [
        { quantite: 2, prixUnitaire: 100.0, remise: 10.0, tva: 19.0, produit: { id: 1 } }, // Assurez-vous que le produit ID existe
      ],
    };
    addMutation.mutate(newVente);
  };

  const handleEdit = (vente) => {
    navigate(`/vente/${vente.id}`);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "numeroVente",
        header: "Numéro de Vente",
        cell: ({ row }) => row.original.numeroVente || "-",
      },
      {
        accessorKey: "client.nom",
        header: "Client",
        cell: ({ row }) => row.original.client?.nom || "-",
      },
      {
        accessorKey: "dateCreation",
        header: ({ column }) => (
          <div className="cursor-pointer flex items-center" onClick={() => column.toggleSorting()}>
            Date Création
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted()] ?? <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />}
          </div>
        ),
        cell: ({ row }) =>
          row.original.dateCreation
            ? new Date(row.original.dateCreation).toLocaleDateString("fr-FR")
            : "-",
      },
      {
        accessorKey: "montantTotal",
        header: "Montant Total",
        cell: ({ row }) => {
          const produits = row.original.venteProduits || [];
          const calculatedTotal = produits.reduce(
            (acc, p) => acc + (p.quantite * p.prixUnitaire * (1 - (p.remise || 0) / 100) * (1 + p.tva / 100)),
            0
          );
          return calculatedTotal != null
            ? new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "TND",
                minimumFractionDigits: 3,
              }).format(calculatedTotal)
            : "0,000 TND";
        },
      },
      {
        accessorKey: "modePaiement",
        header: "Mode Paiement",
        cell: ({ row }) => row.original.modePaiement || "-",
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => row.original.statut || "-",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const vente = row.original;
          const isDeleting = deleteMutation.isLoading && deleteMutation.variables === vente.id;

          const handlePrintFacture = () => {
            const initialData = {
              vente: {
                id: vente.id,
                numeroVente: vente.numeroVente,
                dateCreation: vente.dateCreation,
                modePaiement: vente.modePaiement,
                dinardTimbre: vente.dinardTimbre || false,
              },
              client: { nom: vente.client?.nom || "Nom du Client", matriculeFiscaleC: vente.client?.matriculeFiscaleC || "987654Y/AM0000" },
              produits: vente.venteProduits?.map(p => ({
                ref: p.produit?.ref || "N/A",
                nom: p.produit?.nom || "Produit",
                qte: p.quantite || 1,
                unitPrice: p.prixUnitaire || 0,
                rem: p.remise || 0,
                tva: p.tva || 19,
              })) || [],
              tvaData: vente.tvaData || [],
            };

            return (
              <VenteProvider initialData={initialData}>
                <FactureComponent />
              </VenteProvider>
            );
          };

          return (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(vente)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(vente.id)}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="w-4 h-4 mr-1" />
                {handlePrintFacture()}
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteMutation, handleEdit, navigate]
  );

  const table = useReactTable({
    data: ventes,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const exportToCSV = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const fileName = `liste_des_ventes_${formattedDate}.csv`;
    const headers = ["Numéro de Vente", "Client", "Date Création", "Montant Total", "Mode Paiement", "Statut"];
    const rows = table.getFilteredRowModel().rows.map((row) => {
      const vente = row.original;
      const produits = vente.venteProduits || [];
      const calculatedTotal = produits.reduce(
        (acc, p) => acc + (p.quantite * p.prixUnitaire * (1 - (p.remise || 0) / 100) * (1 + p.tva / 100)),
        0
      );
      return [
        `"${vente.numeroVente || "-"}"`,
        `"${vente.client?.nom || "-"}"`,
        `"${vente.dateCreation ? new Date(vente.dateCreation).toLocaleDateString("fr-FR") : "-"}"`,
        `"${calculatedTotal || 0}"`,
        `"${vente.modePaiement?.name || "-"}"`,
        `"${vente.statut || "-"}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <div className="p-4">Chargement des ventes...</div>;
  if (isError) return <div className="p-4 text-red-600">Erreur: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Ventes</h1>
      <div className="flex items-center gap-4 my-4">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une Vente
        </Button>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exporter CSV
        </Button>
        <Input
          placeholder="Filtrer les ventes..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune vente trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Ventes;