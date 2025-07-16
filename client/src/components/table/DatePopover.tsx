import React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDownIcon } from 'lucide-react'

export function DatePopover({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (date: string) => void
}) {
  const [open, setOpen] = React.useState(false)
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
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(d) => {
              onChange(d ? d.toISOString().slice(0, 10) : '')
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
