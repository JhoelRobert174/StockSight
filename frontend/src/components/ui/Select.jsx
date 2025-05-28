export default function Select({
  name,
  value,
  onChange,
  variant = "default",
  className = "",
  children,
  ...props
}) {
  const dryStyle = "w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const variantStyles = {
    default: "w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 dark:bg-gray-800 dark:text-white",
    dry: dryStyle,
    subtle: "w-full px-3 py-2 border border-transparent rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-gray-400",
    error: "w-full px-4 py-2 border border-red-500 rounded-md bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 focus:ring-red-500"
  };

  const finalClass = `${variantStyles[variant] || variantStyles.default} ${className}`.replace(/\s+/g, ' ').trim();

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
