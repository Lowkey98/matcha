import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';

export default function Carousel() {
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
    <div className="relative w-full">
      {/* Embla Carousel */}
      <div
        className="overflow-hidden"
        ref={emblaRef}
        onMouseMove={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex">
          <div className="flex-none basis-full bg-red-50 p-8 text-center">
            Slide 1
          </div>
          <div className="flex-none basis-full bg-green-50 p-8 text-center">
            Slide 2
          </div>
          <div className="flex-none basis-full bg-blue-50 p-8 text-center">
            Slide 3
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 rounded bg-black px-2 py-1 text-white disabled:opacity-30"
        onClick={() => {
          emblaApi?.scrollPrev();
          emblaApi?.plugins()?.autoplay?.reset();
        }}
      >
        ‹
      </button>
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded bg-black px-2 py-1 text-white disabled:opacity-30"
        onClick={() => {
          emblaApi?.scrollNext();
          emblaApi?.plugins()?.autoplay?.reset();
        }}
      >
        ›
      </button>

      {/* Pagination Dots */}
      <div className="absolute top-2 flex w-full justify-center gap-2 px-2">
        {scrollSnaps.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-gray-300"
          >
            <div
              className={`h-full bg-black ${
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
    </div>
  );
}
