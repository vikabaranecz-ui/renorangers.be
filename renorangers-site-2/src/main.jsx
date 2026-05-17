import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Root render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'Inter, sans-serif', background: '#fff', color: '#0A0A0A', padding: '24px' }}>
          <div style={{ maxWidth: '560px', textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 12px', fontSize: '32px', lineHeight: 1.1 }}>Er is een fout opgetreden</h1>
            <p style={{ margin: '0 0 18px', color: '#666', lineHeight: 1.6 }}>
              De pagina kon niet correct laden. Vernieuw de pagina of probeer opnieuw binnen enkele minuten.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ border: 'none', background: '#E63329', color: '#fff', padding: '12px 18px', cursor: 'pointer', fontSize: '15px' }}
            >
              Pagina vernieuwen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
