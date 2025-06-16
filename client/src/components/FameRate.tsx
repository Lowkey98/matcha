import { StarIcon } from './Icons';

export default function FameRate({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="lg:border-grayDark-100 flex items-center justify-center lg:h-12 lg:w-12 lg:rounded-full lg:border-2">
        <StarIcon className="fill-primary h-7 w-7 lg:h-6 lg:w-6" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-300">Fame rate</span>
        <span className="text-secondary text-lg font-bold">2.5</span>
      </div>
    </div>
  );
}
