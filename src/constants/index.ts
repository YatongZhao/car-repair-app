// Application constants

// Database configuration
export const DB_NAME = 'CarRepairApp'
export const DB_VERSION = 1

// Object store names
export const STORES = {
  SERVICE_DATABASE: 'serviceDatabase',
  CUSTOMER_FIELD_CONFIG: 'customerFieldConfig',
  USER_PREFERENCES: 'userPreferences',
  BACKUP_DATA: 'backupData',
} as const

// Application steps
export const STEPS = {
  INPUT: 'input',
  REVIEW: 'review',
  PRINT: 'print',
} as const

// Field types
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  EMAIL: 'email',
  TEL: 'tel',
} as const

// Currency formatting
export const CURRENCY_SYMBOL = '¥'
export const CURRENCY_LOCALE = 'zh-CN'

// Responsive breakpoints (px)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
} as const