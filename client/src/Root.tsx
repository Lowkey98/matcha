import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';

export default function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
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
