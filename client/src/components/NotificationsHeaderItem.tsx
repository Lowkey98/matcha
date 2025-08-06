import { useContext, useEffect, useState } from 'react';
import { NotificationsIcon } from './Icons';
import { SocketContext } from '../context/SocketContext';
import { NotificationResponse } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { BACKEND_STATIC_FOLDER } from './ImagesCarousel';

export default function NotificationsHeaderItem() {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [showHighlightnotification, setShowHighlightnotification] =
    useState<boolean>(false);

  const [showItems, setShowItems] = useState<boolean>(false);
  function handleClickNotificationsHeaderItem() {
    setShowHighlightnotification(false);
    setShowItems(!showItems);
  }
  useEffect(() => {
    if (socket) {
      socket.on(
        'receiveNotification',
        (actorNotification: NotificationResponse) => {
          setNotifications((prev) => [actorNotification, ...prev]);
          setShowHighlightnotification(true);
        },
      );
    }
  }, [socket]);

  return (
    <div className="relative">
      {showHighlightnotification ? (
        <div className="absolute right-0 size-3 rounded-full bg-red-500" />
      ) : null}
      <button
        type="button"
        className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
        onClick={handleClickNotificationsHeaderItem}
      >
        <NotificationsIcon className="fill-secondary h-6 w-6" />
      </button>
      {showItems ? (
        <div className="border-grayDark-100 z-12 text-secondary absolute top-15 right-0 flex w-72 flex-col rounded-lg border-2 bg-white text-sm">
          {notifications.length ? (
            notifications.map((notifcation, index) => (
              <NotficationCard
                notification={notifcation}
                key={index}
                setShowItems={setShowItems}
              />
            ))
          ) : (
            <span className="p-3 text-center">No notification exists.</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function NotficationCard({
  notification,
  setShowItems,
}: {
  notification: NotificationResponse;
  setShowItems?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  function handleClickUsername() {
    if (setShowItems) setShowItems(false);
    navigate(`/profileUser/${notification.actorUserId}`);
  }
  return (
    <div className="text-secondary border-grayDark-100 flex items-center gap-2 border-t p-3 first:border-t-0">
      <img
        src={`${BACKEND_STATIC_FOLDER}${notification.actorUserImageUrl}`}
        alt="user"
        className="size-10 rounded-full object-cover"
      />
      <div>
        <button
          type="button"
          className="text-primary cursor-pointer font-bold underline"
          onClick={handleClickUsername}
        >
          {notification.actorUsername}
        </button>
        <span className="ml-1">{notification.message}</span>
      </div>
    </div>
  );
}
