export default function ButtonSecondaryWithIcon({
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
      className={`border-grayDark-100 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 bg-white p-3 ${className}`}
      onClick={handleClick}
    >
      {icon}
      <span className="text-secondary">{value}</span>
    </button>
  );
}
