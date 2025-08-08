import React from 'react'
import './Input.css'

interface InputProps {
  id?: string
  name?: string
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'password'
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
  autoFocus?: boolean
  maxLength?: number
  min?: number
  max?: number
  step?: number
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'medium',
  className = '',
  autoFocus = false,
  maxLength,
  min,
  max,
  step,
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const inputClass = [
    'input',
    `input--${size}`,
    fullWidth && 'input--full-width',
    error && 'input--error',
    disabled && 'input--disabled',
    className,
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        className={inputClass}
      />
      
      {error && (
        <div className="input-error">
          {error}
        </div>
      )}
    </div>
  )
}

export default Input