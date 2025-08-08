import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppStep, AppError } from '../../types/common'

interface UIState {
  isLoading: boolean
  currentStep: AppStep
  showServiceManager: boolean
  showCustomerFieldManager: boolean
  errors: Record<string, AppError>
}

const initialState: UIState = {
  isLoading: false,
  currentStep: 'input',
  showServiceManager: false,
  showCustomerFieldManager: false,
  errors: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCurrentStep: (state, action: PayloadAction<AppStep>) => {
      state.currentStep = action.payload
    },
    toggleServiceManager: (state) => {
      state.showServiceManager = !state.showServiceManager
      if (state.showServiceManager) {
        state.showCustomerFieldManager = false
      }
    },
    toggleCustomerFieldManager: (state) => {
      state.showCustomerFieldManager = !state.showCustomerFieldManager
      if (state.showCustomerFieldManager) {
        state.showServiceManager = false
      }
    },
    setError: (state, action: PayloadAction<{ field: string; error: AppError }>) => {
      const { field, error } = action.payload
      state.errors[field] = error
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload]
    },
    clearAllErrors: (state) => {
      state.errors = {}
    },
  },
})

export const {
  setLoading,
  setCurrentStep,
  toggleServiceManager,
  toggleCustomerFieldManager,
  setError,
  clearError,
  clearAllErrors,
} = uiSlice.actions

export default uiSlice.reducer