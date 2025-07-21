import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSortDown,
  ArrowSortUp,
  CloseIcon,
  FilterIcon,
  LocationOutlineIcon,
  SortIcon,
  StarIcon,
} from './Icons';
import { Link } from 'react-router-dom';
import { Sort } from '../../../shared/types';
import { SortsContext } from '../context/SortsContext';

export default function ProfileSlider({ className }: { className?: string }) {
  const [, setIsPaused] = useState<boolean>(false);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [, setSelectedIndex] = useState(0);
  const [, setScrollSnaps] = useState<number[]>([]);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const imagesProfilesUrls = [
    '/profile-slides-images/slide-1.jpg',
    '/profile-slides-images/slide-2.jpg',
    '/profile-slides-images/slide-3.jpg',
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  function handleClickSort() {
    setShowSort(!showSort);
  }

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
      className={`relative h-full rounded-2xl border border-gray-200 shadow-xs ${className}`}
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
      <div className="absolute top-0 -right-18 hidden lg:block">
        <button
          type="button"
          className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
          onClick={handleClickSort}
        >
          <SortIcon className="fill-secondary h-6 w-6" />
        </button>
        <button
          type="button"
          className="border-grayDark-100 mt-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
        >
          <FilterIcon className="fill-secondary h-6 w-6" />
        </button>
      </div>
      {showSort ? <SortDesktop setShowSort={setShowSort} /> : null}

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

function SortDesktop({
  setShowSort,
}: {
  setShowSort: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { sorts } = useContext(SortsContext);
  function handleClickClose() {
    setShowSort(false);
  }
  return (
    <div className="text-secondary border-secondary absolute top-0 -right-3 hidden w-70 rounded-lg border-2 bg-white pt-3 lg:block 2xl:-right-91">
      <div className="flex items-center justify-between px-3 pb-3">
        <span className="font-medium">Sort by</span>
        <button
          type="button"
          className="cursor-pointer"
          onClick={handleClickClose}
        >
          <CloseIcon className="fill-secondary size-3.5" />
        </button>
      </div>
      <div className="bg-grayDark-100 h-0.5" />
      <div className="flex flex-col gap-6 px-3 py-3">
        {sorts.map((sort: Sort, index: number) => (
          <SortCard key={index} sortInfo={sort} />
        ))}
      </div>
    </div>
  );
}

export function SortCard({ sortInfo }: { sortInfo: Sort }) {
  const { sorts, setSorts } = useContext(SortsContext);
  function handleClickAsc() {
    if (sortInfo.sort === 'desc') {
      const sortsWithCurrentSortAsc: Sort[] = sorts.map((sort) => {
        if (sort.name === sortInfo.name)
          return {
            name: sort.name,
            sort: 'asc',
          };
        return sort;
      });
      setSorts(sortsWithCurrentSortAsc);
    }
  }
  function handleClickDesc() {
    if (sortInfo.sort === 'asc') {
      const sortsWithCurrentSortDesc: Sort[] = sorts.map((sort) => {
        if (sort.name === sortInfo.name)
          return {
            name: sort.name,
            sort: 'desc',
          };
        return sort;
      });
      setSorts(sortsWithCurrentSortDesc);
    }
  }
  return (
    <div className="flex items-center justify-between">
      <span>{sortInfo.name}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`cursor-pointer rounded-md border-2 p-1 ${sortInfo.sort === 'asc' ? 'bg-primary border-transparent' : 'border-secondary bg-white'}`}
          onClick={handleClickAsc}
        >
          <ArrowSortUp
            className={`size-3 ${sortInfo.sort === 'asc' ? 'fill-white' : 'fill-secondary'}`}
          />
        </button>
        <button
          type="button"
          className={`cursor-pointer rounded-md border-2 p-1 ${sortInfo.sort === 'desc' ? 'bg-primary border-transparent' : 'border-secondary bg-white'}`}
          onClick={handleClickDesc}
        >
          <ArrowSortDown
            className={`size-3 ${sortInfo.sort === 'desc' ? 'fill-white' : 'fill-secondary'}`}
          />
        </button>
      </div>
    </div>
  );
}
