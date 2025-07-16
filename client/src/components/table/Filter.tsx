import React from 'react'
import { type Column } from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ComboboxFilter } from './ComboboxFilter'

export function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()
  const sortedUniqueValues = React.useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant],
  )

  const headerLabel = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
  const placeholderLabel = headerLabel.toLowerCase()

  if (filterVariant === 'select') {
    return (
      <div className="flex items-center gap-1">
        <Select
          value={columnFilterValue?.toString() ?? ''}
          onValueChange={(value) => column.setFilterValue(value || undefined)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder={`all ${placeholderLabel}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <ComboboxFilter
        value={columnFilterValue as string}
        options={sortedUniqueValues}
        onChange={(value) => column.setFilterValue(value || undefined)}
        placeholder={`filter ${placeholderLabel}`}
      />
    </div>
  )
}
