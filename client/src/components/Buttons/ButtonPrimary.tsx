export default function ButtonPrimary({
  value,
  className,
  onClick,
}: {
  value: string;
  className?: string;
  onClick?: () => void | {};
}) {
  function handleClick() {}
  return (
    <button
      type="button"
      className={`bg-primary border-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 text-white ${className}`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
