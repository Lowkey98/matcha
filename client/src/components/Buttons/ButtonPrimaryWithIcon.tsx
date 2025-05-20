export default function ButtonPrimaryWithIcon({
  type,
  icon,
  value,
  className,
  onClick,
}: {
  type: "button" | "submit";
  icon: React.JSX.Element;
  value: string;
  className?: string;
  onClick?: () => void | {};
}) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (onClick) onClick();
  }
  return (
    <button
      type={type}
      className={`bg-primary border-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 ${className}`}
      onClick={handleClick}
    >
      {icon}
      <span className="text-white">{value}</span>
    </button>
  );
}
