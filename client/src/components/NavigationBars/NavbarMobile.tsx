import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../Navigation';
import { SocketContext } from '../../context/SocketContext';
import { NotificationResponse } from '../../../../shared/types';

export default function NavbarMobile({
  navigationItems,
  className,
}: {
  navigationItems: NavigationItem[];
  className?: string;
}) {
  const { socket } = useContext(SocketContext);
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [showHighlightnotification, setShowHighlightnotification] =
    useState<boolean>(false);
  function handleClickNotifications() {
    setShowHighlightnotification(false);
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
    <div
      className={`border-grayDark-100 fixed bottom-0 left-0 z-10 flex w-full items-center justify-between gap-2 border-t bg-white px-5 py-4 ${className}`}
    >
      {navigationItems.map((navigationItem: NavigationItem) => {
        const customActive =
          navigationItem.route === '/explore' &&
          (location.pathname === '/' || location.pathname === '/explore');
        return (
          <NavLink
            to={navigationItem.route}
            key={navigationItem.name}
            className={({ isActive }) =>
              `relative ${isActive || customActive ? 'fill-primary' : 'fill-grayDark'}`
            }
            {...(navigationItem.name === 'Notifications' && {
              onClick: handleClickNotifications,
              state: { notifications },
            })}
          >
            {navigationItem.name === 'Notifications' &&
            showHighlightnotification ? (
              <div className="absolute right-0 size-3 rounded-full bg-red-500" />
            ) : null}
            {React.cloneElement(navigationItem.icon, {
              className: 'size-8',
            })}
          </NavLink>
        );
      })}
    </div>
  );
}
