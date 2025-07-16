import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, SaveIcon, FileTextIcon, FileType2Icon, Plus } from 'lucide-react';

export function FactureDetail({
  supplier, setSupplier,
  matricule,
  date, setDate,
  currency, setCurrency,
  notes, setNotes,
  tax, setTax,
  discount, setDiscount,
  products, setProducts,
  calendarOpen, setCalendarOpen
}: {
  supplier: string, setSupplier: (v: string) => void,
  matricule: string,
  date: Date | undefined, setDate: (v: Date | undefined) => void,
  currency: string, setCurrency: (v: string) => void,
  notes: string, setNotes: (v: string) => void,
  tax: string, setTax: (v: string) => void,
  discount: string, setDiscount: (v: string) => void,
  products: Array<{ reference: string, name: string, qty: number, rate: number, discount: number, tax: number }>, setProducts: (v: any) => void,
  calendarOpen: boolean, setCalendarOpen: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/20 min-h-screen">
      {/* Left: Invoice Detail & Product */}
      <div className="flex-1 flex flex-col gap-4 max-w-xl">
        {/* Invoice Detail */}
        <div className="bg-white rounded-lg shadow p-6 border flex flex-col gap-4">
          <div>
            <h2 className="font-semibold text-lg mb-2">Invoice Detail</h2>
            <div className="mb-2">
              <Label className="text-xs">Supplier</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={supplier} onChange={e => setSupplier(e.target.value)} className="flex-1" />
                <Button variant="ghost" size="icon" type="button" tabIndex={-1}>
                  <FileTextIcon className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{matricule}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Subject removed */}
              <div className="col-span-2">
                <Label className="text-xs">Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {date ? date.toLocaleDateString() : 'Value...'}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Value..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="TND">TND</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Product */}
        <div className="bg-white rounded-lg shadow p-6 border flex flex-col gap-4">
          <h2 className="font-semibold text-lg mb-2">Product</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>REFERENCE</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>QTY*</TableHead>
                <TableHead>RATE*</TableHead>
                <TableHead>DISCOUNT</TableHead>
                <TableHead>TAX</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.reference}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.rate.toLocaleString()}</TableCell>
                  <TableCell>{item.discount} %</TableCell>
                  <TableCell>{item.tax} %</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="default" size="sm" className="px-0 w-fit"><Plus /></Button>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Add Tax</Label>
              <Select value={tax} onValueChange={setTax}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Value..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 %</SelectItem>
                  <SelectItem value="7">7 %</SelectItem>
                  <SelectItem value="19">19 %</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Add Discount</Label>
              <Select value={discount} onValueChange={setDiscount}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Value..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 %</SelectItem>
                  <SelectItem value="5">5 %</SelectItem>
                  <SelectItem value="10">10 %</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea placeholder="Add Notes" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
      </div>
      {/* Right: Preview */}
      <div className="flex-1 bg-white rounded-lg shadow p-6 border flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Preview</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon"><FileTextIcon className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><FileType2Icon className="w-5 h-5" /></Button>
            <Button variant="default" size="icon"><SaveIcon className="w-5 h-5" /></Button>
          </div>
        </div>
        <div className="flex-1 border-2 border-dashed border-muted rounded-lg mt-2" />
      </div>
    </div>
  );
}
