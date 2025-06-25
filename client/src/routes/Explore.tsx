import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { UserContext } from '../Root';
import Login from './Login';
import Profile from './Profile';
import CreateProfile from './CreateProfile';

export default function Explore() {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return null;
  }

  if (!user) {
    return <Login />;
  } else if (!user.age) {
    return <CreateProfile />;
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Explore</title>
      </Helmet>
    </>
  );
}
