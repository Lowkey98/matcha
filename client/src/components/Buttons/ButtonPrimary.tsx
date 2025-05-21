export default function ButtonPrimary({
  type,
  value,
  className,
  onClick,
}: {
  type: "button" | "submit";
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
      className={`bg-primary border-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 text-white ${className}`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
