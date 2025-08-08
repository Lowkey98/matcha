import { Link } from 'react-router-dom';
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
      <Link to={'/'}>
        <img src="/logo.svg" alt="logo" className="w-42" />
      </Link>
      <BurgerMenu headerNavigationItems={headerNavigationItems} />
    </div>
  );
}
