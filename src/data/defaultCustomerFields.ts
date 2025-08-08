import { CustomField } from '../types/customer'

export const defaultCustomerFields: CustomField[] = [
  // No custom fields by default - users can add their own
  // The basic fields (name, phone, carModel, carYear, licensePlate) are handled separately
]

// Helper function to create new custom field
export const createCustomField = (
  name: string,
  type: 'text' | 'number' | 'date' | 'email' | 'tel' = 'text',
  placeholder: string = '',
  required: boolean = false
): CustomField => ({
  id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  type,
  placeholder,
  required,
  order: Date.now(),
  createdAt: new Date(),
  updatedAt: new Date(),
})