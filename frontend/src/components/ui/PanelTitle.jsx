export default function PanelTitle({ icon: Icon, children }) {
  return (
    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
      <Icon />
      {children}
    </h2>
  )
}
