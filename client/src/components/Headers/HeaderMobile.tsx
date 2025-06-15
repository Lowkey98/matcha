import BurgerMenu from '../BurgerMenu';

export default function HeaderMobile({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between pt-5 ${className}`}>
      <img src="/logo.svg" alt="logo" className="w-42" />
      <BurgerMenu />
    </div>
  );
}
