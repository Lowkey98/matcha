import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LocationIcon,
  LocationOutlineIcon,
  StarIcon,
} from './Icons';
import { Link } from 'react-router-dom';

export default function ProfileSlider({ className }: { className?: string }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const imagesProfilesUrls = [
    '/profile-slides-images/slide-1.jpg',
    '/profile-slides-images/slide-2.jpg',
    '/profile-slides-images/slide-3.jpg',
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    });
  }, [emblaApi, onSelect]);

  return (
    <div
      className={`relative mx-auto h-full rounded-2xl border border-gray-200 shadow-xs ${className}`}
    >
      {/* Embla Carousel */}
      <div
        className="h-full overflow-hidden rounded-2xl"
        ref={emblaRef}
        onMouseMove={() => setIsPaused(true)}
        onTouchStart={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex h-full">
          {imagesProfilesUrls.map((imageProfileUrl) => (
            <ProfileCard
              key={imageProfileUrl}
              imageProfileUrl={imageProfileUrl}
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        className="bg-primary absolute top-1/2 -left-18 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full lg:flex"
        onClick={() => {
          emblaApi?.scrollPrev();
          emblaApi?.plugins()?.autoplay?.reset();
        }}
      >
        <ArrowLeftIcon className="h-5 w-5 fill-white" />
      </button>
      {emblaApi?.canScrollNext() && (
        <button
          className="bg-primary absolute top-1/2 -right-18 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full lg:flex"
          onClick={() => {
            emblaApi?.scrollNext();
            emblaApi?.plugins()?.autoplay?.reset();
          }}
        >
          <ArrowRightIcon className="h-5 w-5 fill-white" />
        </button>
      )}
    </div>
  );
}

function ProfileCard({ imageProfileUrl }: { imageProfileUrl: string }) {
  return (
    <div className="relative flex-none basis-full">
      <img
        src={imageProfileUrl}
        alt="card"
        className="h-full w-full object-cover select-none"
        draggable={false}
      />
      <div className="absolute bottom-0 left-0 z-10 flex w-full items-center justify-between px-4 pb-6 text-white">
        <div className="flex flex-col gap-2">
          <div className="text-xl">
            <span className="font-bold">Username,</span>
            <span className="ml-1 font-light">20</span>
          </div>
          <div className="flex items-center gap-3 font-light">
            <div className="flex items-center gap-1">
              <LocationOutlineIcon className="h-4 w-4 fill-white" />
              <span>10km</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 fill-white" />
              <span>2.5</span>
            </div>
          </div>
        </div>
        <Link
          to="/profile"
          className="w-[40%] rounded-md border border-white bg-white/10 py-2.5 text-center sm:w-40"
        >
          View profile
        </Link>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-30 w-full bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-25 w-full bg-gradient-to-t from-black/70 to-transparent"></div>
    </div>
  );
}
