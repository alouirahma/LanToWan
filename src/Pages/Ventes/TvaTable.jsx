import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useVente } from "@/Pages/Ventes/VenteContext";

export const TvaTable = () => {
  const { produits, tvaData, setTvaData } = useVente();

  const handleTvaChange = (e, id, key) => {
    const value = key === "rate" ? parseFloat(e.target.value) || 0 : e.target.value;
    const updatedTvaData = tvaData.map((t) =>
      t.id === id ? { ...t, [key]: value } : t
    );
    setTvaData(updatedTvaData);
  };

  const addTvaRow = () => {
    const newRow = { id: Date.now(), code: "", rate: 0 };
    setTvaData([...tvaData, newRow]);
  };

  const removeTvaRow = (id) => {
    setTvaData(tvaData.filter((t) => t.id !== id));
  };

  const calculateTvaAmount = (tax) => {
    const totalForCode = produits.reduce((acc, p) => {
      if (String(p.tva) === String(tax)) {
        const ht = Number(p.qte) * Number(p.unitPrice) * (1 - Number(p.rem) / 100);
        return acc + ht;
      }
      return acc;
    }, 0);
    return totalForCode * (tax / 100);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-center text-xl font-bold text-gray-900">
          <span>TVA</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 border-t border-gray-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-gray-900">
                <TableHead className="font-bold text-gray-900">Code</TableHead>
                <TableHead className="text-right font-bold text-gray-900">
                  Taux (%)
                </TableHead>
                <TableHead className="text-right font-bold text-gray-900">
                  Montant TVA
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tvaData.map((tvaRow) => {
                const baseHT = calculateTvaAmount(tvaRow.rate);
                const tvaAmount = baseHT;

                return (
                  <TableRow
                    key={tvaRow.id}
                    className={`
                      border-b border-gray-100 transition-colors hover:bg-gray-50
                      ${tvaData.indexOf(tvaRow) % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    `}
                  >
                    <TableCell>
                      <Input
                        value={tvaRow.code}
                        onChange={(e) => handleTvaChange(e, tvaRow.id, "code")}
                        className="h-10 border-0 bg-transparent focus:bg-white focus:border focus:border-gray-300 focus:ring-1 focus:ring-gray-900"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={tvaRow.rate}
                        onChange={(e) => handleTvaChange(e, tvaRow.id, "rate")}
                        className="h-10 text-right border-0 bg-transparent focus:bg-white focus:border focus:border-gray-300 focus:ring-1 focus:ring-gray-900"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {tvaAmount.toFixed(3)} TND
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTvaRow(tvaRow.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <Button
            onClick={addTvaRow}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un taux TVA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};