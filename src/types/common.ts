// Common types used across the application
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ApiError {
  message: string
  code?: string | number
}

export interface AppError {
  message: string
  field?: string
}

export type AppStep = 'input' | 'review' | 'print'

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}