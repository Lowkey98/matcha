import { LikeIcon } from '../Icons';

export default function ButtonLike({
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
      className={`flex h-13 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-green-50 bg-green-50 px-3 ${className}`}
      onClick={handleClick}
    >
      <LikeIcon className="h-5.5 w-5.5 fill-green-700" />
      <span className="text-green-700">Like</span>
    </button>
  );
}
