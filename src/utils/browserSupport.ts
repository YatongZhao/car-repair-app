/**
 * Check if the current browser supports all required features
 * @returns true if browser is supported, false otherwise
 */
export function checkBrowserSupport(): boolean {
  // Check IndexedDB support
  if (!window.indexedDB) {
    console.error('Browser does not support IndexedDB')
    return false
  }

  // Check other required features
  const requiredFeatures = [
    'localStorage' in window,
    'JSON' in window,
    'Promise' in window,
    'fetch' in window,
    'Map' in window,
    'Set' in window,
  ]

  const allSupported = requiredFeatures.every(Boolean)
  
  if (!allSupported) {
    console.error('Browser does not support required modern JavaScript features')
  }

  return allSupported
}

/**
 * Get browser information for debugging
 */
export function getBrowserInfo() {
  const userAgent = navigator.userAgent
  const isChrome = userAgent.includes('Chrome')
  const isFirefox = userAgent.includes('Firefox')
  const isSafari = userAgent.includes('Safari') && !isChrome
  const isEdge = userAgent.includes('Edg')

  return {
    userAgent,
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    indexedDBSupported: !!window.indexedDB,
  }
}

/**
 * Show unsupported browser message
 */
export function showUnsupportedBrowserMessage(): void {
  const message = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f7fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      z-index: 9999;
    ">
      <div style="
        max-width: 500px;
        padding: 2rem;
        text-align: center;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">
        <h1 style="color: #e53e3e; margin-bottom: 1rem;">浏览器不兼容</h1>
        <p style="color: #4a5568; margin-bottom: 1.5rem; line-height: 1.6;">
          抱歉，您的浏览器不支持此应用程序所需的功能。
          <br>请升级到以下现代浏览器之一：
        </p>
        <ul style="
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
          color: #2d3748;
        ">
          <li style="margin: 0.5rem 0;">✓ Chrome 70+</li>
          <li style="margin: 0.5rem 0;">✓ Firefox 65+</li>
          <li style="margin: 0.5rem 0;">✓ Safari 12+</li>
          <li style="margin: 0.5rem 0;">✓ Edge 79+</li>
        </ul>
        <p style="color: #718096; font-size: 0.9rem;">
          需要支持 IndexedDB 和现代 JavaScript 特性
        </p>
      </div>
    </div>
  `
  
  document.body.innerHTML = message
}