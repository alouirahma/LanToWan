import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const venteProduitSchema = z.object({
  produitId: z.coerce.number().min(1, "Veuillez sélectionner un produit."),
  quantite: z.coerce.number().min(0.01, "La quantité doit être positive."),
  prixUnitaire: z.coerce.number().min(0, "Le prix ne peut pas être négatif."),
  tva: z.coerce.number().min(0, "La TVA ne peut pas être négative."),
  remise: z.coerce.number().min(0, "La remise ne peut pas être négative").optional(),
});

const venteSchema = z.object({
  numeroVente: z.string().min(1, "Le numéro de vente est requis."),
  dateCreation: z.string().min(1, "La date est requise."),
  modePaiement: z.enum(["CARTE", "ESPECES", "VIREMENT"]),
  facture: z.string().optional(),
  dinardTimbre: z.boolean().optional(),
  clientId: z.coerce.number().min(1, "Le client est requis."),
  venteProduits: z.array(venteProduitSchema).min(1, "Vous devez ajouter au moins un produit."),
  statut: z.string().optional(), // Ajout de statut
});

const API_BASE_URL = "http://localhost:8081/vente";

function VenteForm({ initialData, onSave, onCancel }) {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(venteSchema),
    defaultValues: initialData || {
      numeroVente: "",
      dateCreation: new Date().toISOString().split("T")[0],
      modePaiement: "CARTE",
      facture: "",
      dinardTimbre: false,
      clientId: undefined,
      statut: "payée",
      venteProduits: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "venteProduits",
  });

 function onSubmit(values) {
  const montantTotal = values.venteProduits.reduce((total, produit) => {
    const quantite = parseFloat(produit.quantite) || 0;
    const prixUnitaire = parseFloat(produit.prixUnitaire) || 0;
    const tva = parseFloat(produit.tva) || 0;
    const remise = parseFloat(produit.remise) || 0;
    const montantProduit = quantite * prixUnitaire * (1 + tva / 100) - remise;
    console.log(`Produit ${produit.produitId}: quantite=${quantite}, prixUnitaire=${prixUnitaire}, tva=${tva}, remise=${remise}, montant=${montantProduit}`);
    return total + montantProduit;
  }, 0) + (values.dinardTimbre ? 1 : 0);

  const payload = {
    ...values,
    montantTotal,
    client: { id: parseInt(values.clientId) },
    venteProduits: values.venteProduits.map((vp) => ({
      produit: { id: parseInt(vp.produitId) },
      quantite: parseFloat(vp.quantite),
      prixUnitaire: parseFloat(vp.prixUnitaire),
      tva: parseFloat(vp.tva),
      remise: parseFloat(vp.remise) || 0,
    })),
  };

  console.log("Payload envoyé :", JSON.stringify(payload, null, 2));

  axios
    .post(API_BASE_URL, payload)
    .then(() => {
      toast.success("Vente ajoutée avec succès !");
      navigate("/ventes");
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout :", error.response?.data || error.message);
      toast.error("Erreur lors de l'ajout de la vente : " + error.message);
    });
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un client..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Remplacer mockClients par une requête API réelle */}
                    {mockClients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numeroVente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de Vente</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateCreation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modePaiement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode de Paiement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CARTE">Carte</SelectItem>
                    <SelectItem value="ESPECES">Espèces</SelectItem>
                    <SelectItem value="VIREMENT">Virement</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facture</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dinardTimbre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timbre</FormLabel>
                <FormControl>
                  <input type="checkbox" checked={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Produits</h3>
          <div className="border rounded-md">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 p-2 border-b last:border-b-0 items-start">
                <div className="col-span-12 md:col-span-4">
                  <FormField
                    control={form.control}
                    name={`venteProduits.${index}.produitId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Produit..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Remplacer mockProduits par une requête API réelle */}
                            {mockProduits.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nom} ({p.ref})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`venteProduits.${index}.quantite`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Qté" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`venteProduits.${index}.prixUnitaire`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Prix U." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`venteProduits.${index}.tva`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="TVA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="19">19%</SelectItem>
                            <SelectItem value="7">7%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-5 md:col-span-1">
                  <FormField
                    control={form.control}
                    name={`venteProduits.${index}.remise`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Remise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 flex items-center">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ produitId: undefined, quantite: 1, prixUnitaire: 0, tva: 19, remise: 0 })}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
          <FormField
            control={form.control}
            name="venteProduits"
            render={() => <FormMessage />}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
}

export default VenteForm;