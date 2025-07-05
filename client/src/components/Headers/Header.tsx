import { useContext } from 'react';
import { EditIcon, LogoutIcon, SettingsIcon } from '../Icons';
import { HeaderDesktop } from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';
import { UserContext } from '../../Root';

export type HeaderNavigationItem = {
  route: string;
  name: string;
  icon: React.JSX.Element;
};
export default function Header() {
  const { user } = useContext(UserContext);
  const headerNavigationItems: HeaderNavigationItem[] = [
    {
      route: '/settings',
      name: 'Settings',
      icon: <SettingsIcon />,
    },
    ...(user?.age
      ? [
          {
            route: '/editProfile',
            name: 'Edit profile',
            icon: <EditIcon />,
          },
        ]
      : []),
    {
      route: '/',
      name: 'Logout',
      icon: <LogoutIcon />,
    },
  ];
  return (
    <>
      <HeaderMobile
        className="lg:hidden"
        headerNavigationItems={headerNavigationItems}
      />
      <HeaderDesktop
        className="hidden lg:flex"
        headerNavigationItems={headerNavigationItems}
      />
    </>
  );
}
