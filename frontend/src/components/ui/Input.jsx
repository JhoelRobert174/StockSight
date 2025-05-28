export default function Input({
  type = "text",
  variant = "default", // "compact", "dry", "subtle", "ghost", "error"
  className = "",
  ...props
}) {
  const dryStyle = "w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const base = "transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white";

  const variantStyles = {
    default: "w-full px-4 py-2 border border-gray-300 rounded-md",
    compact: "w-20 px-2 py-1 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm",
    subtle: "w-full px-3 py-2 border border-transparent rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-gray-400",
    ghost: "w-full px-3 py-2 border-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
    error: "w-full px-4 py-2 border border-red-500 rounded-md bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 focus:ring-red-500"
  };

  const typeStyles = {
    file: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700",
    checkbox: "w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500",
    radio: "w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
  };

  let chosenStyle = "";

  if (variant === "dry") {
    chosenStyle = dryStyle;
  } else if (typeStyles[type]) {
    chosenStyle = `${base} ${typeStyles[type]}`;
  } else if (variant === "compact" && type === "number") {
    chosenStyle = `${base} ${variantStyles.compact}`;
  } else {
    chosenStyle = `${base} ${variantStyles[variant] || variantStyles.default}`;
  }

  const finalClass = `${chosenStyle} ${className}`.replace(/\s+/g, ' ').trim();

  return <input type={type} className={finalClass} {...props} />;
}
