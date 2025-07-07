import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { UserContext } from '../Root';
import Login from './Login';
import Profile from './Profile';
import CreateProfile from './CreateProfile';
import ProfileSlider from '../components/ProfilesSlider';

export default function Explore() {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return null;
  }

  if (!user) {
    return <Login />;
  } else if (false) {
    return <CreateProfile />;
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Explore</title>
      </Helmet>
      <main className="mb-21 flex h-1/2 flex-1 pt-5 lg:mb-5 lg:ml-57 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
        <ProfileSlider className="lg:w-sm xl:w-[30vw]" />
      </main>
    </>
  );
}
