import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Input } from '@/components/ui/input'

interface DebouncedInputProps {
  value?: string | number
  onChange?: (value: string) => void
  debounceTime?: number
  placeholder?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  className?: string
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: propValue = '',
  onChange,
  debounceTime = 300,
  placeholder,
  type = 'text',
  className,
}) => {
  const [input, setInput] = useState<string>(
    propValue != null ? propValue.toString() : ''
  )
  const [debounced] = useDebounce(input, debounceTime)

  useEffect(() => {
    setInput(propValue != null ? propValue.toString() : '')
  }, [propValue])

  useEffect(() => {
    onChange?.(debounced)
  }, [debounced, onChange])

  return (
    <Input
      type={type}
      value={input}
      className={className}
      placeholder={placeholder}
      onChange={(e) => setInput(e.target.value)}
    />
  )
}
