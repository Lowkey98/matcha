import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import type { UserInfo } from '../../shared/types';
import { ToastProvider } from './components/ToastProvider';
import { getUserInfo } from '../Api';
import { UserContext } from './context/UserContext';
import { io, Socket } from 'socket.io-client';

import { BACKEND_STATIC_FOLDER } from './components/ImagesCarousel';
import { SocketContext } from './context/SocketContext';
export default function Root() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserInfo({ token })
        .then((userInfo: UserInfo) => {
          setUser(userInfo);
          if (userInfo.age) {
            const socketClient = io(BACKEND_STATIC_FOLDER);
            setSocket(socketClient);
            socketClient.emit('register', userInfo.id);
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
      <ToastProvider>
        <SocketContext.Provider value={{ socket, setSocket }}>
          {user && (
            <>
              <Header />
              {user.age ? <Navigation /> : null}
            </>
          )}
          {/* TODO handle display of sidebar depends on the authentication */}
        </SocketContext.Provider>
        <Outlet />
      </ToastProvider>
    </UserContext.Provider>
  );
}
