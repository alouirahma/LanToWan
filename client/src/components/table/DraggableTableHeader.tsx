import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from 'lucide-react'
import { TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { flexRender, type Header } from '@tanstack/react-table'
import { Filter } from './Filter'

export function DraggableTableHeader<TData>({
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
          {!header.isPlaceholder &&
            flexRender(header.column.columnDef.header, header.getContext())}

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

      {header.column.getCanFilter() && <Filter column={header.column} />}
    </TableHead>
  )
}
