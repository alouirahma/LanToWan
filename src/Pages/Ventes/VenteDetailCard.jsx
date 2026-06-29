import React, { useState, useEffect } from "react";
import { Edit3, Check, X, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { useVente } from "@/Pages/Ventes/VenteContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const VenteDetailsCard = () => {
  const { vente, setVente } = useVente();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(vente);

  useEffect(() => {
    setDraft(vente);
  }, [vente]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setVente(draft);
    setIsEditing(false);
    toast.success("Détails de la vente sauvegardés !");
  };

  const handleCancel = () => {
    setDraft(vente);
    setIsEditing(false);
  };

  const handleChange = (value, key) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={`transition-all duration-300 ease-in-out border-0 shadow-sm ${isEditing ? "shadow-lg ring-2 ring-gray-900 ring-offset-2" : "hover:shadow-md hover:translate-y-[-2px]"}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <span>DÉTAILS DE LA VENTE</span>
          </div>
          {!isEditing && <Button variant="ghost" size="sm" onClick={handleEdit} className="text-gray-500"><Edit3 className="h-4 w-4 mr-2" /> Modifier</Button>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Numéro</span>
          <div className="col-span-2">
            {isEditing ? <Input value={draft.numeroVente || ""} onChange={(e) => handleChange(e.target.value, "numeroVente")} className="font-mono" autoFocus /> : <span className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded block">{vente.numeroVente}</span>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Date</span>
          <div className="col-span-2">
            {isEditing ? <Input type="date" value={draft.dateCreation || ""} onChange={(e) => handleChange(e.target.value, "dateCreation")} /> : <span className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded block">{new Date(vente.dateCreation).toLocaleDateString("fr-FR")}</span>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Mode de Paiement</span>
          <div className="col-span-2">
            {isEditing ? (
              <Select value={draft.modePaiement || ""} onValueChange={(value) => handleChange(value, "modePaiement")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un mode..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cheque">Chèque</SelectItem>
                  <SelectItem value="virement">Virement</SelectItem>
                  <SelectItem value="traite">Traite</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded block">{vente.modePaiement}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Type de Vente</span>
          <div className="col-span-2">
            {isEditing ? (
              <Select value={draft.typeVente || ""} onValueChange={(value) => handleChange(value, "typeVente")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEMANDE_DE_PRIX">Demande de Prix</SelectItem>
                  <SelectItem value="COMMANDE">Commande</SelectItem>
                  <SelectItem value="BON_DE_RECEPTION">Bon de Réception</SelectItem>
                  <SelectItem value="RENVOI_DE_MARCHANDISES">Renvoi de Marchandises</SelectItem>
                  <SelectItem value="FACTURE">Facture</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded block">{vente.typeVente || "-"}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Timbre</span>
          <div className="col-span-2">
            {isEditing ? (
              <Input
                type="checkbox"
                checked={draft.dinardTimbre || false}
                onChange={(e) => handleChange(e.target.checked, "dinardTimbre")}
              />
            ) : (
              <span className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded block">{vente.dinardTimbre ? "Oui" : "Non"}</span>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button onClick={handleCancel} variant="outline" size="sm"><X className="h-4 w-4 mr-2" /> Annuler</Button>
            <Button onClick={handleSave} size="sm" className="bg-gray-900 text-white"><Check className="h-4 w-4 mr-2" /> Sauvegarder</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};