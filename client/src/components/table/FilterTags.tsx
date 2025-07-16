import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Table as ReactTable } from '@tanstack/react-table'

export function FilterTags<TData>({ table }: { table: ReactTable<TData> }) {
  const activeFilters = table
    .getState()
    .columnFilters.filter((f) => f.value !== '' && f.value != null)
  const activeSorting = table.getState().sorting
  const activeGlobalFilter = table.getState().globalFilter

  if (
    activeFilters.length === 0 &&
    activeSorting.length === 0 &&
    !activeGlobalFilter
  )
    return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-900 shadow-lg rounded-xl px-4 py-3 max-w-4xl flex flex-wrap gap-2 items-center border border-muted transition-all justify-center">
      {activeGlobalFilter && (
        <Badge className="flex items-center gap-1 px-2 py-1 text-sm">
          <span className="font-medium mr-1">Global:</span>
          {activeGlobalFilter}
          <Button
            size="icon"
            variant="ghost"
            className="ml-1"
            onClick={() => table.resetGlobalFilter()}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}

      {activeFilters.map((filter) => {
        const col = table.getColumn(filter.id)
        const label =
          typeof col?.columnDef.header === 'string'
            ? col.columnDef.header
            : filter.id

        let value: string | number | undefined = Array.isArray(filter.value)
          ? (filter.value as Array<string | number | undefined>)
              .filter(Boolean)
              .join(' ~ ')
          : (filter.value as string | number | undefined)

        return (
          <Badge
            key={filter.id}
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            <span className="font-medium mr-1">{label}:</span>
            {value}
            <Button
              size="icon"
              variant="ghost"
              className="ml-1"
              onClick={() => col?.setFilterValue(undefined)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )
      })}

      {activeSorting.map((sort) => {
        const col = table.getColumn(sort.id)
        const label =
          typeof col?.columnDef.header === 'string'
            ? col.columnDef.header
            : sort.id
        return (
          <Badge
            key={sort.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            <span className="font-medium mr-1">Sort by {label}</span>
            {sort.desc ? (
              <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3" />
            )}
            <Button
              size="icon"
              variant="ghost"
              className="ml-1"
              onClick={() => col?.clearSorting()}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )
      })}

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          table.resetColumnFilters()
          table.resetSorting()
          table.resetGlobalFilter()
        }}
        className="ml-2"
      >
        Clear All
      </Button>
    </div>
  )
}
