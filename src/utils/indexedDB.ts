import { DB_NAME, DB_VERSION, STORES } from '../constants'
import { ServiceDatabase } from '../types/service'
import { CustomerConfig } from '../types/customer'

// IndexedDB wrapper class
export class DatabaseManager {
  private db: IDBDatabase | null = null

  async initialize(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.error('IndexedDB is not supported')
        resolve(false)
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('Failed to open database:', request.error)
        resolve(false)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(true)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.SERVICE_DATABASE)) {
          db.createObjectStore(STORES.SERVICE_DATABASE, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(STORES.CUSTOMER_FIELD_CONFIG)) {
          db.createObjectStore(STORES.CUSTOMER_FIELD_CONFIG, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
          db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(STORES.BACKUP_DATA)) {
          db.createObjectStore(STORES.BACKUP_DATA, { keyPath: 'id' })
        }
      }
    })
  }

  private async executeTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([storeName], mode)
      const store = transaction.objectStore(storeName)
      const request = operation(store)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Service Database operations
  async saveServiceDatabase(data: ServiceDatabase): Promise<void> {
    const payload = {
      id: 'serviceDatabase',
      data,
      version: '1.0',
      updatedAt: new Date(),
    }

    await this.executeTransaction(
      STORES.SERVICE_DATABASE,
      'readwrite',
      (store) => store.put(payload)
    )
  }

  async loadServiceDatabase(): Promise<ServiceDatabase | null> {
    try {
      const result = await this.executeTransaction(
        STORES.SERVICE_DATABASE,
        'readonly',
        (store) => store.get('serviceDatabase')
      )
      return result?.data || null
    } catch (error) {
      console.error('Failed to load service database:', error)
      return null
    }
  }

  // Customer Field Config operations
  async saveCustomerFieldConfig(config: CustomerConfig): Promise<void> {
    const payload = {
      id: 'customerFieldConfig',
      data: config,
      version: '1.0',
      updatedAt: new Date(),
    }

    await this.executeTransaction(
      STORES.CUSTOMER_FIELD_CONFIG,
      'readwrite',
      (store) => store.put(payload)
    )
  }

  async loadCustomerFieldConfig(): Promise<CustomerConfig | null> {
    try {
      const result = await this.executeTransaction(
        STORES.CUSTOMER_FIELD_CONFIG,
        'readonly',
        (store) => store.get('customerFieldConfig')
      )
      return result?.data || null
    } catch (error) {
      console.error('Failed to load customer field config:', error)
      return null
    }
  }

  // User Preferences operations
  async saveUserPreferences(preferences: any): Promise<void> {
    const payload = {
      id: 'userPreferences',
      data: preferences,
      updatedAt: new Date(),
    }

    await this.executeTransaction(
      STORES.USER_PREFERENCES,
      'readwrite',
      (store) => store.put(payload)
    )
  }

  async loadUserPreferences(): Promise<any> {
    try {
      const result = await this.executeTransaction(
        STORES.USER_PREFERENCES,
        'readonly',
        (store) => store.get('userPreferences')
      )
      return result?.data || {}
    } catch (error) {
      console.error('Failed to load user preferences:', error)
      return {}
    }
  }

  // Backup operations
  async createBackup(name: string): Promise<void> {
    const serviceDatabase = await this.loadServiceDatabase()
    const customerConfig = await this.loadCustomerFieldConfig()
    const userPreferences = await this.loadUserPreferences()

    const backup = {
      id: `backup_${Date.now()}`,
      name,
      data: {
        serviceDatabase,
        customerConfig,
        userPreferences,
      },
      createdAt: new Date(),
    }

    await this.executeTransaction(
      STORES.BACKUP_DATA,
      'readwrite',
      (store) => store.put(backup)
    )
  }

  async listBackups(): Promise<any[]> {
    try {
      const result = await this.executeTransaction(
        STORES.BACKUP_DATA,
        'readonly',
        (store) => store.getAll()
      )
      return result || []
    } catch (error) {
      console.error('Failed to list backups:', error)
      return []
    }
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    try {
      const backup = await this.executeTransaction(
        STORES.BACKUP_DATA,
        'readonly',
        (store) => store.get(backupId)
      )

      if (!backup?.data) {
        return false
      }

      const { serviceDatabase, customerConfig, userPreferences } = backup.data

      if (serviceDatabase) {
        await this.saveServiceDatabase(serviceDatabase)
      }
      if (customerConfig) {
        await this.saveCustomerFieldConfig(customerConfig)
      }
      if (userPreferences) {
        await this.saveUserPreferences(userPreferences)
      }

      return true
    } catch (error) {
      console.error('Failed to restore backup:', error)
      return false
    }
  }

  // Export all data as JSON
  async exportData(): Promise<string> {
    const serviceDatabase = await this.loadServiceDatabase()
    const customerConfig = await this.loadCustomerFieldConfig()
    const userPreferences = await this.loadUserPreferences()

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        serviceDatabase,
        customerConfig,
        userPreferences,
      },
    }

    return JSON.stringify(exportData, null, 2)
  }

  // Import data from JSON
  async importData(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData)
      
      if (!importData.data) {
        throw new Error('Invalid import data format')
      }

      const { serviceDatabase, customerConfig, userPreferences } = importData.data

      if (serviceDatabase) {
        await this.saveServiceDatabase(serviceDatabase)
      }
      if (customerConfig) {
        await this.saveCustomerFieldConfig(customerConfig)
      }
      if (userPreferences) {
        await this.saveUserPreferences(userPreferences)
      }

      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    const storeNames = [
      STORES.SERVICE_DATABASE,
      STORES.CUSTOMER_FIELD_CONFIG,
      STORES.USER_PREFERENCES,
      STORES.BACKUP_DATA,
    ]

    for (const storeName of storeNames) {
      await this.executeTransaction(
        storeName,
        'readwrite',
        (store) => store.clear()
      )
    }
  }

  // Get storage usage information
  async getStorageInfo(): Promise<{ used: number; available: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
        }
      } catch (error) {
        console.error('Failed to get storage info:', error)
      }
    }
    return null
  }
}

// Singleton instance
export const dbManager = new DatabaseManager()