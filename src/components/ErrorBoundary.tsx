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
  return (
    <div className="error-boundary">
      <div className="error-content">
        <div className="error-icon" aria-hidden="true">😵</div>
        <h1>Something went wrong</h1>
        <p>We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.</p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-details">
            <summary>Error Details (Development)</summary>
            <pre>{error.toString()}</pre>
            {errorInfo && (
              <pre>{errorInfo.componentStack}</pre>
            )}
          </details>
        )}
        <div className="error-actions">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Refresh Page
          </button>
          <a href="/" className="btn btn-secondary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary
