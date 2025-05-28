export default function Input({
  type = "text",
  variant = "default", // bisa "compact" buat number
  className = "",
  ...props
}) {
  const base =
    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-white"

  const types = {
    text: "w-full px-4 py-2 border border-gray-300 rounded-md",
    email: "w-full px-4 py-2 border border-gray-300 rounded-md",
    password: "w-full px-4 py-2 border border-gray-300 rounded-md",
    number: variant === "compact"
      ? "w-20 px-2 py-1 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
      : "w-full px-4 py-2 border border-gray-300 rounded-md",
    search: "w-full px-4 py-2 border border-gray-300 rounded-md",
    file: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700",
    checkbox: "w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500",
    radio: "w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500",
    date: "w-full px-4 py-2 border border-gray-300 rounded-md",
  }

  const finalClass = `${base} ${types[type] || types.text} ${className}`

  return <input type={type} className={finalClass} {...props} />
}
