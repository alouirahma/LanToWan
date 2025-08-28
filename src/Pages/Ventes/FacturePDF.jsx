// src/Pages/Ventes/FacturePDF.jsx
import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";
import { useVente } from "@/Pages/Ventes/VenteContext";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#333333",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2pt solid #1e3a8a",
  },
  logo: {
    height: 50,
    width: 150,
    objectFit: "contain",
  },
  logoFallback: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  companyAddress: {
    fontSize: 10,
    textAlign: "right",
    color: "#666666",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
    border: "1pt solid #e5e7eb",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    padding: 8,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 6,
    fontSize: 9,
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    fontWeight: "bold",
  },
  totalLabel: {
    width: "80%",
    textAlign: "right",
  },
  totalValue: {
    width: "20%",
    textAlign: "right",
  },
  footer: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
    borderTop: "1pt solid #e5e7eb",
    paddingTop: 10,
  },
});

const calculateTvaAmount = (tax, produits) => {
  if (!produits || !Array.isArray(produits)) return 0;
  const totalForCode = produits.reduce((acc, p) => {
    if (String(p.tva) === String(tax)) {
      const ht = Number(p.qte || 0) * Number(p.unitPrice || 0) * (1 - Number(p.rem || 0) / 100);
      return acc + ht;
    }
    return acc;
  }, 0);
  return totalForCode * (tax / 100);
};

const FacturePDF = ({ vente, client, produits, tvaData }) => {
  const totalHT = produits.reduce((acc, p) => acc + (p.qte * p.unitPrice * (1 - (p.rem || 0) / 100)), 0);
  const totalTVA = tvaData.reduce((acc, t) => acc + calculateTvaAmount(t.rate, produits), 0);
  const totalTTC = totalHT + totalTVA;
  const TIMBRE_VALUE = 1.0; // Mis à jour à 1 DT comme demandé
  const timbre = vente.dinardTimbre ? TIMBRE_VALUE :1.0;
  const netAPayer = totalTTC + timbre;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* Tentative de chargement de l'image avec fallback */}
          {typeof window !== "undefined" && (
            <Image
              source={{ uri: "/img/LANTOWAN.png" }}
              style={styles.logo}
              onError={() => console.log("Échec du chargement de l'image")}
            />
          ) || <Text style={styles.logoFallback}>ARLE</Text>}
          <View style={styles.companyAddress}>
            <Text>AV Habib Boughatta, 2000 Le Bardo, Tunis, Tunisie</Text>
            <Text>Tél: +216 28 559 234 | Fax: +216 71 515 280 | Email: info@ltw.tn</Text>
            <Text>Site-web: www.itw.tn</Text>
          </View>
        </View>
        <Text style={styles.title}>FACTURE</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Informations de la facture</Text>
          <Text style={styles.text}>Numéro : {vente.numeroVente || "001/2025"}</Text>
          <Text style={styles.text}>Date : {new Date().toLocaleDateString("fr-FR")}</Text>
          <Text style={styles.text}>Mode de paiement : {vente.modePaiement || "Chèque"}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Client</Text>
          <Text style={styles.text}>Nom : {client.nom || "Nom du Client"}</Text>
          <Text style={styles.text}>Matricule Fiscal : {client.matriculeFiscaleC || "987654Y/AM0000"}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol, { width: "20%" }]}>Référence</Text>
            <Text style={[styles.tableCol, { width: "40%" }]}>Désignation</Text>
            <Text style={[styles.tableCol, { width: "10%" }]}>Quantité</Text>
            <Text style={[styles.tableCol, { width: "15%" }]}>Prix Unitaire</Text>
            <Text style={[styles.tableCol, { width: "15%" }]}>H.T.</Text>
          </View>
          {produits.map((p, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCol, { width: "20%" }]}>{p.ref || "N/A"}</Text>
              <Text style={[styles.tableCol, { width: "40%" }]}>{p.nom || "Produit"}</Text>
              <Text style={[styles.tableCol, { width: "10%" }]}>{p.qte || 1}</Text>
              <Text style={[styles.tableCol, { width: "15%" }]}>{p.unitPrice || 0} TND</Text>
              <Text style={[styles.tableCol, { width: "15%" }]}>
                {(p.qte * p.unitPrice * (1 - (p.rem || 0) / 100)).toFixed(3)} TND
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { width: "80%" }]}>Total HT :</Text>
            <Text style={[styles.totalValue, { width: "20%" }]}>{totalHT.toFixed(3)} TND</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { width: "80%" }]}>Total TVA :</Text>
            <Text style={[styles.totalValue, { width: "20%" }]}>{totalTVA.toFixed(3)} TND</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { width: "80%" }]}>Total TTC :</Text>
            <Text style={[styles.totalValue, { width: "20%" }]}>{totalTTC.toFixed(3)} TND</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { width: "80%" }]}>Timbre :</Text>
            <Text style={[styles.totalValue, { width: "20%" }]}>{timbre.toFixed(3)} TND</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { width: "80%" }]}>Net à Payer :</Text>
            <Text style={[styles.totalValue, { width: "20%" }]}>{netAPayer.toFixed(3)} TND</Text>
          </View>
        </View>
        <Text style={styles.footer}>
          ARLE au capital de 20 Million - RC: B816682017 - MF: 1504539/Q/AM0000 - BANQUE Zitouna:
          2507900000024319828
        </Text>
      </Page>
    </Document>
  );
};

export const FactureComponent = () => {
  const { vente, client, produits, tvaData } = useVente() || {};

  if (!vente || !client || !produits || !tvaData) {
    return <span>Chargement des données de la facture...</span>;
  }

  return (
    <PDFDownloadLink
      document={<FacturePDF vente={vente} client={client} produits={produits} tvaData={tvaData} />}
      fileName={`facture-${vente.numeroVente || "001-2025"}.pdf`}
      className="text-blue-600 hover:underline"
    >
      {({ loading }) => (loading ? "Génération..." : "Télécharger la facture")}
    </PDFDownloadLink>
  );
};