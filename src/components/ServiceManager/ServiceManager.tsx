import React, { useState } from 'react'
import { 
  Tabs, 
  Button, 
  Input, 
  Form, 
  Card, 
  Space, 
  Typography, 
  Popconfirm, 
  message,
  Upload,
  Row,
  Col,
  Tag,
  InputNumber
} from 'antd'
import type { UploadProps } from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  DownloadOutlined, 
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { store } from '../../store'
import { 
  updateServiceItem, 
  addServiceCategory, 
  removeServiceCategory, 
  addServiceItem, 
  removeServiceItem,
  resetToDefaultServices,
  setServiceDatabase
} from '../../store/slices/serviceSlice'
import { dbManager } from '../../utils/indexedDB'
import { defaultServices } from '../../data/defaultServices'
import { ServiceItem, ServiceCategory } from '../../types/service'
import Modal from '../Modal'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface ServiceManagerProps {
  isOpen: boolean
  onClose: () => void
}

type EditingItem = ServiceItem & { categoryId: string }
type EditingCategory = ServiceCategory

const ServiceManager: React.FC<ServiceManagerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const { serviceDatabase } = useAppSelector((state) => state.service)
  
  const [activeTab, setActiveTab] = useState('services')
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [categoryForm] = Form.useForm()

  // Get sorted categories and items
  const categories = Object.values(serviceDatabase).sort((a, b) => a.order - b.order)

  const handleSaveItem = async (values: any) => {
    if (!editingItem) return

    if (editingItem.id.startsWith('item-')) {
      // Add new item
      dispatch(addServiceItem({
        categoryId: editingItem.categoryId,
        item: {
          id: editingItem.id,
          name: values.name,
          price: values.price,
          description: values.description || '',
          isCustom: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }))
      message.success('新服务项目已添加')
    } else {
      // Update existing item
      dispatch(updateServiceItem({
        categoryId: editingItem.categoryId,
        itemId: editingItem.id,
        updates: {
          name: values.name,
          price: values.price,
          description: values.description || '',
        }
      }))
      message.success('服务项目已更新')
    }

    // Save to IndexedDB
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)

    setEditingItem(null)
    form.resetFields()
  }

  const handleSaveCategory = async (values: any) => {
    if (!editingCategory) return

    if (editingCategory.id === 'new') {
      // Add new category
      const newId = `category-${Date.now()}`
      dispatch(addServiceCategory({
        id: newId,
        name: values.name,
        order: categories.length,
        isCustom: true,
        items: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      message.success('新分类已添加')
    }

    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)

    setEditingCategory(null)
    categoryForm.resetFields()
  }

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    dispatch(removeServiceItem({ categoryId, itemId }))
    
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    message.success('服务项目已删除')
  }

  const handleDeleteCategory = async (categoryId: string) => {
    dispatch(removeServiceCategory(categoryId))
    
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    message.success('服务分类已删除')
  }

  const handleAddNewItem = (categoryId: string) => {
    const newId = `item-${Date.now()}`
    const newItem: EditingItem = {
      id: newId,
      name: '',
      price: 0,
      description: '',
      isCustom: true,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEditingItem(newItem)
    form.setFieldsValue({
      name: '',
      price: 0,
      description: ''
    })
  }

  const handleAddNewCategory = () => {
    const newCategory: EditingCategory = {
      id: 'new',
      name: '',
      order: categories.length,
      isCustom: true,
      items: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEditingCategory(newCategory)
    categoryForm.setFieldsValue({
      name: '',
      description: ''
    })
  }

  const handleEditItem = (item: ServiceItem, categoryId: string) => {
    const editingItem: EditingItem = { ...item, categoryId }
    setEditingItem(editingItem)
    form.setFieldsValue({
      name: item.name,
      price: item.price,
      description: item.description
    })
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(serviceDatabase, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `service-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    message.success('数据已导出')
  }


  const handleResetToDefault = async () => {
    setIsLoading(true)
    try {
      dispatch(resetToDefaultServices(defaultServices))
      await dbManager.saveServiceDatabase(defaultServices)
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
      message.success('已重置为默认配置')
    } catch (error) {
      message.error('重置失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.json',
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const result = e.target?.result
          if (typeof result === 'string') {
            const importedData = JSON.parse(result)
            dispatch(setServiceDatabase(importedData))
            await dbManager.saveServiceDatabase(importedData)
            message.success('数据导入成功')
          }
        } catch (error) {
          message.error('数据格式错误，请检查文件内容')
        }
      }
      reader.readAsText(file)
      return false // 阻止默认上传行为
    }
  }

  const tabItems = [
    {
      key: 'services',
      label: '服务项目',
      children: (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>服务项目管理</Title>
            <Paragraph type="secondary">
              管理各分类下的服务项目，可以编辑价格、描述或添加新服务。
            </Paragraph>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                title={category.name}
                size="small"
                extra={
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddNewItem(category.id)}
                  >
                    添加服务
                  </Button>
                }
              >
                <Row gutter={[16, 16]}>
                  {Object.values(category.items).map((item) => (
                    <Col xs={24} sm={12} lg={8} key={item.id}>
                      <Card
                        size="small"
                        hoverable
                        actions={[
                          <EditOutlined 
                            key="edit" 
                            onClick={() => handleEditItem(item, category.id)} 
                          />,
                          <Popconfirm
                            key="delete"
                            title="确认删除"
                            description="确定要删除这个服务项目吗？"
                            onConfirm={() => handleDeleteItem(category.id, item.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        ]}
                      >
                        <div style={{ minHeight: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <Text strong>{item.name}</Text>
                            {!item.isCustom && <Tag color="orange">默认</Tag>}
                          </div>
                          {item.description && (
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 8 }}>
                              {item.description}
                            </Text>
                          )}
                          <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                            ¥{item.price.toFixed(2)}
                          </Text>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </Space>
        </div>
      )
    },
    {
      key: 'categories',
      label: '服务分类',
      children: (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1', minWidth: 0 }}>
                <Title level={4}>服务分类管理</Title>
                <Paragraph type="secondary">
                  管理服务分类，可以添加新分类或删除不需要的分类。
                </Paragraph>
              </div>
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNewCategory}
                style={{ flexShrink: 0 }}
              >
                添加分类
              </Button>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            {categories.map((category) => (
              <Col xs={24} sm={12} lg={8} key={category.id}>
                <Card
                  size="small"
                  hoverable
                  actions={[
                    <Popconfirm
                      key="delete"
                      title="确认删除"
                      description={`确定要删除"${category.name}"分类吗？这将删除该分类下的所有服务项目。`}
                      onConfirm={() => handleDeleteCategory(category.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                  ]}
                >
                  <div style={{ minHeight: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Text strong style={{ fontSize: '16px' }}>{category.name}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      包含 {Object.keys(category.items).length} 个服务项目
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )
    },
    {
      key: 'data',
      label: '数据管理',
      children: (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>数据管理</Title>
            <Paragraph type="secondary">
              导入导出服务配置数据，或重置为系统默认配置。
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card title="导出数据" size="small">
                <Paragraph style={{ minHeight: 60 }}>
                  将当前的服务配置导出为JSON文件，便于备份或分享。
                </Paragraph>
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExportData}
                  block
                >
                  导出配置
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card title="导入数据" size="small">
                <Paragraph style={{ minHeight: 60 }}>
                  从JSON文件导入服务配置，将替换当前所有数据。
                </Paragraph>
                <Upload {...uploadProps}>
                  <Button 
                    type="default"
                    icon={<UploadOutlined />}
                    loading={isLoading}
                    block
                  >
                    选择文件导入
                  </Button>
                </Upload>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card title="重置数据" size="small">
                <Paragraph style={{ minHeight: 60 }}>
                  将所有数据重置为系统默认配置，此操作不可恢复。
                </Paragraph>
                <Popconfirm
                  title="确认重置"
                  description="这将清除所有自定义数据并恢复默认设置，确定继续吗？"
                  onConfirm={handleResetToDefault}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    danger
                    icon={<ReloadOutlined />}
                    loading={isLoading}
                    block
                  >
                    重置为默认
                  </Button>
                </Popconfirm>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  ]

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="服务项目管理"
        size="xl"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ 
            minHeight: '60vh',
            width: '100%'
          }}
          tabBarStyle={{
            marginBottom: '16px'
          }}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => {
          setEditingItem(null)
          form.resetFields()
        }}
        title={editingItem?.id.startsWith('item-') ? '添加服务项目' : '编辑服务项目'}
        size="medium"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveItem}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="请输入服务名称" />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              formatter={(value) => `¥ ${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/¥\s?|(,*)/g, '') as any}
              placeholder="请输入价格"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="服务描述"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入服务描述（可选）"
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setEditingItem(null)
                form.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem?.id.startsWith('item-') ? '添加' : '保存'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => {
          setEditingCategory(null)
          categoryForm.resetFields()
        }}
        title="添加服务分类"
        size="medium"
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleSaveCategory}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入分类描述（可选）"
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setEditingCategory(null)
                categoryForm.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceManager