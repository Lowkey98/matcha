export default function LoaderDots({
  dotsClass = 'bg-black',
}: {
  dotsClass?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <div
        className={`animate-bounce rounded-full [animation-delay:-0.3s] ${dotsClass}`}
      />
      <div
        className={`animate-bounce rounded-full [animation-delay:-0.15s] ${dotsClass}`}
      />
      <div className={`animate-bounce rounded-full ${dotsClass}`} />
    </div>
  );
}
