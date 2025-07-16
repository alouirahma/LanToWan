import React, { useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type Header,
  type Column,
  type Table as ReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  X,
  Check,
  ChevronsUpDown,
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { DebouncedInput } from '@/components/ui/debounced-input'
import { cn } from '@/lib/utils'

interface BasicTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  filterFns: Record<string, any>
  table?: ReactTable<TData> // Optional: external table instance
}

function DraggableTableHeader<TData>({
  header,
}: {
  header: Header<TData, unknown>
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    })
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <TableHead
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      className="px-2 py-1"
    >
      <div className="flex items-center justify-center gap-2 w-full">
        <div className="flex items-center gap-1">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}

          {/* Sorting button */}
          {header.column.getCanSort() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => header.column.toggleSorting()}
              className="ml-1 h-6 w-6 p-0"
            >
              {header.column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-3 w-3" />
              ) : header.column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        <Button
          {...attributes}
          {...listeners}
          className="cursor-move"
          variant="ghost"
          size="icon"
        >
          <GripVertical className="w-4 h-4" />
        </Button>
      </div>
      {header.column.getCanFilter() ? <Filter column={header.column} /> : null}
    </TableHead>
  )
}

function getColumnId<TData>(col: ColumnDef<TData, any>): string {
  if ('id' in col && col.id) return col.id as string
  if ('accessorKey' in col && typeof col.accessorKey === 'string')
    return col.accessorKey
  throw new Error('Column must have either id or string accessorKey')
}

export function BasicTable<TData>({
  columns,
  data,
  filterFns,
  table: externalTable,
}: BasicTableProps<TData>) {
  const table =
    externalTable ||
    useReactTable({
      data,
      columns,
      filterFns,
      globalFilterFn: 'fuzzy',
      enableSorting: true,
      enableMultiSort: true,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getPaginationRowModel: getPaginationRowModel(),
    })

  // Ensure columnOrder is always in sync with columns
  useEffect(() => {
    const colIds = table.getAllLeafColumns().map(col => col.id)
    if (
      JSON.stringify(table.getState().columnOrder) !== JSON.stringify(colIds)
    ) {
      table.setColumnOrder(colIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldOrder = table.getState().columnOrder
      const oldIndex = oldOrder.indexOf(active.id as string)
      const newIndex = oldOrder.indexOf(over.id as string)
      const newOrder = arrayMove(oldOrder, oldIndex, newIndex)
      table.setColumnOrder(newOrder)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={table.getState().globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="p-2 font-lg shadow border flex-1"
          placeholder="Search all columns..."
        />
        <Button
          variant="outline"
          onClick={() => {
            table.resetGlobalFilter()
            table.resetColumnFilters()
            table.resetSorting()
          }}
          className="whitespace-nowrap"
        >
          Clear All
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
                  <SortableContext
                    items={table.getAllLeafColumns().map(col => col.id)}
                    strategy={horizontalListSortingStrategy}
                  >
              {headerGroup.headers.map((header) => (
                      <DraggableTableHeader key={header.id} header={header} />
                    ))}
                  </SortableContext>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-1">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                </TableCell>
              ))}
            </TableRow>
                ))
              )}
        </TableBody>
      </Table>
        </div>
      </DndContext>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <FilterTags table={table} />
    </div>
  )
}

// Rest of the component remains the same...
// (Filter, ComboboxFilter, DatePopover, FilterTags functions)

