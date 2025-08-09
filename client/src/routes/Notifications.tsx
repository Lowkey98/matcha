import { Helmet } from 'react-helmet';
import { NotficationCard } from '../components/NotificationsHeaderItem';
import { useLocation } from 'react-router-dom';
import { NotificationResponse } from '../../../shared/types';

export default function Notifications() {
  const location = useLocation();
  const notifications = location.state.notifications as NotificationResponse[];
  return (
    <>
      <Helmet>
        <title>Matcha - Notifications</title>
      </Helmet>
      <main className="text-secondary mt-12 mb-22 flex flex-col lg:hidden">
        {notifications.length ? (
          notifications.map((notifcation, index) => (
            <NotficationCard key={index} notification={notifcation} />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
            No notification exists.
          </div>
        )}
      </main>
    </>
  );
}
