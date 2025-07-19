import { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Login from './Login';
import CreateProfile from './CreateProfile';
import { UserContext } from '../context/UserContext';
import { addUserLocation, getAddress } from '../../Api';
import { UserLocation } from '../../../shared/types';
import { useToast } from '../hooks/useToast';

export default function Explore() {
  const { user, setUser, loading } = useContext(UserContext);
  const { addToast } = useToast();
  useEffect(() => {
    if (user) {
      if (!user.location) {
        console.log('get');

        navigator.geolocation.getCurrentPosition(
          async (position: GeolocationPosition) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getAddress({ latitude, longitude })
              .then((address: string) => {
                const userLocation: UserLocation = {
                  address,
                  latitude,
                  longitude,
                };
                const token = localStorage.getItem('token');
                if (token) {
                  addUserLocation({
                    userLocation: userLocation,
                    token,
                  })
                    .then(() => {
                      setUser({
                        ...user,
                        location: JSON.stringify(userLocation),
                      });
                    })
                    .catch(() => {
                      addToast({
                        status: 'error',
                        message: 'Error adding location',
                      });
                    });
                }
              })
              .catch((error) => {
                addToast({
                  status: 'error',
                  message: error,
                });
              });
          },
        );
      }
    }
  }, [user]);
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
