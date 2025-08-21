interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      ></div>
      <p className="mt-2 text-sm text-gray-600">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
