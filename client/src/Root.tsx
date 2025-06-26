import { Outlet } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';
import { createContext, useEffect } from 'react';
import { useState } from 'react';
import type { UserInfo } from '../../shared-types/index.d.ts';
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((data) => {
          console.log('User data fetched:', data);
          setUser(data);
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
    <UserContext.Provider value={{ user, setUser, loading }}>
      {user && (
        <>
          <Header />
          <Navigation />
        </>
      )}
      {/* TODO handle display of sidebar depends on the authentication */}
      <Outlet />
    </UserContext.Provider>
  );
}
// import { Outlet, Navigate, useLocation } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext'; // Replace with your actual hook/context

// export default function Root() {
//   // const { user, profile } = useAuth(); // user = null if not authenticated
//   const location = useLocation();

//   // 1. Not authenticated → redirect to /register
//   if (!user && location.pathname !== '/register') {
//     return <Navigate to="/register" replace />;
//   }

//   // 2. Authenticated but no profile → redirect to /createProfile
//   if (user && !profile && location.pathname !== '/createProfile') {
//     return <Navigate to="/createProfile" replace />;
//   }

//   // 3. Authenticated with profile → redirect to /home from /
//   if (user && profile && location.pathname === '/') {
//     return <Navigate to="/home" replace />;
//   }

//   // 4. All good → render nested route
//   return <Outlet />;
// }
