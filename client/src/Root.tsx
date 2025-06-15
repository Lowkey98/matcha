import { Outlet } from 'react-router-dom';
import Header from './components/Headers/Header';
import Navigation from './components/Navigation';

export default function Root() {
  return (
    <>
      {/* TODO handle display of header depends on the authentication and if user login */}
      <Header />
      {/* TODO handle display of sidebar depends on the authentication */}
      <Navigation />
      <Outlet />
    </>
  );
}
