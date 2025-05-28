export default function Button({
  children,
  variant = "default",
  color = "blue",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    default: "px-4 py-2 rounded-md",
    wide: "w-full mt-6 px-4 py-2 rounded-md",
    ghost: "bg-transparent border border-gray-300 px-4 py-2 rounded-md dark:border-gray-600",
    subtle: "text-sm px-3 py-1 rounded",
    icon: "p-2 rounded-full",
    primaryAction: "inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-md",
  }

  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600",
    green: "bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600",
    red: "bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 dark:text-white",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:text-black",
    gray: "bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white",
    dark: "bg-gray-800 hover:bg-gray-700 text-white",
    white: "bg-white hover:bg-gray-100 text-black dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-black",
  }

  const finalClass = `${base} ${variants[variant] || ""} ${colors[color] || ""} ${className}`

  return (
    <button type={type} className={finalClass} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
