import React from 'react'
import { Modal as AntModal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
}) => {
  const getWidth = () => {
    switch (size) {
      case 'small':
        return 400
      case 'medium':
        return 600
      case 'large':
        return 800
      case 'xl':
        return 1200
      default:
        return 600
    }
  }

  return (
    <AntModal
      open={isOpen}
      onCancel={onClose}
      title={title}
      footer={null}
      width={getWidth()}
      centered
      maskClosable={closeOnOverlayClick}
      keyboard={closeOnEsc}
      className={className}
      closeIcon={showCloseButton ? <CloseOutlined /> : null}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px'
        }
      }}
      style={{
        maxWidth: '95vw'
      }}
    >
      {children}
    </AntModal>
  )
}

export default Modal