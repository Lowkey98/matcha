import Root from './Root';
import Notfound from './routes/Notfound';
import ErrorBoundary from './ErrorBoundary';
import Register from './routes/Register';
import Login from './routes/Login';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword from './routes/ResetPassword';
import CreateProfile from './routes/CreateProfile';
import AddPictures from './routes/AddPictures';
import Explore from './routes/Explore';
import Messages from './routes/Messages';
import Matches from './routes/Matches';
import Likes from './routes/Likes';
import Viewers from './routes/Viewers';
import Profile from './routes/Profile';
import Notifications from './routes/Notifications';
import Settings from './routes/Settings';
import EditProfile from './routes/EditProfile';
const routeConfig = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '*',
        element: <Notfound />,
      },
      {
        path: '/',
        element: <Explore />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgotPassword',
        element: <ForgotPassword />,
      },
      {
        path: '/resetPassword',
        element: <ResetPassword />,
      },
      {
        path: '/createProfile',
        element: <CreateProfile />,
      },
      {
        path: '/createProfile/addPictures',
        element: <AddPictures />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/matches',
        element: <Matches />,
      },
      {
        path: '/likes',
        element: <Likes />,
      },
      {
        path: '/viewers',
        element: <Viewers />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/notifications',
        element: <Notifications />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/editProfile',
        element: <EditProfile />,
      },
    ],
  },
];

export default routeConfig;
