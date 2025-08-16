import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import type { Filter, Sort, UserInfo } from '../../shared/types';
import { ToastProvider } from './components/ToastProvider';
import { getUserInfo } from '../Api';
import { UserContext } from './context/UserContext';
import { io, Socket } from 'socket.io-client';
import { defaultSorts, SortsContext } from './context/SortsContext';
import { defaultFilters, FiltersContext } from './context/FiltersContext';
import { BACKEND_STATIC_FOLDER } from './components/ImagesCarousel';
import { SocketContext } from './context/SocketContext';
export default function Root() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sorts, setSorts] = useState<Sort[]>(defaultSorts);
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (
      location.pathname === '/verifyemail' ||
      location.pathname === '/resetPassword'
    ) {
      setLoading(false);
      return;
    }
    if (token) {
      getUserInfo({ token })
        .then((userInfo: UserInfo) => {
          setUser(userInfo);
          if (userInfo.age) {
            const socketClient = io(BACKEND_STATIC_FOLDER, {
              auth: {
                userId: userInfo.id,
              },
            });
            setSocket(socketClient);
          } else {
            navigate('/createProfile');
          }
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
      <SocketContext.Provider value={{ socket, setSocket }}>
        <SortsContext.Provider value={{ sorts, setSorts }}>
          <FiltersContext.Provider value={{ filters, setFilters }}>
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
          </FiltersContext.Provider>
        </SortsContext.Provider>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
}
