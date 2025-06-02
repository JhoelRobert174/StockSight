export default function Table({
  minWidth = "640",
  className = "",
  layout = "auto", // "fixed" atau "auto"
  children,
  ...props
}) {
  const layoutClass = layout === "fixed" ? "table-fixed" : "table-auto"
  const base = `w-full min-w-[${minWidth}px] text-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-[#2C2C2C] ${layoutClass}`

  return (
    <table className={`${base} ${className}`} {...props}>
      {children}
    </table>
  )
}

export function Thead({ className = "", children, ...props }) {
  const base = "bg-gray-50 dark:bg-[#3F3C45] text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider"
  return (
    <thead className={`${base} ${className}`} {...props}>
      {children}
    </thead>
  )
}

export function Tr({ className = "", children, ...props }) {
  const base = "hover:bg-gray-100 dark:hover:bg-[#5600E8] transition"
  return (
    <tr className={`${base} ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function Th({ className = "", variant = "default", children, ...props }) {
  const base = {
    default: "px-6 py-3 text-left text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300",
    compact: "px-3 py-1.5 text-left text-xs uppercase tracking-wide font-medium text-gray-600 dark:text-gray-300"
  }
  return (
    <th className={`${base[variant]} ${className}`} {...props}>
      {children}
    </th>
  )
}

export function Td({ className = "", variant = "default", children, ...props }) {
  const base = {
    default: "px-6 py-3",
    compact: "px-3 py-1.5"
  }
  return (
    <td className={`${base[variant]} ${className}`} {...props}>
      {children}
    </td>
  )
}

export function Tbody({ className = "", children, ...props }) {
  const base = "divide-y divide-gray-200 dark:divide-gray-600"
  return (
    <tbody className={`${base} ${className}`} {...props}>
      {children}
    </tbody>
  )
}
