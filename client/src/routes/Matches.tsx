import { Helmet } from 'react-helmet';
import {
  ExclamationBorderIcon,
  LocationOutlineIcon,
  SendMessageIcon,
  StarIcon,
} from '../components/Icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserInfo } from '../../../shared/types';
import { UserContext } from '../context/UserContext';
import { getMatches } from '../../Api';
import { BACKEND_STATIC_FOLDER } from '../components/ImagesCarousel';
import { getDistanceInKilometers } from './UserProfile';

export default function Matches() {
  const [matchedUsers, setMatchedUsers] = useState<UserInfo[] | null>(null);
  const [loader, setLoader] = useState<boolean>(true);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        getMatches({ actorUserId: user.id, token })
          .then((matches: UserInfo[]) => {
            setLoader(false);
            setMatchedUsers(matches);
          })
          .catch(() => {
            setLoader(false);
          });
      }
    }
  }, [user]);
  return (
    <>
      <Helmet>
        <title>Matcha - Matches</title>
      </Helmet>

      {!loader ? (
        matchedUsers?.length ? (
          <main className="mt-12 mb-29 flex flex-col items-center gap-9 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-y-9 md:justify-start md:gap-[2.1vw] lg:mb-12 lg:ml-57 lg:gap-[1.4%] lg:gap-y-4 xl:gap-[2.5%] xl:gap-y-6 2xl:gap-[2%] 2xl:gap-y-7">
            {matchedUsers.map((matchedUser: UserInfo) => (
              <MatchedUserProfileCard
                key={matchedUser.id}
                userInfo={matchedUser}
              />
            ))}
          </main>
        ) : (
          <main className="text-secondary flex flex-1 items-center justify-center gap-1 lg:ml-57 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
            <ExclamationBorderIcon className="fill-secondary size-6" />
            No one has matched with you.
          </main>
        )
      ) : null}
    </>
  );
}

function MatchedUserProfileCard({ userInfo }: { userInfo: UserInfo }) {
  const { user } = useContext(UserContext);
  const distanceInKilometers = getDistanceInKilometers({
    actorUserInfo: user,
    targetUserInfo: userInfo,
  });
  return (
    <div className="relative h-80 w-68 overflow-hidden rounded-2xl border border-gray-200 shadow-xs sm:w-[47%] md:w-[31.8%] lg:h-68 lg:w-[32.4%] xl:w-[23.1%] 2xl:h-80 2xl:w-[18.4%]">
      <img
        src={`${BACKEND_STATIC_FOLDER}${userInfo.imagesUrls?.[0]}`}
        alt="user"
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 z-10 flex w-full items-center justify-between gap-1 px-3 pb-3 text-xs text-white lg:text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex whitespace-nowrap">
            <div className="max-w-28 overflow-hidden font-bold overflow-ellipsis whitespace-nowrap">
              {userInfo.username}
            </div>
            <span className="ml-1 font-light">, {userInfo.age}</span>
          </div>
          <div className="flex items-center gap-3 font-light">
            <div className="flex items-center gap-1">
              <LocationOutlineIcon className="size-3 fill-white" />
              <span>{distanceInKilometers} km</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="size-3 fill-white" />
              <span>2.5</span>
            </div>
          </div>
        </div>
        <Link
          to={`/messages/${userInfo.id}`}
          className="bg-primary flex items-center justify-center rounded-full p-2.5"
        >
          <SendMessageIcon className="size-5 fill-white" />
        </Link>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-30 w-full bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-25 w-full bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}
