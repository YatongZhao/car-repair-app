import React from 'react'
import { Card, Form, Input, Select, Row, Col, Typography } from 'antd'
import { UserOutlined, PhoneOutlined, CarOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateCustomerInfo, updateCustomField } from '../../store/slices/customerSlice'

const { Title, Text } = Typography
const { Option } = Select

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
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          <span>客户信息</span>
        </div>
      }
      size="small"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        请填写客户和车辆基本信息
      </Text>

      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="客户姓名" style={{ marginBottom: 16 }}>
              <Input
                prefix={<UserOutlined />}
                value={customerInfo.name}
                onChange={(e) => handleBasicFieldChange('name', e.target.value)}
                placeholder="请输入客户姓名"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="联系电话" style={{ marginBottom: 16 }}>
              <Input
                prefix={<PhoneOutlined />}
                value={customerInfo.phone}
                onChange={(e) => handleBasicFieldChange('phone', e.target.value)}
                placeholder="请输入联系电话"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="车辆型号" style={{ marginBottom: 16 }}>
              <Input
                prefix={<CarOutlined />}
                value={customerInfo.carModel}
                onChange={(e) => handleBasicFieldChange('carModel', e.target.value)}
                placeholder="如：奥迪A4L"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="车辆年份" style={{ marginBottom: 16 }}>
              <Select
                value={customerInfo.carYear}
                onChange={(value) => handleBasicFieldChange('carYear', value)}
                placeholder="请选择车辆年份"
                style={{ width: '100%' }}
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                }
              >
                {yearOptions.map((year) => (
                  <Option key={year} value={year}>
                    {year}年
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="车牌号码" style={{ marginBottom: 16 }}>
              <Input
                value={customerInfo.licensePlate}
                onChange={(e) => handleBasicFieldChange('licensePlate', e.target.value)}
                placeholder="如：京A12345"
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>

          {config.customFields.length > 0 && (
            <>
              <Col xs={24}>
                <Title level={5} style={{ marginTop: 16, marginBottom: 16 }}>
                  附加信息
                </Title>
              </Col>
              {config.customFields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <Col xs={24} sm={12} key={field.id}>
                    <Form.Item label={field.name} style={{ marginBottom: 16 }}>
                      <Input
                        value={customerInfo.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    </Form.Item>
                  </Col>
                ))}
            </>
          )}
        </Row>
      </Form>
    </Card>
  )
}

export default CustomerInfoForm