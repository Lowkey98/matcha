import { Helmet } from 'react-helmet';
import { ExclamationBorderIcon } from '../components/Icons';
import { useContext, useEffect, useState } from 'react';
import { UserInfo } from '../../../shared/types';
import { UserContext } from '../context/UserContext';
import { getViewers } from '../../Api';
import { UserProfileCard } from './Likes';

export default function Viewers() {
  const [viewedUsers, setViewedUsers] = useState<UserInfo[] | null>(null);
  const [loader, setLoader] = useState<boolean>(true);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        getViewers({ tagertUserId: user.id, token })
          .then((viewers: UserInfo[]) => {
            setLoader(false);
            setViewedUsers(viewers);
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
        <title>Matcha - Viewers</title>
      </Helmet>

      {!loader ? (
        viewedUsers?.length ? (
          <main className="mt-12 mb-29 flex flex-col items-center gap-9 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-y-9 md:justify-start md:gap-[2.1vw] lg:mb-12 lg:ml-57 lg:gap-[1.4%] lg:gap-y-4 xl:gap-[2.5%] xl:gap-y-6 2xl:gap-[2%] 2xl:gap-y-7">
            {viewedUsers.map((viewedUser: UserInfo) => (
              <UserProfileCard key={viewedUser.id} userInfo={viewedUser} />
            ))}
          </main>
        ) : (
          <main className="text-secondary flex flex-1 items-center justify-center gap-1 lg:ml-57 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
            <ExclamationBorderIcon className="fill-secondary size-6" />
            Nobody has visited your profile.
          </main>
        )
      ) : null}
    </>
  );
}
