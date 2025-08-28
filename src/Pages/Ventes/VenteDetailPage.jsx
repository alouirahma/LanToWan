// src/Pages/Ventes/VenteDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Save, Ban, Loader2, ArrowLeft, FileText, Download } from "lucide-react";
import { VenteProvider, useVente } from "@/Pages/Ventes/VenteContext";
import VenteDetailContent from "@/Pages/Ventes/VenteDetailContent";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FactureComponent } from "./FacturePDF";

const API_BASE_URL = "http://localhost:8081";

const fetchVenteById = async (id) => {
  const { data } = await axios.get(`${API_BASE_URL}/vente/${id}`);
  return {
    ...data,
    dateCreation: data.dateCreation ? new Date(data.dateCreation).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    venteProduits: data.venteProduits || [],
  };
};

const saveVente = async ({ venteData, documentFile }) => {
  console.log("Data being sent:", JSON.stringify(venteData, null, 2));

  if (!documentFile) {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = venteData.id
      ? await axios.put(`${API_BASE_URL}/vente/${venteData.id}`, venteData, config)
      : await axios.post(`${API_BASE_URL}/vente`, venteData, config);
    return data;
  }

  const formData = new FormData();
  formData.append("vente", JSON.stringify(venteData));
  formData.append("documentFile", documentFile);

  const config = { headers: { "Content-Type": "multipart/form-data" } };
  const { data } = venteData.id
    ? await axios.put(`${API_BASE_URL}/vente/${venteData.id}`, formData, config)
    : await axios.post(`${API_BASE_URL}/vente`, formData, config);
  return data;
};

const fetchClients = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/personne/clients`);
  return data.map(client => ({
    id: client.id,
    nom: client.nom,
    matriculeFiscaleC: client.matriculeFiscaleC || ""
  }));
};

const fetchProduits = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/produit`);
  return data.map(produit => ({ id: produit.id, nom: produit.nom, ref: produit.ref, prixUnitaire: produit.prixUnitaire }));
};

const mapUIToRequestData = (id, context) => {
  const montantTotal = context.produits.reduce((sum, p) => sum + (p.unitPrice * p.qte * (1 - (p.rem || 0) / 100)), 0);

  return {
    id,
    numeroVente: context.vente.numeroVente || "",
    facture: context.vente.facture || "",
    modePaiement: context.vente.modePaiement || "virement",
    montantTotal,
    documentPaiement: context.vente.documentPaiement || "",
    dinardTimbre: context.vente.dinardTimbre || false,
    dateCreation: context.vente.dateCreation || new Date().toISOString().split("T")[0],
    dateModification: new Date().toISOString().split("T")[0],
    typeVente: context.vente.typeVente || "FACTURE",
    client: { id: context.client.id || null }
  };
};

const mapResponseToUIData = (data) => ({
  vente: {
    id: data.id,
    numeroVente: data.numeroVente,
    dateCreation: data.dateCreation ? new Date(data.dateCreation).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    modePaiement: data.modePaiement?.name || "virement",
    facture: data.facture || "",
    montantTotal: data.montantTotal || 0,
    documentPaiement: data.documentPaiement || "",
    dinardTimbre: data.dinardTimbre || false,
    dateModification: data.dateModification ? new Date(data.dateModification).toISOString().split("T")[0] : null,
    typeVente: data.typeVente || "FACTURE"
  },
  client: { id: data.client?.id, nom: data.client?.nom || "", matriculeFiscaleC: data.client?.matriculeFiscaleC || "" },
  produits: data.venteProduits?.map(p => ({
    ...p.produit,
    qte: p.quantite,
    rem: p.remise || 0,
    tva: p.tva || 19
  })) || [], // Mapper les produits depuis venteProduits
  tvaData: data.tvaData || [],
});

const getDefaultInitialData = () => ({
  vente: { numeroVente: "", dateCreation: new Date().toISOString().split("T")[0], modePaiement: "virement", facture: "", dinardTimbre: false, typeVente: "FACTURE" },
  client: { id: null, nom: "", matriculeFiscaleC: "" },
  produits: [],
  tvaData: [],
});

const VenteDetailView = ({ onSave, isSaving, fetchedClients, fetchedProduits, onCreateProduit, isCreatingProduit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const venteContext = useVente();
  const [documentFile, setDocumentFile] = useState(null);

  const handleSave = () => {
    const finalData = mapUIToRequestData(id, venteContext);
    onSave({ venteData: finalData, documentFile });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate("/vente")} variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour
              </Button>
              <div className="h-6 w-px bg-slate-200"></div>
              <h1 className="text-lg font-semibold text-slate-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-slate-600" />
                {id ? `Modifier la vente ${venteContext.vente?.numeroVente || ''}` : "Nouvelle vente"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate("/vente")} variant="outline">
                <Ban className="h-4 w-4 mr-2" /> Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                <FactureComponent />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <VenteDetailContent clients={fetchedClients} produits={fetchedProduits} onFileChange={setDocumentFile} onCreateProduit={onCreateProduit} isCreatingProduit={isCreatingProduit} />
    </div>
  );
};

function VenteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = useState(null);

  const { data: fetchedVente, isLoading, isError, error } = useQuery({
    queryKey: ["vente", id],
    queryFn: () => fetchVenteById(id),
    enabled: !!id,
  });

  const { data: fetchedClients = [] } = useQuery({ queryKey: ["clients"], queryFn: fetchClients });
  const { data: fetchedProduits = [] } = useQuery({ queryKey: ["produits"], queryFn: fetchProduits });

  const saveMutation = useMutation({
    mutationFn: saveVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
      if (id) queryClient.invalidateQueries({ queryKey: ["vente", id] });
      toast.success("Vente enregistrée avec succès !");
      navigate("/vente");
    },
    onError: (err) => toast.error(`Erreur: ${err.response?.data?.message || err.message}`),
  });

  useEffect(() => {
    if (id) {
      if (fetchedVente) setInitialData(mapResponseToUIData(fetchedVente));
    } else {
      setInitialData(getDefaultInitialData());
    }
  }, [fetchedVente, id]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="flex h-screen items-center justify-center"><div className="text-red-600">{error.message}</div></div>;
  if (!initialData) return null;

  return (
    <VenteProvider initialData={initialData}>
      <VenteDetailView
        onSave={saveMutation.mutate}
        isSaving={saveMutation.isPending}
        fetchedClients={fetchedClients}
        fetchedProduits={fetchedProduits}
      />
    </VenteProvider>
  );
}

export default VenteDetailPage;