import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setServiceDatabase } from './store/slices/serviceSlice'
import { setCustomerConfig } from './store/slices/customerSlice'
import { setLoading, toggleServiceManager } from './store/slices/uiSlice'
import { checkBrowserSupport, showUnsupportedBrowserMessage } from './utils/browserSupport'
import { dbManager } from './utils/indexedDB'
import { defaultServices } from './data/defaultServices'
import { defaultCustomerFields } from './data/defaultCustomerFields'
import CustomerInfoForm from './containers/CustomerInfoForm'
import ServiceSelection from './containers/ServiceSelection'
import QuoteDisplay from './containers/QuoteDisplay'
import ServiceManager from './components/ServiceManager'
import Button from './components/Button'
import Loading from './components/Loading'
import './styles/App.css'

function App() {
  const dispatch = useAppDispatch()
  const { isLoading, showServiceManager } = useAppSelector((state) => state.ui)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(setLoading(true))
      
      try {
        // Check browser support
        const isSupported = checkBrowserSupport()
        if (!isSupported) {
          showUnsupportedBrowserMessage()
          return
        }

        // Initialize IndexedDB
        const dbInitialized = await dbManager.initialize()
        if (!dbInitialized) {
          console.error('Failed to initialize database')
          return
        }

        // Load or initialize service database
        let serviceDatabase = await dbManager.loadServiceDatabase()
        if (!serviceDatabase) {
          serviceDatabase = defaultServices
          await dbManager.saveServiceDatabase(serviceDatabase)
        }
        dispatch(setServiceDatabase(serviceDatabase))

        // Load or initialize customer field config
        let customerConfig = await dbManager.loadCustomerFieldConfig()
        if (!customerConfig) {
          customerConfig = {
            customFields: defaultCustomerFields,
            fieldOrder: [],
          }
          await dbManager.saveCustomerFieldConfig(customerConfig)
        }
        dispatch(setCustomerConfig(customerConfig))

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }

    initializeApp()
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>汽车修理厂报价系统</h1>
        </header>
        <main className="app-main">
          <Loading size="large" text="正在初始化系统..." />
        </main>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>汽车修理厂报价系统</h1>
        </header>
        <main className="app-main">
          <div className="container">
            <h2>系统初始化失败</h2>
            <p>请检查浏览器兼容性或刷新页面重试。</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <div className="app-header__title">
            <h1>汽车修理厂报价系统</h1>
            <p className="app-header__subtitle">专业、高效、透明的维修报价服务</p>
          </div>
          <div className="app-header__actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => dispatch(toggleServiceManager())}
              className="header-button"
            >
              ⚙️ 服务管理
            </Button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="app-container">
          <div className="app-grid">
            <div className="app-grid__left">
              <CustomerInfoForm />
              <ServiceSelection />
            </div>
            <div className="app-grid__right">
              <QuoteDisplay />
            </div>
          </div>
        </div>
      </main>

      {/* Service Manager Modal */}
      <ServiceManager
        isOpen={showServiceManager}
        onClose={() => dispatch(toggleServiceManager())}
      />
    </div>
  )
}

export default App