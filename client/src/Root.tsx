import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { createContext, useEffect } from 'react';
import { useState } from 'react';
import type { UserInfo } from '../../shared/types';
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
  const navigate = useNavigate();
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        getUserInfo({ token })
          .then((userInfo) => {
            setUser(userInfo);
            setLoading(false);
          })
          .catch(() => {
            console.error('Unauthorized access, resetting user state');
            setUser(null); // Reset user if unauthorized
            setLoading(false);
            localStorage.removeItem('token');
            navigate('/login'); // Redirect to login page
          });
      } else {
        setUser(null); // Reset user if no token is found
        setLoading(false);
      }
    };
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
