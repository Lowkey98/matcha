import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { createContext, useEffect } from 'react';
import { useState } from 'react';
import type { UserInfo } from '../../shared/types';
import { ToastProvider } from './components/ToastProvider';
type UserContextType = {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  loading: boolean;
};
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export default function Root() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:3000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          console.error('Unauthorized access, resetting user state');
          setUser(null); // Reset user if unauthorized
          setLoading(false);
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login page
          return;
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } else {
        setUser(null); // Reset user if no token is found
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      <ToastProvider>
        {user && (
          <>
            <Header />
            <Navigation />
          </>
        )}
        {/* TODO handle display of sidebar depends on the authentication */}
        <Outlet />
      </ToastProvider>
    </UserContext.Provider>
  );
}
