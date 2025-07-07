import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from './Icons';

export default function ImagesCarousel({
  imgsUrls,
  className,
}: {
  imgsUrls: string[];
  className?: string;
}) {
  const BACKEND_STATIC_FOLDER = 'http://localhost:3000/';
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ]);
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
    <div className={`relative ${className}`}>
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
          {imgsUrls.map((relativeUrl) => {
            const url = `${BACKEND_STATIC_FOLDER}${relativeUrl}`;
            console.log('url', url);
            return (
              <img
                src={url}
                alt="slide"
                className="flex-none basis-full object-cover select-none"
                draggable={false}
              />
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <button
        className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/10"
        onClick={() => {
          emblaApi?.scrollPrev();
          emblaApi?.plugins()?.autoplay?.reset();
        }}
      >
        <ArrowLeftIcon className="h-5 w-5 fill-white" />
      </button>
      <button
        className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/10"
        onClick={() => {
          emblaApi?.scrollNext();
          emblaApi?.plugins()?.autoplay?.reset();
        }}
      >
        <ArrowRightIcon className="h-5 w-5 fill-white" />
      </button>
      <div className="pointer-events-none absolute top-0 left-0 h-30 w-full rounded-t-2xl bg-gradient-to-b from-black/70 to-transparent"></div>
      {/* Pagination Dots */}
      <div className="absolute top-4 flex w-full justify-center gap-2 px-4">
        {scrollSnaps.map((_, index) => (
          <div
            key={index}
            className="bg-grayDark h-[.2rem] flex-1 overflow-hidden rounded-full"
          >
            <div
              className={`h-full bg-white ${
                index < selectedIndex
                  ? 'w-full'
                  : index === selectedIndex
                    ? `${isPaused ? 'w-0' : 'animate-[progress_3s_linear_forwards]'}`
                    : 'w-0'
              }`}
            ></div>
          </div>
        ))}
      </div>
      <div className="absolute top-9 right-4 flex h-12 w-12 flex-col items-center justify-center rounded-full backdrop-blur-sm">
        <StarIcon className="h-5 w-5 shrink-0 fill-white" />
        <span className="mt-0.5 text-xs text-white">2.5</span>
      </div>
    </div>
  );
}
