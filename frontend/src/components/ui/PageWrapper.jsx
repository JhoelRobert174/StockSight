// File: PageWrapper.jsx (Relevant part for non-centered pages)

export default function PageWrapper({ title, actions, children, centered = false }) {
  return (
    <div
      className={`w-full ${ // This outer div takes full width of its container (main)
        centered
          ? "min-h-screen flex items-center justify-center px-4 pt-[60px]" // Centered version example
          // For default pages:
          // - px-4 sm:px-6 lg:px-8: Horizontal padding
          // - py-6: Vertical padding
          // - pt-[60px]: Additional top padding to offset the fixed Navbar's height
          // - xl:max-w-screen-xl: Max width for the content area on large screens
          // - mx-auto: Centers the content block when it's narrower than its container (main)
          : "px-4 sm:px-6 lg:px-8 py-6 pt-[60px] xl:max-w-screen-xl mx-auto"
      }`}
    >
      <div className={centered ? "w-full max-w-sm" : "w-full"}> {/* Inner div, takes full width of parent */}
        {title && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center mb-6 gap-4">
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
  );
}