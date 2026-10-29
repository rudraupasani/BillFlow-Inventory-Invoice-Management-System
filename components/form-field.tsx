'use client'

import { Input } from '@/components/ui/input'
import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  required?: boolean
  disabled?: boolean
  children?: ReactNode
  error?: string
  helpText?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  children,
  error,
  helpText,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children ? (
        children
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  )
}
