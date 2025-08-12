import SidebarDesktop from './NavigationBars/SidebarDesktop';
import NavbarMobile from './NavigationBars/NavbarMobile';
import {
  ExplorerIcon,
  HearthIcon,
  LikeIcon,
  MessagesIcon,
  NotificationsIcon,
  UserIcon,
  ViewersIcon,
} from './Icons';
import { useLocation } from 'react-router-dom';
import SidebarChat from './NavigationBars/SideBarChat';

export type NavigationItem = {
  route: string;
  name: string;
  icon: React.JSX.Element;
};

export default function Navigation() {
  const location = useLocation();
  const navigationItems: NavigationItem[] = [
    {
      route: '/explore',
      name: 'Explore',
      icon: <ExplorerIcon />,
    },
    {
      route: '/messages',
      name: 'Messages',
      icon: <MessagesIcon />,
    },
    {
      route: '/matches',
      name: 'Matches',
      icon: <HearthIcon />,
    },
    {
      route: '/likes',
      name: 'Likes',
      icon: <LikeIcon />,
    },
    {
      route: '/viewers',
      name: 'Viewers',
      icon: <ViewersIcon />,
    },
    {
      route: '/profile',
      name: 'Profile',
      icon: <UserIcon />,
    },
  ];
  return (
    <>
      {location.pathname === '/messages' ||
      location.pathname.startsWith('/messages/') ? (
        <SidebarChat
          className="hidden lg:flex"
          navigationItems={navigationItems}
        />
      ) : (
        <SidebarDesktop
          className="hidden lg:flex"
          navigationItems={navigationItems}
        />
      )}
      <NavbarMobile
        className="lg:hidden"
        navigationItems={[
          ...navigationItems,
          {
            route: '/notifications',
            name: 'Notifications',
            icon: <NotificationsIcon />,
          },
        ]}
      />
    </>
  );
}
