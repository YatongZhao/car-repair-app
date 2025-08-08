import React from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateCustomerInfo, updateCustomField } from '../../store/slices/customerSlice'
import Input from '../../components/Input'
import './CustomerInfoForm.css'

const CustomerInfoForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { info: customerInfo, config } = useAppSelector((state) => state.customer)

  const handleBasicFieldChange = (field: keyof typeof customerInfo, value: string | number) => {
    dispatch(updateCustomerInfo({ field, value }))
  }

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    dispatch(updateCustomField({ fieldId, value }))
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="customer-form">
      <div className="customer-form__header">
        <h2 className="customer-form__title">客户信息</h2>
        <p className="customer-form__subtitle">请填写客户和车辆基本信息</p>
      </div>

      <div className="customer-form__content">
        <div className="customer-form__section">
          <h3 className="customer-form__section-title">基本信息</h3>
          
          <div className="customer-form__grid">
            <Input
              label="客户姓名"
              type="text"
              value={customerInfo.name}
              onChange={(value) => handleBasicFieldChange('name', value)}
              placeholder="请输入客户姓名"
              fullWidth
            />

            <Input
              label="联系电话"
              type="tel"
              value={customerInfo.phone}
              onChange={(value) => handleBasicFieldChange('phone', value)}
              placeholder="请输入联系电话"
              fullWidth
            />

            <Input
              label="车辆型号"
              type="text"
              value={customerInfo.carModel}
              onChange={(value) => handleBasicFieldChange('carModel', value)}
              placeholder="如：奥迪A4L"
              fullWidth
            />

            <div className="input-group">
              <label htmlFor="carYear" className="input-label">
                车辆年份
              </label>
              <select
                id="carYear"
                value={customerInfo.carYear}
                onChange={(e) => handleBasicFieldChange('carYear', parseInt(e.target.value))}
                className="input input--medium"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="车牌号码"
              type="text"
              value={customerInfo.licensePlate}
              onChange={(value) => handleBasicFieldChange('licensePlate', value)}
              placeholder="如：京A12345"
              fullWidth
            />
          </div>
        </div>

        {config.customFields.length > 0 && (
          <div className="customer-form__section">
            <h3 className="customer-form__section-title">附加信息</h3>
            
            <div className="customer-form__grid">
              {config.customFields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <Input
                    key={field.id}
                    label={field.name}
                    type={field.type}
                    value={customerInfo.customFields[field.id] || ''}
                    onChange={(value) => handleCustomFieldChange(field.id, value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    fullWidth
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerInfoForm