import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './Dashboard.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import './index.css'

class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="min-h-screen grid place-items-center bg-stone-50 p-8 text-center">
          <div className="max-w-sm space-y-4">
            <h1 className="text-2xl">Let’s take a little pause.</h1>
            <p className="text-sm text-stone-500">Something unexpected happened. Reloading won’t clear your saved quests.</p>
            <button className="rounded-lg bg-purple-200 px-5 py-3 text-purple-900" onClick={() => window.location.reload()}>Reopen my study space</button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ErrorBoundary><Dashboard /></ErrorBoundary>
    </LanguageProvider>
  </StrictMode>,
)
