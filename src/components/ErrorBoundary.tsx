import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error} 
          errorInfo={this.state.errorInfo} 
        />
      )
    }

    return this.props.children
  }
}

// Functional component for the error fallback with translations
function ErrorFallback({ error, errorInfo }: { error?: Error; errorInfo?: ErrorInfo }) {
  // We'll use a simple approach for now since ErrorBoundary is a class component
  // In a real app, you might want to use a different pattern or context
  return (
    <div className="error-boundary">
      <div className="error-content">
        <h1>😵 Something went wrong</h1>
        <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-details">
            <summary>Error Details (Development)</summary>
            <pre>{error.toString()}</pre>
            {errorInfo && (
              <pre>{errorInfo.componentStack}</pre>
            )}
          </details>
        )}
        <button 
          onClick={() => window.location.reload()} 
          className="error-button"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

export default ErrorBoundary
