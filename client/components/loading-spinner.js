export default function LoadingSpinner({ size = "default" }) {
    const sizeClasses = {
      small: "h-4 w-4 border-2",
      default: "h-8 w-8 border-3",
      large: "h-12 w-12 border-4",
    }
  
    const spinnerSize = sizeClasses[size] || sizeClasses.default
  
    return (
      <div className="flex justify-center items-center">
        <div className={`${spinnerSize} animate-spin rounded-full border-gray-300 border-t-primary`}></div>
      </div>
    )
  }
  