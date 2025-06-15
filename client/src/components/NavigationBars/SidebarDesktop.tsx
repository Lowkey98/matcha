import type { NavigationItem } from '../Navigation';

export default function SidebarDesktop({
  navigationItems,
  className,
}: {
  navigationItems: NavigationItem[];
  className?: string;
}) {
  return (
    <div
      className={`border-grayDark-100 fixed top-0 flex h-screen flex-col border-r pt-5 pr-5 ${className}`}
    >
      <img src="/logo.svg" alt="logo" className="w-42" />
      <div className="flex grow items-center"></div>
    </div>
  );
}
