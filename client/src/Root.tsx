import { Outlet } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { createContext, useEffect } from 'react';
import { useState } from 'react';
import type { UserInfo } from '../../shared-types/index.d.ts';
import { ToastProvider } from './components/ToastProvider';
import { getUserInfo } from '../Api';
type UserContextType = {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  setLoading: () => {},
  loading: true,
});

export default function Root() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserInfo({ token })
        .then((userInfo) => {
          console.log('User data fetched:', userInfo);
          setUser(userInfo as UserInfo);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error.message);
          setUser(null); // Reset user if there's an error
          setLoading(false);
        });
    } else {
      setUser(null); // Reset user if no token is found
      setLoading(false);
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      <ToastProvider>
        {user && (
          <>
            <Header />
            {user.age ? <Navigation /> : null}
          </>
        )}
        {/* TODO handle display of sidebar depends on the authentication */}
        <Outlet />
      </ToastProvider>
    </UserContext.Provider>
  );
}
