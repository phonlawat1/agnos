interface ValidationMessageProps {
  type: "error" | "success" | "warning";
  message: string;
}

export default function ValidationMessage({
  type,
  message,
}: ValidationMessageProps) {
  const colorClasses = {
    error: "bg-red-100 text-red-700 border-red-400",
    success: "bg-green-100 text-green-700 border-green-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
  };

  return (
    <div className={`border-l-4 p-4 ${colorClasses[type]}`}>
      <p className="font-medium">{message}</p>
    </div>
  );
}
