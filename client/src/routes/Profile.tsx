import { Helmet } from 'react-helmet';
import Carousel from '../components/Carousel';

export default function Profile() {
  return (
    <>
      <Helmet>
        <title>Matcha - Profile</title>
      </Helmet>
      <main className="mt-12 mb-22 lg:mb-5 lg:ml-57">
        <Carousel />
      </main>
    </>
  );
}
