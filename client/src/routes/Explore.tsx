import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ProfileSlider from '../components/ProfilesSlider';
import { UserContext } from '../context/UserContext';
import { FiltersContext } from '../context/FiltersContext';
import { getAllUsers } from '../../Api';
import { UserInfoWithCommonTags } from '../../../shared/types';
import { Navigate } from 'react-router-dom';
import { SortsContext } from '../context/SortsContext';

export default function Explore() {
  const { user, loading } = useContext(UserContext);
  const { filters } = useContext(FiltersContext);
  const [users, setUsers] = useState<UserInfoWithCommonTags[]>([]);
  const { sorts } = useContext(SortsContext);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      return;
    }
    getAllUsers({ token, currentUserId: user.id }).then((users) => {
      let filteredUsers = users.filter((user) => user.age != null);

      console.log('Filtered users:', filteredUsers);
      setUsers(filteredUsers);
    });
  }, [user]);
  if (loading) {
    return null;
  }

  const ageFilter = filters.find((f) => f.name === 'Age')!;
  const locationFilter = filters.find((f) => f.name === 'Location (km)')!;
  const fameFilter = filters.find((f) => f.name === 'Fame rating')!;
  const tagsFilter = filters.find((f) => f.name === 'Common tags')!;

  const filteredUsers = users
    .filter((user) => {
      return (
        user.age !== undefined &&
        user.age >= ageFilter.min &&
        user.age <= ageFilter.max
      );
    })
    .filter((user) => {
      return (
        user.commonTagsCount !== undefined &&
        user.commonTagsCount >= tagsFilter.min &&
        user.commonTagsCount <= tagsFilter.max
      );
    })
    .filter((user) => {
      return (
        user.distanceBetween !== undefined &&
        user.distanceBetween >= locationFilter.min &&
        user.distanceBetween <= locationFilter.max
      );
    })
    .filter((user) => {
      return (
        user.fameRate !== undefined &&
        user.fameRate >= fameFilter.min &&
        user.fameRate <= fameFilter.max
      );
    });

  filteredUsers.sort((a, b) => {
    for (const sort of sorts) {
      if (sort.sort === 'asc') {
        if (sort.name === 'Age') {
          return (a.age ?? 0) - (b.age ?? 0);
        } else if (sort.name === 'Location') {
          return a.distanceBetween - b.distanceBetween;
        } else if (sort.name === 'Fame rating') {
          return (a.fameRate ?? 0) - (b.fameRate ?? 0);
        } else if (sort.name === 'Common tags') {
          return a.commonTagsCount - b.commonTagsCount;
        }
      } else if (sort.sort === 'desc') {
        if (sort.name === 'Age') {
          return (b.age ?? 0) - (a.age ?? 0);
        } else if (sort.name === 'Location') {
          return b.distanceBetween - a.distanceBetween;
        } else if (sort.name === 'Fame rating') {
          return (b.fameRate ?? 0) - (a.fameRate ?? 0);
        } else if (sort.name === 'Common tags') {
          return (b.commonTagsCount ?? 0) - (a.commonTagsCount ?? 0);
        }
      }
    }
    return 0;
  });
  if (!user) return <Navigate to={'/login'} replace />;
  if (!user.age) return <Navigate to={'/createProfile'} replace />;
  return (
    <>
      <Helmet>
        <title>Matcha - Explore</title>
      </Helmet>
      <main className="mb-21 flex h-1/2 flex-1 pt-5 lg:mb-0 lg:ml-57 lg:items-center lg:justify-center lg:py-5 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
        <ProfileSlider
          users={filteredUsers}
          className="w-full lg:h-[40rem] lg:w-[27rem] 2xl:h-[45rem] 2xl:w-[30rem]"
        />
      </main>
    </>
  );
}
