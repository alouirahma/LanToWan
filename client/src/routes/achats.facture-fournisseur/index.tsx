import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { useTableSearchParams } from 'tanstack-table-search-params'

import { BasicTable } from '@/components/table/BasicTable'
import { fuzzyFilter } from '@/lib/table-filters'
import data from '@/data/facture-fournisseur.json'

// Route component scoped from TanStack Router
export const Route = createFileRoute('/achats/facture-fournisseur/')({
  component: Index,
  validateSearch: (search) => {
    return {
      globalFilter: search.globalFilter as string | undefined,
      columnFilters: (search.columnFilters || []) as ColumnFiltersState,
      sorting: (search.sorting || []) as SortingState,
      columnOrder: (search.columnOrder || []) as string[],
      pagination: search.pagination as
        | { pageIndex: number; pageSize: number }
        | undefined,
      ...search,
    }
  },
})

type FactureFournisseur = (typeof data)[number]

const columns: ColumnDef<FactureFournisseur, any>[] = [
  {
    // id: 'id',
    accessorKey: 'id',
    header: 'ID',
    enableHiding: true,
  },
  {
    // id: 'numero',
    accessorKey: 'numero',
    header: 'Numéro',
    enableSorting: true,
    filterFn: 'fuzzy',
  },
  {
    // id: 'date',
    accessorKey: 'date',
    header: 'Date',
    enableSorting: true,
    filterFn: 'fuzzy',
  },
  {
    // id: 'montant',
    accessorKey: 'montant',
    header: 'Montant',
    enableSorting: true,
    filterFn: 'fuzzy',
  },
  {
    // id: 'fournisseur',
    accessorKey: 'fournisseur',
    header: 'Fournisseur',
    filterFn: 'fuzzy',
    enableSorting: true,
  },
  {
    // id: 'idFournisseur',
    accessorKey: 'idFournisseur',
    header: 'ID Fournisseur',
    enableHiding: true,
  },
  {
    accessorKey: 'matriculeFiscal',
    header: 'Matricule Fiscal',
    enableSorting: true,
    filterFn: 'fuzzy',
  },
]

const filterFns = { fuzzy: fuzzyFilter }

function Index() {
  const navigate = Route.useNavigate()
  const query = Route.useSearch()

  const initialColumnOrder = useMemo(
    () =>
      columns.map((col) =>
        typeof col.id === 'string'
          ? col.id
          : typeof (col as any).accessorKey === 'string'
            ? (col as any).accessorKey
            : '',
      ),
    [],
  )

  const stateAndOnChanges = useTableSearchParams({
    replace: (url) => {
      const searchParams = new URLSearchParams(url.split('?')[1] || '')
      navigate({ search: Object.fromEntries(searchParams.entries()) })
    },
    query,
    pathname: Route.path,
    defaultValues: {
      columnOrder: initialColumnOrder,
      columnFilters: [],
      sorting: [],
      globalFilter: '',
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  const table = useReactTable({
    data,
    columns,
    filterFns,
    globalFilterFn: 'fuzzy',
    enableSorting: true,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    state: stateAndOnChanges.state,
    onColumnFiltersChange: stateAndOnChanges.onColumnFiltersChange,
    onGlobalFilterChange: stateAndOnChanges.onGlobalFilterChange,
    onPaginationChange: stateAndOnChanges.onPaginationChange,
    onSortingChange: stateAndOnChanges.onSortingChange,
    onColumnOrderChange: stateAndOnChanges.onColumnOrderChange,
    debugTable: process.env.NODE_ENV === 'development',
  })

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Factures Fournisseur</h1>
      <BasicTable
        columns={columns}
        data={data}
        filterFns={filterFns}
        table={table}
      />
    </div>
  )
}
