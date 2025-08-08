import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ServiceDatabase, SelectedService, ServiceConfig, ServiceItem, ServiceCategory } from '../../types/service'

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
    // Service Management Actions
    updateServiceItem: (
      state, 
      action: PayloadAction<{ categoryId: string; itemId: string; updates: Partial<ServiceItem> }>
    ) => {
      const { categoryId, itemId, updates } = action.payload
      if (state.serviceDatabase[categoryId]?.items[itemId]) {
        state.serviceDatabase[categoryId].items[itemId] = {
          ...state.serviceDatabase[categoryId].items[itemId],
          ...updates,
          updatedAt: new Date(),
        }
      }
    },
    addServiceCategory: (state, action: PayloadAction<ServiceCategory>) => {
      const category = action.payload
      state.serviceDatabase[category.id] = category
    },
    removeServiceCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload
      delete state.serviceDatabase[categoryId]
      // Remove any selected services from this category
      state.selectedServices = state.selectedServices.filter(
        service => service.id.indexOf(categoryId) !== 0
      )
      // Recalculate total
      state.totalAmount = state.selectedServices.reduce((sum, service) => sum + service.price, 0)
    },
    addServiceItem: (
      state, 
      action: PayloadAction<{ categoryId: string; item: ServiceItem }>
    ) => {
      const { categoryId, item } = action.payload
      if (state.serviceDatabase[categoryId]) {
        state.serviceDatabase[categoryId].items[item.id] = item
      }
    },
    removeServiceItem: (
      state, 
      action: PayloadAction<{ categoryId: string; itemId: string }>
    ) => {
      const { categoryId, itemId } = action.payload
      if (state.serviceDatabase[categoryId]?.items[itemId]) {
        delete state.serviceDatabase[categoryId].items[itemId]
      }
      // Remove from selected services if it exists
      state.selectedServices = state.selectedServices.filter(service => service.id !== itemId)
      // Recalculate total
      state.totalAmount = state.selectedServices.reduce((sum, service) => sum + service.price, 0)
    },
    resetToDefaultServices: (state, action: PayloadAction<ServiceDatabase>) => {
      state.serviceDatabase = action.payload
      state.selectedServices = []
      state.totalAmount = 0
    },
  },
})

export const {
  addService,
  removeService,
  clearAllServices,
  setServiceDatabase,
  setServiceConfig,
  updateServiceItem,
  addServiceCategory,
  removeServiceCategory,
  addServiceItem,
  removeServiceItem,
  resetToDefaultServices,
} = serviceSlice.actions

export default serviceSlice.reducer