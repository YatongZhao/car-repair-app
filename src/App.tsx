import { useEffect } from 'react'
import { useAppDispatch } from './store/hooks'
import { checkBrowserSupport } from './utils/browserSupport'
import './styles/App.css'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Check browser support on app initialization
    const isSupported = checkBrowserSupport()
    if (!isSupported) {
      // Handle unsupported browser
      console.error('Browser does not support required features')
    }
  }, [dispatch])

  return (
    <div className="app">
      <header className="app-header">
        <h1>汽车修理厂报价系统</h1>
      </header>
      <main className="app-main">
        <div className="container">
          <h2>系统正在初始化...</h2>
          <p>请稍候，我们正在准备您的报价系统。</p>
        </div>
      </main>
    </div>
  )
}

export default App