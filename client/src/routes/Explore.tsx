import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Login from './Login';
import CreateProfile from './CreateProfile';
import ProfileSlider from '../components/ProfilesSlider';
import { UserContext } from '../context/UserContext';
import { FiltersContext } from '../context/FiltersContext';
import { getAllUsers } from '../../Api';
import { UserInfo } from '../../../shared/types';

export default function Explore() {
  const { user, loading } = useContext(UserContext);
  const { filters } = useContext(FiltersContext);
  const [users, setUsers] = useState<UserInfo[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    getAllUsers({ token }).then((users) => {
      const filteredUsers = users.filter((user) => user.age != null);
      setUsers(filteredUsers);
    });
  }, []);
  if (loading) {
    return null;
  }
  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Helmet>
        <title>Matcha - Explore</title>
      </Helmet>
      <main className="mb-21 flex h-1/2 flex-1 pt-5 lg:mb-0 lg:ml-57 lg:items-center lg:justify-center lg:py-5 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
        <ProfileSlider
          users={users}
          className="w-full lg:h-[40rem] lg:w-[27rem] 2xl:h-[45rem] 2xl:w-[30rem]"
        />
      </main>
    </>
  );
}
