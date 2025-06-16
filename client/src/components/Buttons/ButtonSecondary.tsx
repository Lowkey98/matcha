export default function ButtonSecondary({
  type,
  value,
  className,
  onClick,
}: {
  type: 'button' | 'submit';
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
      className={`border-secondary text-secondary flex h-13 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 bg-white px-3 ${className}`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
