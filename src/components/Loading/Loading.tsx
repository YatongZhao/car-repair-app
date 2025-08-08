import React from 'react'
import { Spin } from 'antd'

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  overlay?: boolean
  className?: string
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  overlay = false,
  className = '',
}) => {
  const getAntSize = () => {
    switch (size) {
      case 'small':
        return 'small'
      case 'medium':
        return 'default'
      case 'large':
        return 'large'
      default:
        return 'default'
    }
  }

  const spinComponent = (
    <Spin 
      size={getAntSize()} 
      tip={text}
      className={className}
    />
  )

  if (overlay) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        {spinComponent}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {spinComponent}
    </div>
  )
}

export default Loading