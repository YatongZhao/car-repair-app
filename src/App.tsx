import { useEffect, useState } from 'react'
import { Layout, Row, Col, Button as AntButton, ConfigProvider } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
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
import Loading from './components/Loading'
import zhCN from 'antd/locale/zh_CN'

const { Header, Content } = Layout

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
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>汽车修理厂报价系统</h1>
          </Header>
          <Content style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
          }}>
            <Loading size="large" text="正在初始化系统..." />
          </Content>
        </Layout>
      </ConfigProvider>
    )
  }

  if (!isInitialized) {
    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>汽车修理厂报价系统</h1>
          </Header>
          <Content style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            padding: '50px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2>系统初始化失败</h2>
              <p>请检查浏览器兼容性或刷新页面重试。</p>
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'auto',
          minHeight: '64px',
        }}>
          <Row align="middle" justify="space-between" style={{ width: '100%', flexWrap: 'nowrap' }}>
            <Col flex="1" style={{ minWidth: 0 }}>
              <div style={{ color: 'white' }}>
                <h1 style={{ 
                  color: 'white', 
                  margin: 0, 
                  fontSize: 'clamp(18px, 4vw, 24px)', 
                  fontWeight: 700,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  汽车修理厂报价系统
                </h1>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  margin: 0, 
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  lineHeight: '1.4',
                  display: window.innerWidth < 768 ? 'none' : 'block'
                }}>
                  专业、高效、透明的维修报价服务
                </p>
              </div>
            </Col>
            <Col style={{ flexShrink: 0, marginLeft: '16px' }}>
              <AntButton
                type="default"
                icon={<SettingOutlined />}
                onClick={() => dispatch(toggleServiceManager())}
                size={window.innerWidth < 768 ? 'small' : 'middle'}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                服务管理
              </AntButton>
            </Col>
          </Row>
        </Header>
        
        <Content style={{ 
          padding: '24px',
          background: '#f5f5f5',
          flex: 1,
        }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12} order={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CustomerInfoForm />
                <ServiceSelection />
              </div>
            </Col>
            <Col xs={24} lg={12} order={2}>
              <div style={{ position: 'sticky', top: '120px' }}>
                <QuoteDisplay />
              </div>
            </Col>
          </Row>
        </Content>

        {/* Service Manager Modal */}
        <ServiceManager
          isOpen={showServiceManager}
          onClose={() => dispatch(toggleServiceManager())}
        />
      </Layout>
    </ConfigProvider>
  )
}

export default App