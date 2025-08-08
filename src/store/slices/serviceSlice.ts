import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ServiceDatabase, SelectedService, ServiceConfig } from '../../types/service'

interface ServiceState {
  selectedServices: SelectedService[]
  serviceDatabase: ServiceDatabase
  totalAmount: number
  config: ServiceConfig
}

const initialState: ServiceState = {
  selectedServices: [],
  serviceDatabase: {},
  totalAmount: 0,
  config: {
    isLoading: false,
    lastModified: null,
    version: '1.0',
  },
}

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<SelectedService>) => {
      // Check if service already exists
      const existingService = state.selectedServices.find(
        service => service.id === action.payload.id
      )
      if (!existingService) {
        state.selectedServices.push(action.payload)
        state.totalAmount += action.payload.price
      }
    },
    removeService: (state, action: PayloadAction<string>) => {
      const serviceIndex = state.selectedServices.findIndex(
        service => service.id === action.payload
      )
      if (serviceIndex !== -1) {
        const removedService = state.selectedServices[serviceIndex]
        state.totalAmount -= removedService.price
        state.selectedServices.splice(serviceIndex, 1)
      }
    },
    clearAllServices: (state) => {
      state.selectedServices = []
      state.totalAmount = 0
    },
    setServiceDatabase: (state, action: PayloadAction<ServiceDatabase>) => {
      state.serviceDatabase = action.payload
    },
    setServiceConfig: (state, action: PayloadAction<Partial<ServiceConfig>>) => {
      state.config = { ...state.config, ...action.payload }
    },
  },
})

export const {
  addService,
  removeService,
  clearAllServices,
  setServiceDatabase,
  setServiceConfig,
} = serviceSlice.actions

export default serviceSlice.reducer