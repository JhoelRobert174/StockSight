export default function Loading({ text = "Loading..." }) {
  return (
    <div className="w-full h-[200px] flex flex-col justify-center items-center text-gray-600 dark:text-gray-300">
      <svg
        className="animate-spin h-6 w-6 mb-2 text-blue-500 dark:text-[#6200EE]"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor" strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l4-4-4-4v4a10 10 0 00-10 10h4z"
        />
      </svg>
      <span className="text-sm">{text}</span>
    </div>
  )
}