function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()
  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant],
  )

  // Get header label for placeholder
  const headerLabel =
    typeof column.columnDef.header === 'string'
      ? column.columnDef.header
      : column.id
  const placeholderLabel = headerLabel.toLowerCase()

  // Date range filter
  if (
    filterVariant === 'range' &&
    (column.columnDef.meta as { type?: string } | undefined)?.type === 'date'
  ) {
    const minDate = (columnFilterValue as [string, string])?.[0] || ''
    const maxDate = (columnFilterValue as [string, string])?.[1] || ''
    return (
      <div className="flex space-x-2 items-center">
        <DatePopover
          label={`Min ${placeholderLabel}`}
          value={minDate}
          onChange={(date) => {
            if (maxDate && date && new Date(date) > new Date(maxDate)) return
            column.setFilterValue((old: [string, string]) => [date === '' ? undefined : date, old?.[1]])
          }}
        />
        <DatePopover
          label={`Max ${placeholderLabel}`}
          value={maxDate}
          onChange={(date) => {
            if (minDate && date && new Date(date) < new Date(minDate)) return
            column.setFilterValue((old: [string, string]) => [old?.[0], date === '' ? undefined : date])
          }}
        />
      </div>
    )
  }
  if (filterVariant === 'range') {
    const min = Number(column.getFacetedMinMaxValues()?.[0] ?? '')
    const max = Number(column.getFacetedMinMaxValues()?.[1] ?? '')
    const minValue = (columnFilterValue as [number | string, number | string])?.[0] ?? ''
    const maxValue = (columnFilterValue as [number | string, number | string])?.[1] ?? ''
    return (
      <div className="flex space-x-2 items-center">
        <DebouncedInput
          type="number"
          value={minValue === '' ? '' : String(minValue)}
          onChange={(value) => {
            if (
              maxValue !== '' &&
              value !== '' &&
              Number(value) > Number(maxValue)
            )
              return
            column.setFilterValue((old: [string, string]) => [value === '' ? undefined : value, old?.[1]])
          }}
          placeholder={`min ${placeholderLabel}${min ? ` (${min})` : ''}`}
          className="w-20 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={maxValue === '' ? '' : String(maxValue)}
          onChange={(value) => {
            if (
              minValue !== '' &&
              value !== '' &&
              Number(value) < Number(minValue)
            )
              return
            column.setFilterValue((old: [string, string]) => [old?.[0], value === '' ? undefined : value])
          }}
          placeholder={`max ${placeholderLabel}${max ? ` (${max})` : ''}`}
          className="w-20 border shadow rounded"
        />
      </div>
    )
  }
  if (filterVariant === 'select') {
    return (
      <div className="flex items-center gap-1">
        <Select
          value={columnFilterValue?.toString() ?? ''}
          onValueChange={(value) =>
            column.setFilterValue(value === '' ? undefined : value)
          }
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder={`all ${placeholderLabel}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem value={value} key={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  // Default: Combobox for text filter
  return (
    <div className="flex items-center gap-1">
      <ComboboxFilter
        value={(columnFilterValue ?? '') as string}
        options={sortedUniqueValues}
        onChange={(value) =>
          column.setFilterValue(value === '' ? undefined : value)
        }
        placeholder={`filter ${placeholderLabel}`}
      />
    </div>
  )
}

function ComboboxFilter({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-36 justify-between"
        >
          {value ? value : placeholder || 'Select...'}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {option}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function DatePopover({
  label,
  value,
  onChange,
}: {
  label: string
  value: string // The external value (string date like 'YYYY-MM-DD')
  onChange: (date: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  // Directly derive the Date object from the `value` prop
  const selectedDate = value ? new Date(value) : undefined

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-32 justify-between font-normal"
            type="button"
          >
            {selectedDate ? selectedDate.toLocaleDateString() : label}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate} // Use selectedDate
            captionLayout="dropdown"
            onSelect={(d) => {
              // Only call onChange if a date is selected, otherwise explicitly set to empty string
              onChange(d ? d.toISOString().slice(0, 10) : '')
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

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
  ) {
    return null
  }

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
        let label = col?.columnDef.header || filter.id
        let value: string | number | undefined = Array.isArray(filter.value)
          ? (filter.value as Array<string | number | undefined>).filter(Boolean).join(' ~ ')
          : (filter.value as string | number | undefined)
        if (
          Array.isArray(filter.value) &&
          col?.columnDef.meta?.type === 'date'
        ) {
          const [minDate, maxDate] = filter.value as [string, string]
          value = `${minDate ? new Date(minDate).toLocaleDateString() : ''} ~ ${maxDate ? new Date(maxDate).toLocaleDateString() : ''}`
        }

        return (
          <Badge
            key={filter.id}
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            <span className="font-medium mr-1">
              {typeof label === 'string' || typeof label === 'number'
                ? label
                : String(filter.id)}
              :
            </span>
            {typeof value === 'string' || typeof value === 'number'
              ? value
              : String(value)}
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
        let label = col?.columnDef.header || sort.id
        return (
          <Badge
            key={sort.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            <span className="font-medium mr-1">
              Sort by{' '}
              {typeof label === 'string' || typeof label === 'number'
                ? label
                : String(sort.id)}
            </span>
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