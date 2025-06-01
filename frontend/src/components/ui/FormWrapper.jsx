export default function FormWrapper({ title, onSubmit, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#121212] px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-[#1D1D1D] shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        )}
        <div className="space-y-3">
          {children}
        </div>
      </form>
    </div>
  )
}
