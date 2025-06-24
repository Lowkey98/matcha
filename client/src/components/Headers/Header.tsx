import { EditIcon, LogoutIcon, SettingsIcon } from '../Icons';
import { HeaderDesktop } from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

export type HeaderNavigationItem = {
  route: string;
  name: string;
  icon: React.JSX.Element;
};
export default function Header() {
  const headerNavigationItems: HeaderNavigationItem[] = [
    {
      route: '/settings',
      name: 'Settings',
      icon: <SettingsIcon />,
    },
    // TODO handle display of edit profile depends on the authentication
    {
      route: '/editProfile',
      name: 'Edit profile',
      icon: <EditIcon />,
    },
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
