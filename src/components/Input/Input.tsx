import React from 'react'
import { Input as AntInput, Form } from 'antd'
import type { InputProps as AntInputProps } from 'antd'

interface InputProps {
  id?: string
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
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'medium',
  className = '',
  autoFocus = false,
  maxLength,
  min,
  max,
  step,
}) => {
  // Map custom size to Ant Design size
  const getAntInputSize = (): AntInputProps['size'] => {
    switch (size) {
      case 'small':
        return 'small'
      case 'medium':
        return 'middle'
      case 'large':
        return 'large'
      default:
        return 'middle'
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const inputProps: AntInputProps = {
    id,
    value: String(value),
    onChange: handleChange,
    placeholder,
    disabled,
    size: getAntInputSize(),
    className,
    autoFocus,
    maxLength,
    ...(type === 'number' && { 
      type: 'number',
      min,
      max,
      step,
    }),
    ...(type !== 'number' && { type }),
  }

  const inputElement = type === 'password' ? (
    <AntInput.Password {...inputProps} />
  ) : (
    <AntInput {...inputProps} />
  )

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={error ? 'error' : ''}
      help={error}
      style={{ marginBottom: '16px', width: fullWidth ? '100%' : 'auto' }}
    >
      {inputElement}
    </Form.Item>
  )
}

export default Input