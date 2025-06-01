export default function Message({ type = "error", children }) {
  const base = "mb-4 px-4 py-2 rounded text-sm"
  const style = {
    success: "text-green-600 bg-green-100 dark:bg-green-950",
    error: "text-red-500 bg-red-100 dark:bg-red-950",
    info: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  }[type]

  return <div className={`${base} ${style}`}>{children}</div>
}
