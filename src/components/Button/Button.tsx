import React from 'react'
import { Button as AntButton } from 'antd'
import type { ButtonProps as AntButtonProps } from 'antd'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}) => {
  // Map custom variants to Ant Design button types
  const getAntButtonType = (): AntButtonProps['type'] => {
    switch (variant) {
      case 'primary':
        return 'primary'
      case 'secondary':
        return 'default'
      case 'danger':
        return 'primary'
      case 'success':
        return 'primary'
      default:
        return 'default'
    }
  }

  // Map custom size to Ant Design size
  const getAntButtonSize = (): AntButtonProps['size'] => {
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

  return (
    <AntButton
      htmlType={type}
      type={getAntButtonType()}
      size={getAntButtonSize()}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      block={fullWidth}
      className={className}
      danger={variant === 'danger'}
      style={{
        backgroundColor: variant === 'success' ? '#52c41a' : undefined,
        borderColor: variant === 'success' ? '#52c41a' : undefined,
      }}
    >
      {children}
    </AntButton>
  )
}

export default Button