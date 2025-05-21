import { Link } from "react-router-dom";
export default function LinkPrimary({
  to,
  value,
  className,
}: {
  to: string;
  value: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`bg-primary border-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 text-white ${className}`}
    >
      {value}
    </Link>
  );
}
