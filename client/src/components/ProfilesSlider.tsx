import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from './Icons';

export default function ProfileSlider({ className }: { className?: string }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
          <img
            src="/profile-slides-images/slide-1.jpg"
            alt="slide"
            className="h-full w-full flex-none basis-full object-cover select-none"
            draggable={false}
          />
          <img
            src="/profile-slides-images/slide-2.jpg"
            alt="slide"
            className="h-full w-full flex-none basis-full object-cover select-none"
            draggable={false}
          />
          <img
            src="/profile-slides-images/slide-3.jpg"
            alt="slide"
            className="h-full w-full flex-none basis-full object-cover select-none"
            draggable={false}
          />
          <img
            src="/profile-slides-images/slide-4.jpg"
            alt="slide"
            className="h-full w-full flex-none basis-full object-cover select-none"
            draggable={false}
          />
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
      <div className="pointer-events-none absolute bottom-0 left-0 h-30 w-full rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-25 w-full rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent"></div>
    </div>
  );
}
