import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import Login from './Login';
import CreateProfile from './CreateProfile';
import { UserContext } from '../context/UserContext';

export default function Explore() {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return null;
  }

  if (!user) {
    return <Login />;
  } else if (!user.age) {
    return <CreateProfile />;
  } else {
    console.log('user', user);
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Explore</title>
      </Helmet>
    </>
  );
}
