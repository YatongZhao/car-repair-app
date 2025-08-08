import { BaseEntity } from './common'

// Service item
export interface ServiceItem extends BaseEntity {
  name: string
  price: number
  description?: string
  isCustom: boolean
}

// Service category
export interface ServiceCategory extends BaseEntity {
  name: string
  order: number
  isCustom: boolean
  items: Record<string, ServiceItem>
}

// Service database structure
export interface ServiceDatabase {
  [categoryKey: string]: ServiceCategory
}

// Selected service in quote
export interface SelectedService {
  id: string
  name: string
  price: number
  category: string
  isCustom: boolean
}

// Service configuration
export interface ServiceConfig {
  isLoading: boolean
  lastModified: Date | null
  version: string
}