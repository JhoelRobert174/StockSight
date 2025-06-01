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
    outline: "px-4 py-2 rounded border transition-colors",
  }

  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600",
    purblue: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-[#7F39FB] dark:hover:bg-[#6100EC]",
    green: "bg-green-600 hover:bg-green-700 text-white dark:bg-[#18cc57] dark:hover:bg-green-600",
    red: "bg-red-600 hover:bg-red-700 text-white dark:bg-[#CA2442] dark:hover:bg-red-600 dark:text-white",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black dark:bg-[#f4e455] dark:hover:bg-yellow-400 dark:text-black",
    gray: "bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white",
    dark: "bg-gray-800 hover:bg-gray-700 text-white",
    white: "bg-white hover:bg-gray-100 text-black dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-black",
  }

  const outlineColors = {
    blue: "border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900",
    green: "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900",
    red: "border-red-600 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900",
    yellow: "border-yellow-500 text-yellow-500 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900",
    gray: "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700",
    dark: "border-gray-800 text-gray-800 hover:bg-gray-100 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-800",
    white: "border-white text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800",
  }

  const colorClass =
    variant === "outline"
      ? outlineColors[color] || ""
      : colors[color] || ""

  const finalClass = `${base} ${variants[variant] || ""} ${colorClass} ${className}`

  return (
    <button type={type} className={finalClass} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
