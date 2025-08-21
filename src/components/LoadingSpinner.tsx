interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  return (
    <div 
      className={`loading-spinner loading-spinner-${size} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner-ring"></div>
    </div>
  )
}

export default LoadingSpinner
