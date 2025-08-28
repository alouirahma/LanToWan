import React, { useState, useEffect } from "react";
import { Edit3, Check, X, User } from "lucide-react";
import { toast } from "react-toastify";
import { useVente } from "@/Pages/Ventes/VenteContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ClientCard = ({ clients }) => {
  const { client, setClient } = useVente();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(client);

  useEffect(() => {
    setDraft(client);
  }, [client]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setClient(draft);
    setIsEditing(false);
    toast.success("Détails du client sauvegardés !");
  };

  const handleCancel = () => {
    setDraft(client);
    setIsEditing(false);
  };

  const handleChange = (value, key) => {
    const selectedClient = clients.find(c => c.id.toString() === value);
    if (selectedClient) {
      setDraft({
        id: selectedClient.id,
        nom: selectedClient.nom,
        matriculeFiscaleC: selectedClient.matriculeFiscaleC || ""
      });
      console.log("Selected Client:", selectedClient);
    } else {
      setDraft({ id: null, nom: "", matriculeFiscaleC: "" });
    }
  };

  return (
    <Card className={`transition-all duration-300 ease-in-out border-0 shadow-sm ${isEditing ? "shadow-lg ring-2 ring-gray-900 ring-offset-2" : "hover:shadow-md hover:translate-y-[-2px]"}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6" />
            <span>CLIENT</span>
          </div>
          {!isEditing && <Button variant="ghost" size="sm" onClick={handleEdit} className="text-gray-500"><Edit3 className="h-4 w-4 mr-2" /> Modifier</Button>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Nom</span>
          <div className="col-span-2">
            {isEditing ? (
              <Select value={draft.id?.toString() || ""} onValueChange={(value) => handleChange(value, "id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded block">{client.nom || "-"}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <span className="font-medium text-gray-700 text-sm uppercase tracking-wide">Matricule Fiscal</span>
          <div className="col-span-2">
            {isEditing ? (
              <Input
                value={draft.matriculeFiscaleC || ""}
                disabled
              />
            ) : (
              <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded block">{client.matriculeFiscaleC || "-"}</span>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" /> Annuler
            </Button>
            <Button onClick={handleSave} size="sm" className="bg-gray-900 text-white">
              <Check className="h-4 w-4 mr-2" /> Sauvegarder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};