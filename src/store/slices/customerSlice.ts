import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CustomerInfo, CustomerConfig } from '../../types/customer'

interface CustomerState {
  info: CustomerInfo
  config: CustomerConfig
}

const initialState: CustomerState = {
  info: {
    name: '',
    phone: '',
    carModel: '',
    carYear: new Date().getFullYear(),
    licensePlate: '',
    customFields: {},
  },
  config: {
    customFields: [],
    fieldOrder: [],
  },
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    updateCustomerInfo: (
      state,
      action: PayloadAction<{ field: keyof CustomerInfo; value: string | number }>
    ) => {
      const { field, value } = action.payload
      if (field === 'customFields') return // Handle custom fields separately
      ;(state.info[field] as string | number) = value
    },
    updateCustomField: (
      state,
      action: PayloadAction<{ fieldId: string; value: string }>
    ) => {
      const { fieldId, value } = action.payload
      state.info.customFields[fieldId] = value
    },
    resetCustomerInfo: (state) => {
      state.info = initialState.info
    },
    setCustomerConfig: (state, action: PayloadAction<CustomerConfig>) => {
      state.config = action.payload
    },
  },
})

export const {
  updateCustomerInfo,
  updateCustomField,
  resetCustomerInfo,
  setCustomerConfig,
} = customerSlice.actions

export default customerSlice.reducer