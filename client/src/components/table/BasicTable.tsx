// Core Table Component
export * from './'

// Inside components/BasicTable.tsx
import React, { useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  type ColumnDef,
  type Table as ReactTable,
} from '@tanstack/react-table'
import {
  DndContext,
  useSensor,
  useSensors,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
  horizontalListSortingStrategy,
  SortableContext,
  arrayMove,
} from '@dnd-kit/sortable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FilterTags } from './FilterTags'
import { DraggableTableHeader } from './DraggableTableHeader'
import { useNavigate } from '@tanstack/react-router'

interface BasicTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  filterFns: Record<string, any>
  table?: ReactTable<TData>
}

export function BasicTable<TData>({
  columns,
  data,
  filterFns,
  table: externalTable,
}: BasicTableProps<TData>) {
  const navigate = useNavigate()
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

  useEffect(() => {
    const colIds = table.getAllLeafColumns().map((col) => col.id)
    if (
      JSON.stringify(table.getState().columnOrder) !== JSON.stringify(colIds)
    ) {
      table.setColumnOrder(colIds)
    }
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
      {/* Global Filter Input */}
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
        >
          Clear All
        </Button>
      </div>

      {/* Table with Drag & Drop Headers */}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  <SortableContext
                    items={table.getAllLeafColumns().map((col) => col.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {group.headers.map((header) => (
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
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      navigate({ to: `${row.getAllCells()[0].getValue()}` })
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-1">
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.renderValue?.()}
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
        <div className="text-sm text-muted-foreground">
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
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter & Sort Tags */}
      <FilterTags table={table} />
    </div>
  )
}
