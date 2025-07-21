import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import type { Sort, UserInfo } from '../../shared/types';
import { ToastProvider } from './components/ToastProvider';
import { getUserInfo } from '../Api';
import { UserContext } from './context/UserContext';
import { defaultSorts, SortsContext } from './context/SortsContext';

export default function Root() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [sorts, setSorts] = useState<Sort[]>(defaultSorts);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
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
      setUser(null);
      setLoading(false);
      navigate('/login');
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      <SortsContext.Provider value={{ sorts, setSorts }}>
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
      </SortsContext.Provider>
    </UserContext.Provider>
  );
}
