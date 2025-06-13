import Root from './Root';
import Notfound from './routes/Notfound';
import ErrorBoundary from './ErrorBoundary';
import Register from './routes/Register';
import Login from './routes/Login';
import ForgetPassword from './routes/ForgetPassword';
import ResetPassword from './routes/ResetPassword';
import CreateProfile from './routes/CreateProfile';
import AddPictures from './routes/AddPictures';
import { Explorer } from './routes/Explorer';
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
        path: '',
        element: <Register />,
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
        path: '/forgetPassword',
        element: <ForgetPassword />,
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
        path: '/explorer',
        element: <Explorer />,
      },
    ],
  },
];

export default routeConfig;
