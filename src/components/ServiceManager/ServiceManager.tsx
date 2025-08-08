import React, { useState } from 'react'
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
import Button from '../Button'
import Input from '../Input'
import Modal from '../Modal'
import './ServiceManager.css'

interface ServiceManagerProps {
  isOpen: boolean
  onClose: () => void
}

type EditingItem = ServiceItem & { categoryId: string }
type EditingCategory = ServiceCategory

const ServiceManager: React.FC<ServiceManagerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const { serviceDatabase } = useAppSelector((state) => state.service)
  
  const [activeTab, setActiveTab] = useState<'services' | 'categories' | 'data'>('services')
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'item' | 'category'
    id: string
    categoryId?: string
    name: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get sorted categories and items
  const categories = Object.values(serviceDatabase).sort((a, b) => a.order - b.order)

  const handleSaveItem = async () => {
    if (!editingItem) return

    dispatch(updateServiceItem({
      categoryId: editingItem.categoryId,
      itemId: editingItem.id,
      updates: {
        name: editingItem.name,
        price: editingItem.price,
        description: editingItem.description,
      }
    }))

    // Get updated state and save to IndexedDB
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    setEditingItem(null)
  }

  const handleSaveCategory = async () => {
    if (!editingCategory) return

    if (editingCategory.isCustom) {
      // Adding new category
      dispatch(addServiceCategory({
        ...editingCategory,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        items: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    }

    // Get updated state and save to IndexedDB
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    setEditingCategory(null)
  }

  const handleDeleteItem = async () => {
    if (!showDeleteConfirm || showDeleteConfirm.type !== 'item') return

    dispatch(removeServiceItem({
      categoryId: showDeleteConfirm.categoryId!,
      itemId: showDeleteConfirm.id
    }))

    // Get updated state and save to IndexedDB
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    setShowDeleteConfirm(null)
  }

  const handleDeleteCategory = async () => {
    if (!showDeleteConfirm || showDeleteConfirm.type !== 'category') return

    dispatch(removeServiceCategory(showDeleteConfirm.id))

    // Get updated state and save to IndexedDB
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    setShowDeleteConfirm(null)
  }

  const handleAddNewItem = (categoryId: string) => {
    const newItem: EditingItem = {
      id: `new_${Date.now()}`,
      name: '',
      price: 0,
      description: '',
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId,
    }
    setEditingItem(newItem)
  }

  const handleSaveNewItem = async () => {
    if (!editingItem || !editingItem.name.trim()) return

    const newItem: ServiceItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: editingItem.name.trim(),
      price: editingItem.price,
      description: editingItem.description || '',
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dispatch(addServiceItem({
      categoryId: editingItem.categoryId,
      item: newItem
    }))

    // Get updated state and save to IndexedDB
    setTimeout(async () => {
      const updatedState = store.getState()
      await dbManager.saveServiceDatabase(updatedState.service.serviceDatabase)
    }, 0)
    
    setEditingItem(null)
  }

  const handleExportData = async () => {
    try {
      const exportData = await dbManager.exportData()
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `car-repair-services-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await file.text()
      const success = await dbManager.importData(text)
      
      if (success) {
        // Reload service database from IndexedDB
        const newServiceDatabase = await dbManager.loadServiceDatabase()
        if (newServiceDatabase) {
          dispatch(setServiceDatabase(newServiceDatabase))
        }
        alert('数据导入成功！')
      } else {
        alert('数据导入失败，请检查文件格式。')
      }
    } catch (error) {
      console.error('Import failed:', error)
      alert('数据导入失败，请检查文件格式。')
    } finally {
      setIsLoading(false)
      event.target.value = '' // Reset file input
    }
  }

  const handleResetToDefault = async () => {
    if (!confirm('确定要重置为默认服务配置吗？这将删除所有自定义修改。')) {
      return
    }

    dispatch(resetToDefaultServices(defaultServices))
    await dbManager.saveServiceDatabase(defaultServices)
    alert('已重置为默认配置。')
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="服务项目管理"
      size="xl"
    >
      <div className="service-manager">
        {/* Tabs */}
        <div className="service-manager__tabs">
          <button
            className={`tab ${activeTab === 'services' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            服务项目
          </button>
          <button
            className={`tab ${activeTab === 'categories' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            服务分类
          </button>
          <button
            className={`tab ${activeTab === 'data' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            数据管理
          </button>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="service-manager__content">
            <div className="service-manager__header">
              <h3>服务项目管理</h3>
              <p className="service-manager__description">
                管理各分类下的服务项目，可以编辑价格、描述或添加新服务。
              </p>
            </div>

            <div className="service-categories-list">
              {categories.map((category) => (
                <div key={category.id} className="category-section">
                  <div className="category-section__header">
                    <h4>{category.name}</h4>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleAddNewItem(category.id)}
                    >
                      + 添加服务
                    </Button>
                  </div>

                  <div className="service-items-grid">
                    {Object.values(category.items).map((item) => (
                      <div key={item.id} className="service-item-card">
                        <div className="service-item-card__info">
                          <h5 className="service-item-card__name">
                            {item.name}
                            {item.isCustom && (
                              <span className="custom-tag">自定义</span>
                            )}
                          </h5>
                          <p className="service-item-card__description">
                            {item.description}
                          </p>
                          <div className="service-item-card__price">
                            ¥{item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="service-item-card__actions">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setEditingItem({ ...item, categoryId: category.id })}
                          >
                            编辑
                          </Button>
                          {item.isCustom && (
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => setShowDeleteConfirm({
                                type: 'item',
                                id: item.id,
                                categoryId: category.id,
                                name: item.name
                              })}
                            >
                              删除
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="service-manager__content">
            <div className="service-manager__header">
              <h3>服务分类管理</h3>
              <Button
                variant="primary"
                size="small"
                onClick={() => setEditingCategory({
                  id: '',
                  name: '',
                  order: categories.length + 1,
                  isCustom: true,
                  items: {},
                  createdAt: new Date(),
                  updatedAt: new Date(),
                })}
              >
                + 添加分类
              </Button>
            </div>

            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-card__info">
                    <h4 className="category-card__name">
                      {category.name}
                      {category.isCustom && (
                        <span className="custom-tag">自定义</span>
                      )}
                    </h4>
                    <p className="category-card__count">
                      {Object.keys(category.items).length} 个服务项目
                    </p>
                  </div>
                  <div className="category-card__actions">
                    {category.isCustom && (
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => setShowDeleteConfirm({
                          type: 'category',
                          id: category.id,
                          name: category.name
                        })}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Management Tab */}
        {activeTab === 'data' && (
          <div className="service-manager__content">
            <div className="service-manager__header">
              <h3>数据管理</h3>
              <p className="service-manager__description">
                导入导出服务配置数据，或重置为系统默认配置。
              </p>
            </div>

            <div className="data-management-grid">
              <div className="data-action-card">
                <h4>导出数据</h4>
                <p>将当前的服务配置导出为JSON文件</p>
                <Button
                  variant="secondary"
                  onClick={handleExportData}
                >
                  导出配置
                </Button>
              </div>

              <div className="data-action-card">
                <h4>导入数据</h4>
                <p>从JSON文件导入服务配置</p>
                <label className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    disabled={isLoading}
                    className="file-input"
                  />
                  <Button
                    variant="secondary"
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    选择文件导入
                  </Button>
                </label>
              </div>

              <div className="data-action-card">
                <h4>重置配置</h4>
                <p>恢复为系统默认的服务配置</p>
                <Button
                  variant="danger"
                  onClick={handleResetToDefault}
                >
                  重置为默认
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title={editingItem.id.startsWith('new_') ? '添加服务项目' : '编辑服务项目'}
          size="medium"
        >
          <div className="edit-form">
            <Input
              label="服务名称"
              type="text"
              value={editingItem.name}
              onChange={(value) => setEditingItem({ ...editingItem, name: value })}
              required
              fullWidth
              maxLength={50}
            />

            <Input
              label="服务价格"
              type="number"
              value={editingItem.price}
              onChange={(value) => setEditingItem({ ...editingItem, price: parseFloat(value) || 0 })}
              required
              fullWidth
              min={0}
              step={0.01}
            />

            <Input
              label="服务描述"
              type="text"
              value={editingItem.description || ''}
              onChange={(value) => setEditingItem({ ...editingItem, description: value })}
              fullWidth
              maxLength={200}
            />

            <div className="edit-form__actions">
              <Button
                variant="secondary"
                onClick={() => setEditingItem(null)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={editingItem.id.startsWith('new_') ? handleSaveNewItem : handleSaveItem}
                disabled={!editingItem.name.trim() || editingItem.price < 0}
              >
                保存
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          title="添加服务分类"
          size="small"
        >
          <div className="edit-form">
            <Input
              label="分类名称"
              type="text"
              value={editingCategory.name}
              onChange={(value) => setEditingCategory({ ...editingCategory, name: value })}
              required
              fullWidth
              maxLength={30}
            />

            <div className="edit-form__actions">
              <Button
                variant="secondary"
                onClick={() => setEditingCategory(null)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveCategory}
                disabled={!editingCategory.name.trim()}
              >
                添加
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          title="确认删除"
          size="small"
        >
          <div className="delete-confirm">
            <p>
              确定要删除{showDeleteConfirm.type === 'item' ? '服务项目' : '服务分类'}「
              <strong>{showDeleteConfirm.name}</strong>」吗？
            </p>
            {showDeleteConfirm.type === 'category' && (
              <p className="delete-confirm__warning">
                ⚠️ 删除分类将同时删除该分类下的所有服务项目，此操作不可恢复。
              </p>
            )}

            <div className="delete-confirm__actions">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                取消
              </Button>
              <Button
                variant="danger"
                onClick={showDeleteConfirm.type === 'item' ? handleDeleteItem : handleDeleteCategory}
              >
                删除
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  )
}

export default ServiceManager