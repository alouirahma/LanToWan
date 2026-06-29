import React, { createContext, useContext, useState } from "react";

const VenteContext = createContext();

export function VenteProvider({ initialData, children }) {
  const [vente, setVente] = useState(initialData?.vente || {
    numeroVente: "",
    dateCreation: new Date().toISOString().split("T")[0],
    modePaiement: "virement",
    facture: "",
    dinardTimbre: false,
  });
  const [client, setClient] = useState(initialData?.client || { id: null, nom: "",  matriculeFiscaleC: "" });
  const [produits, setProduits] = useState(initialData?.produits || []);
  const [tvaData, setTvaData] = useState(initialData?.tvaData || []);

  const value = {
    vente, setVente,
    client, setClient,
    produits, setProduits,
    tvaData, setTvaData,
  };

  return <VenteContext.Provider value={value}>{children}</VenteContext.Provider>;
}

export const useVente = () => useContext(VenteContext);