import { Link } from 'react-router-dom';

export default function LinkPrimaryWithIcon({
  to,
  value,
  icon,
  className,
}: {
  to: string;
  value: string;
  icon: React.JSX.Element;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`bg-primary border-primary flex h-13 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-3 ${className}`}
    >
      {icon}
      <span className="text-white">{value}</span>
    </Link>
  );
}
