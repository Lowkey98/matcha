import { Helmet } from 'react-helmet';
import { LocationOutlineIcon, StarIcon } from '../components/Icons';
import { Link } from 'react-router-dom';

export default function Likes() {
  return (
    <>
      <Helmet>
        <title>Matcha - Likes</title>
      </Helmet>
      <main className="mt-12 mb-29 flex flex-col items-center gap-9 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-y-9 md:justify-start md:gap-[2.1vw] lg:mb-12 lg:ml-57 lg:gap-[1.4%] lg:gap-y-4 xl:gap-[2.5%] xl:gap-y-6 2xl:gap-[2%] 2xl:gap-y-7">
        <ProfileUserCard />
        <ProfileUserCard />
        <ProfileUserCard />
        <ProfileUserCard />
        <ProfileUserCard />
        <ProfileUserCard />
      </main>
    </>
  );
}

export function ProfileUserCard() {
  return (
    <div className="relative h-80 w-68 overflow-hidden rounded-2xl border border-gray-200 shadow-xs sm:w-[47%] md:w-[31.8%] lg:h-68 lg:w-[32.4%] xl:w-[23.1%] 2xl:h-80 2xl:w-[18.4%]">
      <img
        src="/profile-slides-images/slide-3.jpg"
        alt="user"
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 z-10 flex w-full items-center justify-between gap-1 px-3 pb-3 text-xs text-white lg:text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex whitespace-nowrap">
            <div className="max-w-28 overflow-hidden font-bold overflow-ellipsis whitespace-nowrap">
              Username
            </div>
            <span className="ml-1 font-light">, 20</span>
          </div>
          <div className="flex items-center gap-3 font-light">
            <div className="flex items-center gap-1">
              <LocationOutlineIcon className="size-3 fill-white" />
              <span>10km</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="size-3 fill-white" />
              <span>2.5</span>
            </div>
          </div>
        </div>
        <Link
          to="/profile"
          className="w-25 rounded-md border border-white bg-white/10 py-2.5 text-center"
        >
          View profile
        </Link>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-30 w-full bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-25 w-full bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}
