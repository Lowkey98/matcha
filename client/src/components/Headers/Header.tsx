import { HeaderDesktop } from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

export default function Header() {
  return (
    <>
      <HeaderMobile className="lg:hidden" />
      <HeaderDesktop className="hidden lg:flex" />
    </>
  );
}
