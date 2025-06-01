export default function Select({
  name,
  value,
  onChange,
  variant = "default",
  className = "",
  minWidth = "w-full", 
  children,
  ...props
}) {
  const dryStyle =
    "px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2C2C2C] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#7F39FB]";

  const variantStyles = {
    default: "px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 dark:bg-gray-800 dark:text-white",
    dry: dryStyle,
    subtle: "px-3 py-2 border border-transparent rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-gray-400",
    error: "px-4 py-2 border border-red-500 rounded-md bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 focus:ring-red-500"
  };

  const finalClass = `${minWidth} ${variantStyles[variant] || variantStyles.default} ${className}`
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={finalClass}
      {...props}
    >
      {children}
    </select>
  );
}
