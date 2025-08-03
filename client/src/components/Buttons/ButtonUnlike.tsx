import { UnlikeIcon } from '../Icons';

export default function ButtonUnlike({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void | {};
}) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (onClick) onClick();
  }
  return (
    <button
      type="button"
      className={`flex h-13 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-50 bg-red-50 px-3 ${className}`}
      onClick={handleClick}
    >
      <UnlikeIcon className="h-5.5 w-5.5 fill-red-700" />
      <span className="text-red-700">Unlike</span>
    </button>
  );
}
