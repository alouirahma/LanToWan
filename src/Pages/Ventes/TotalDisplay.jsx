import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useVente } from "@/Pages/Ventes/VenteContext";

// Conversion des montants en mots simplifiée
const convertMoneyToWords = (amount) => {
  return amount ? `${amount} TND` : "0 TND";
};

export const TotalDisplay = () => {
  const { produits, tvaData, vente } = useVente();
  const [isTimbreApplicable, setIsTimbreApplicable] = useState(vente.dinardTimbre || false);

  const calculateTvaAmount = (tax) => {
    if (!produits || !Array.isArray(produits)) return 0;
    const totalForCode = produits.reduce((acc, p) => {
      if (String(p.tva) === String(tax)) {
        const ht = Number(p.qte || 0) * Number(p.unitPrice || 0) * (1 - Number(p.rem || 0) / 100);
        return acc + ht;
      }
      return acc;
    }, 0);
    return totalForCode * (tax / 100); // Retourne directement le montant de la TVA
  };

  const totalHT = produits.reduce((acc, p) => acc + (p.qte * p.unitPrice * (1 - p.rem / 100)), 0);
  const totalTVA = tvaData.reduce((acc, t) => acc + calculateTvaAmount(t.rate), 0);
  const totalTTC = totalHT + totalTVA;
  const TIMBRE_VALUE = 1.0;
  const timbre = isTimbreApplicable ? TIMBRE_VALUE : 0;
  const netAPayer = totalTTC + timbre;
  const amountInWords = convertMoneyToWords(netAPayer);

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex flex-row p-6">
        <div className="flex-1 pr-6 flex flex-col justify-end">
          <div className="text-sm text-gray-700 italic font-medium p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[80px]">
            {amountInWords}
          </div>
        </div>
        <Separator orientation="vertical" className="bg-gray-200" />
        <div className="flex-1 space-y-2 pl-6 w-full max-w-sm">
          <div className="flex justify-between items-center py-1">
            <span className="font-medium text-gray-600 uppercase tracking-wide text-sm">Total HT Net</span>
            <span className="font-bold text-gray-900 text-right">{totalHT.toFixed(3)} TND</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="font-medium text-gray-600 uppercase tracking-wide text-sm">TVA</span>
            <span className="font-bold text-gray-900 text-right">{totalTVA.toFixed(3)} TND</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center py-1">
            <span className="font-medium text-gray-600 uppercase tracking-wide text-sm">Total TTC</span>
            <span className="font-bold text-gray-900 text-right">{totalTTC.toFixed(3)} TND</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="timbre-toggle" checked={isTimbreApplicable} onCheckedChange={setIsTimbreApplicable} />
              <Label htmlFor="timbre-toggle" className="font-medium text-gray-600 uppercase tracking-wide text-sm cursor-pointer">Timbre</Label>
            </div>
            <span className="font-bold text-gray-900 text-right">{timbre.toFixed(3)} TND</span>
          </div>
          <Separator className="my-2 border-gray-900" />
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-lg text-gray-800 uppercase tracking-wide">Net à Payer</span>
            <span className="text-2xl font-bold text-gray-900">{netAPayer.toFixed(3)} TND</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};