import { BaseEntity } from './common'

// Basic customer information
export interface CustomerInfo {
  name: string
  phone: string
  carModel: string
  carYear: number
  licensePlate: string
  customFields: Record<string, string>
}

// Custom field configuration
export interface CustomField extends BaseEntity {
  name: string
  type: 'text' | 'number' | 'date' | 'email' | 'tel'
  placeholder: string
  required: boolean
  order: number
}

export interface CustomerConfig {
  customFields: CustomField[]
  fieldOrder: string[]
}