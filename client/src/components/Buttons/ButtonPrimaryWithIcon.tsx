export default function ButtonPrimaryWithIcon({
  type,
  icon,
  value,
  className,
}: {
  type: "button" | "submit";
  icon: React.JSX.Element;
  value: string;
  className?: string;
}) {
  return (
    <button
      type={type}
      className={`bg-primary border-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 ${className}`}
    >
      {icon}
      <span className="text-white">{value}</span>
    </button>
  );
}
