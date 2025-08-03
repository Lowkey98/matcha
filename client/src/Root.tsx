import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import type { UserInfo } from '../../shared/types';
import { ToastProvider } from './components/ToastProvider';
import { getUserInfo } from '../Api';
import { UserContext } from './context/UserContext';

export default function Root() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (
      location.pathname === '/verifyemail' ||
      location.pathname === '/changePassword'
    ) {
      console.log('here');

      setLoading(false);
      return;
    }
    if (token) {
      getUserInfo({ token })
        .then((userInfo: UserInfo) => {
          setUser(userInfo);
          setLoading(false);
        })
        .catch(() => {
          console.error('Unauthorized access, resetting user state');
          setUser(null);
          setLoading(false);
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      console.log('NO TOKEN');
      setUser(null);
      setLoading(false);
      navigate('/login');
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
