import BurgerMenu from '../BurgerMenu';
import { HeaderNavigationItem } from './Header';

export default function HeaderMobile({
  headerNavigationItems,
  className,
}: {
  headerNavigationItems: HeaderNavigationItem[];
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between pt-5 ${className}`}>
      <img src="/logo.svg" alt="logo" className="w-42" />
      <BurgerMenu headerNavigationItems={headerNavigationItems} />
    </div>
  );
}
