export default function PageWrapper({ title, actions, children, centered = false }) {
  return (
    <div
      className={`w-full ${
        centered ? "min-h-screen flex items-center justify-center px-4" : "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      }`}
    >
      <div className={centered ? "w-full max-w-sm" : "w-full"}>
        {title && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h1>
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow">
          {children}
        </div>
      </div>
    </div>
  )
}
