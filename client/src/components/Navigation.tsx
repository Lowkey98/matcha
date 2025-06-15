import SidebarDesktop from './NavigationBars/SidebarDesktop';
import NavbarMobile from './NavigationBars/NavbarMobile';
import {
  ExplorerIcon,
  HearthIcon,
  LikeIcon,
  MessagesIcon,
  NotificationIcon,
  UserIcon,
  ViewersIcon,
} from './Icons';

export type NavigationItem = {
  route: string;
  name: string;
  icon: React.JSX.Element;
};

export default function Navigation() {
  const navigationItems: NavigationItem[] = [
    {
      route: '/explorer',
      name: 'Explorer',
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
      <SidebarDesktop
        className="hidden lg:flex"
        navigationItems={navigationItems}
      />
      <NavbarMobile
        className="lg:hidden"
        navigationItems={[
          ...navigationItems,
          {
            route: '/notifications',
            name: 'Notifications',
            icon: <NotificationIcon />,
          },
        ]}
      />
    </>
  );
}
