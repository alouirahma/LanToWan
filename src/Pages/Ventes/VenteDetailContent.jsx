import React, { useEffect } from "react";
import { useVente } from "@/Pages/Ventes/VenteContext";
import { VenteDetailsCard } from "@/Pages/Ventes/VenteDetailCard";
import { ClientCard } from "@/Pages/Ventes/ClientCard";
import { TvaTable } from "@/Pages/Ventes/TvaTable";
import { TotalDisplay } from "@/Pages/Ventes/TotalDisplay";
import { Footer } from "@/Pages/Ventes/Footer";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

// Composant fictif pour Header
const Header = ({ onFileChange }) => (
  <div className="p-4 bg-gray-100">
    <input type="file" onChange={(e) => onFileChange(e.target.files[0])} className="w-full p-2 border" />
  </div>
);

// Composant pour ProduitsTable avec gestion interactive
const ProduitsTable = ({ availableProduits }) => {
  const { produits, setProduits } = useVente();
  const [newProduit, setNewProduit] = React.useState({ produitId: "", qte: 1, unitPrice: 0, rem: 0, tva: 19 });

  const addProduit = () => {
    if (newProduit.produitId) {
      const produit = availableProduits.find(p => p.id === parseInt(newProduit.produitId));
      setProduits([...produits, { ...newProduit, nom: produit.nom, unitPrice: produit.prixUnitaire || 0 }]);
      setNewProduit({ produitId: "", qte: 1, unitPrice: 0, rem: 0, tva: 19 });
    }
  };

  const updateProduit = (index, field, value) => {
    const updatedProduits = [...produits];
    updatedProduits[index] = { ...updatedProduits[index], [field]: value };
    setProduits(updatedProduits);
  };

  const removeProduit = (index) => {
    setProduits(produits.filter((_, i) => i !== index));
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">Produits</h3>
      <div className="mb-4 flex space-x-2">
        <Select value={newProduit.produitId} onValueChange={(value) => setNewProduit({ ...newProduit, produitId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un produit..." />
          </SelectTrigger>
          <SelectContent>
            {availableProduits.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>{p.nom} ({p.ref})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Qté" value={newProduit.qte} onChange={(e) => setNewProduit({ ...newProduit, qte: parseFloat(e.target.value) || 1 })} />
        <Input type="number" placeholder="Remise (%)" value={newProduit.rem} onChange={(e) => setNewProduit({ ...newProduit, rem: parseFloat(e.target.value) || 0 })} />
        <Select value={newProduit.tva.toString()} onValueChange={(value) => setNewProduit({ ...newProduit, tva: parseFloat(value) })}>
          <SelectTrigger>
            <SelectValue placeholder="TVA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="19">19%</SelectItem>
            <SelectItem value="7">7%</SelectItem>
             <SelectItem value="0">0%</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addProduit} variant="outline"><Plus className="h-4 w-4" /></Button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Produit</th>
            <th className="p-2 text-right">Qté</th>
            <th className="p-2 text-right">Prix Unitaire</th>
            <th className="p-2 text-right">Remise (%)</th>
            <th className="p-2 text-right">TVA (%)</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{p.nom}</td>
              <td className="p-2 text-right">
                <Input type="number" value={p.qte} onChange={(e) => updateProduit(index, "qte", parseFloat(e.target.value) || 1)} />
              </td>
              <td className="p-2 text-right">
                <Input type="number" value={p.unitPrice} onChange={(e) => updateProduit(index, "unitPrice", parseFloat(e.target.value) || 0)} />
              </td>
              <td className="p-2 text-right">
                <Input type="number" value={p.rem} onChange={(e) => updateProduit(index, "rem", parseFloat(e.target.value) || 0)} />
              </td>
              <td className="p-2 text-right">
                <Select value={p.tva.toString()} onValueChange={(value) => updateProduit(index, "tva", parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="19">19%</SelectItem>
                    <SelectItem value="7">7%</SelectItem>
                    <SelectItem value="0">0%</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-2 text-right">
                <Button variant="ghost" onClick={() => removeProduit(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const VenteDetailContent = ({ clients, produits: availableProduits, onFileChange }) => {
  const { client, setClient } = useVente();

  useEffect(() => {
    if (clients.length > 0 && !client.id) {
      setClient(clients[0]); // Sélectionne le premier client par défaut
    }
  }, [clients, client, setClient]);

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-xl">
      <Header onFileChange={onFileChange} />
      <main className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VenteDetailsCard />
          <ClientCard clients={clients} />
        </div>
        <ProduitsTable availableProduits={availableProduits} />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <TvaTable />
          </div>
          <div className="col-span-2">
            <TotalDisplay />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VenteDetailContent;