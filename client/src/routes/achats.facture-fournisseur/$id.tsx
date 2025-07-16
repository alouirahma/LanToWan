import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import data from '@/data/facture-fournisseur.json'
import achatProduitDataRaw from '@/data/facture-fournisseur-achat-produit.json'
import { createFileRoute } from '@tanstack/react-router'
import { FactureDetail } from './facture'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ComboboxFilter } from '@/components/table/ComboboxFilter'
import { useForm } from '@tanstack/react-form'
import type { TFactureFournisseurAchatProduit } from '@/api/achat.facture-fournisseur-achat-produit.type'
import { Plus } from 'lucide-react'

const achatProduitData: TFactureFournisseurAchatProduit[] = achatProduitDataRaw
  .filter((p) => typeof p.reference === 'string' && p.reference !== null)
  .map((p) => ({ ...p, reference: p.reference ?? '' }))

function FactureDetailPage() {
  const { id } = Route.useParams()
  const facture = React.useMemo(
    () => data.find((f) => String(f.id) === String(id)),
    [id],
  )

  if (!facture) {
    return (
      <div className="p-8 text-center text-destructive font-bold">
        Facture not found
      </div>
    )
  }

  // Products for this invoice
  const initialProducts = React.useMemo<TFactureFournisseurAchatProduit[]>(
    () =>
      achatProduitData
        .filter((p) => String(p.idAchat) === String(id))
        .map((p) => ({ ...p, reference: p.reference ?? '' })),
    [id],
  )

  const [supplier, setSupplier] = React.useState(facture.fournisseur)
  const [matricule] = React.useState(facture.matriculeFiscal)
  const initialDate = React.useMemo(() => {
    const d = new Date(facture.date as string)
    return isNaN(d.getTime()) ? undefined : d
  }, [facture.date])
  const [date, setDate] = React.useState(initialDate)
  const [currency, setCurrency] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [tax, setTax] = React.useState('')
  const [discount, setDiscount] = React.useState('')
  const [products, setProducts] = React.useState<TFactureFournisseurAchatProduit[]>(initialProducts)
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // Unique references for combobox
  const referenceOptions = React.useMemo(
    () =>
      Array.from(
        new Set(
          achatProduitData
            .map((p) => p.reference)
            .filter((ref): ref is string => !!ref),
        ),
      ),
    [],
  )

  // Form for adding product
  const form = useForm({
    defaultValues: {
      reference: '',
      produit: '',
      quantite: 1,
      prixUnitaire: 0,
      remise: 0,
      tax: 0,
    },
    onSubmit: async ({ value }) => {
      // Generate a new id
      const newId =
        products.length > 0
          ? Math.max(...products.map((p) => p.id ?? 0)) + 1
          : Date.now()
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          idAchat: Number(id),
          idProduit: Date.now(), // temp unique
          reference: value.reference,
          produit: value.produit,
          quantite: value.quantite,
          prixUnitaire: value.prixUnitaire,
          remise: value.remise,
          tax: value.tax,
        },
      ])
      setSheetOpen(false)
    },
  })

  // When reference changes, auto-fill
  React.useEffect(() => {
    const ref = (form.state.values.reference ?? '').toString().trim()
    const found = achatProduitData.find((p) => (p.reference ?? '').toString().trim() === ref)
    if (ref && found) {
      form.setFieldValue('produit', found.produit)
      form.setFieldValue('prixUnitaire', found.prixUnitaire)
      form.setFieldValue('remise', found.remise ?? 0)
      form.setFieldValue('tax', found.tax ?? 0)
    }
    // eslint-disable-next-line
  }, [form.state.values.reference])

  return (
    <>
      <FactureDetail
        supplier={supplier}
        setSupplier={setSupplier}
        matricule={matricule}
        date={date}
        setDate={setDate}
        currency={currency}
        setCurrency={setCurrency}
        notes={notes}
        setNotes={setNotes}
        tax={tax}
        setTax={setTax}
        discount={discount}
        setDiscount={setDiscount}
        products={products.map((p) => ({
          reference: p.reference ?? '',
          name: p.produit,
          qty: p.quantite,
          rate: p.prixUnitaire,
          discount: p.remise ?? 0,
          tax: p.tax ?? 0,
        }))}
        setProducts={setProducts}
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-8 left-8 z-50"
            aria-label="Add new item"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add Product</SheetTitle>
          </SheetHeader>
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-4 p-4">
            <form.Field name="reference">
              {(field) => (
                <div>
                  <Label>Reference</Label>
                  <ComboboxFilter
                    value={field.state.value ?? ''}
                    options={referenceOptions}
                    onChange={field.handleChange}
                    placeholder="Select reference"
                  />
                  {field.state.meta.errors.map((error) => (
                    <em key={error} className="text-xs text-red-500">{error}</em>
                  ))}
                </div>
              )}
            </form.Field>
            <form.Field name="produit">
              {(field) => (
                <div>
                  <Label>Produit</Label>
                  <Input
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <em key={error} className="text-xs text-red-500">{error}</em>
                  ))}
                </div>
              )}
            </form.Field>
            <form.Field name="quantite">
              {(field) => (
                <div>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={e => field.handleChange(Number(e.target.value))}
                    min={1}
                  />
                  {field.state.meta.errors.map((error) => (
                    <em key={error} className="text-xs text-red-500">{error}</em>
                  ))}
                </div>
              )}
            </form.Field>
            <form.Field name="prixUnitaire">
              {(field) => (
                <div>
                  <Label>Prix Unitaire</Label>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={e => field.handleChange(Number(e.target.value))}
                    min={0}
                  />
                  {field.state.meta.errors.map((error) => (
                    <em key={error} className="text-xs text-red-500">{error}</em>
                  ))}
                </div>
              )}
            </form.Field>
            <form.Field name="remise">
              {(field) => (
                <div>
                  <Label>Remise</Label>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={e => field.handleChange(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  {field.state.meta.errors.map((error) => (
                    <em key={error} className="text-xs text-red-500">{error}</em>
                  ))}
                </div>
              )}
            </form.Field>
            <form.Field name="tax">
              {(field) => (
                <div>
                  <Label>Tax</Label>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={e => field.handleChange(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  {field.state.meta.errors.map((error) => (
                    <em key={error} className="text-xs text-red-500">{error}</em>
                  ))}
                </div>
              )}
            </form.Field>
            <SheetFooter>
              <Button type="submit" variant="default">
                Add Product
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const Route = createFileRoute('/achats/facture-fournisseur/$id')({
  component: FactureDetailPage,
})
