import React from 'react'
import './Loading.css'

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
  const spinnerClass = [
    'loading-spinner',
    `loading-spinner--${size}`,
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <div className={`loading ${overlay ? 'loading--overlay' : ''}`}>
      <div className={spinnerClass} />
      {text && <div className="loading-text">{text}</div>}
    </div>
  )

  return content
}

export default Loading