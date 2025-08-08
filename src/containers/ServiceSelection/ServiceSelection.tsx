import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { addService } from '../../store/slices/serviceSlice'
import { setError, clearError } from '../../store/slices/uiSlice'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import { ServiceItem } from '../../types/service'
import { CURRENCY_SYMBOL } from '../../constants'
import './ServiceSelection.css'

const ServiceSelection: React.FC = () => {
  const dispatch = useAppDispatch()
  const { serviceDatabase, selectedServices } = useAppSelector((state) => state.service)
  const { errors } = useAppSelector((state) => state.ui)
  
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showCustomServiceModal, setShowCustomServiceModal] = useState(false)
  const [customServiceName, setCustomServiceName] = useState('')
  const [customServicePrice, setCustomServicePrice] = useState('')

  // Get sorted categories
  const categories = Object.values(serviceDatabase).sort((a, b) => a.order - b.order)
  
  // Get current category items
  const currentCategory = serviceDatabase[selectedCategory]
  const categoryItems = currentCategory ? Object.values(currentCategory.items) : []

  const handleServiceAdd = (service: ServiceItem, categoryName: string) => {
    // Check if service already exists
    const existingService = selectedServices.find(s => s.id === service.id)
    if (existingService) {
      dispatch(setError({
        field: 'service',
        error: { message: '该服务项目已添加到报价单中' }
      }))
      setTimeout(() => dispatch(clearError('service')), 3000)
      return
    }

    dispatch(addService({
      id: service.id,
      name: service.name,
      price: service.price,
      category: categoryName,
      isCustom: service.isCustom,
    }))
    
    // Clear any previous errors
    dispatch(clearError('service'))
  }

  const handleCustomServiceAdd = () => {
    if (!customServiceName.trim()) {
      dispatch(setError({
        field: 'customService',
        error: { message: '请输入服务名称' }
      }))
      return
    }

    const price = parseFloat(customServicePrice)
    if (isNaN(price) || price <= 0) {
      dispatch(setError({
        field: 'customService',
        error: { message: '请输入有效的价格' }
      }))
      return
    }

    const customService = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: customServiceName.trim(),
      price,
      category: '自定义服务',
      isCustom: true,
    }

    dispatch(addService(customService))
    
    // Reset form and close modal
    setCustomServiceName('')
    setCustomServicePrice('')
    setShowCustomServiceModal(false)
    dispatch(clearError('customService'))
  }

  const formatPrice = (price: number) => {
    return `${CURRENCY_SYMBOL}${price.toFixed(2)}`
  }

  return (
    <div className="service-selection">
      <div className="service-selection__header">
        <h2 className="service-selection__title">选择服务项目</h2>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowCustomServiceModal(true)}
        >
          + 添加自定义服务
        </Button>
      </div>

      {errors.service && (
        <div className="service-selection__error">
          {errors.service.message}
        </div>
      )}

      <div className="service-selection__content">
        {/* Category Selection */}
        <div className="service-selection__categories">
          <h3 className="service-selection__section-title">服务分类</h3>
          <div className="service-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${
                  selectedCategory === category.id ? 'category-button--active' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-button__name">{category.name}</span>
                <span className="category-button__count">
                  {Object.keys(category.items).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Service Items */}
        {selectedCategory && (
          <div className="service-selection__items">
            <h3 className="service-selection__section-title">
              {currentCategory?.name} - 服务项目
            </h3>
            <div className="service-items">
              {categoryItems.map((item) => {
                const isSelected = selectedServices.some(s => s.id === item.id)
                return (
                  <div key={item.id} className="service-item">
                    <div className="service-item__info">
                      <h4 className="service-item__name">{item.name}</h4>
                      {item.description && (
                        <p className="service-item__description">
                          {item.description}
                        </p>
                      )}
                      <div className="service-item__price">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <Button
                      variant={isSelected ? "secondary" : "primary"}
                      size="small"
                      disabled={isSelected}
                      onClick={() => handleServiceAdd(item, currentCategory.name)}
                    >
                      {isSelected ? '已添加' : '添加'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="service-selection__placeholder">
            <p>请选择服务分类以查看可用的服务项目</p>
          </div>
        )}
      </div>

      {/* Custom Service Modal */}
      <Modal
        isOpen={showCustomServiceModal}
        onClose={() => {
          setShowCustomServiceModal(false)
          setCustomServiceName('')
          setCustomServicePrice('')
          dispatch(clearError('customService'))
        }}
        title="添加自定义服务"
        size="small"
      >
        <div className="custom-service-form">
          {errors.customService && (
            <div className="service-selection__error">
              {errors.customService.message}
            </div>
          )}
          
          <Input
            label="服务名称"
            type="text"
            value={customServiceName}
            onChange={setCustomServiceName}
            placeholder="请输入服务名称"
            required
            fullWidth
            maxLength={50}
          />

          <Input
            label="服务价格"
            type="number"
            value={customServicePrice}
            onChange={setCustomServicePrice}
            placeholder="请输入价格"
            required
            fullWidth
            min={0.01}
            max={99999.99}
            step={0.01}
          />

          <div className="custom-service-form__actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCustomServiceModal(false)
                setCustomServiceName('')
                setCustomServicePrice('')
                dispatch(clearError('customService'))
              }}
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleCustomServiceAdd}
            >
              添加服务
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ServiceSelection