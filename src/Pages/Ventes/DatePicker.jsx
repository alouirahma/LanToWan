// src/components/ui/DatePicker.tsx
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function DatePicker({ date, setDate }) {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
