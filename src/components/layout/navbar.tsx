import Brand from '@/components/common/brand';

export const Navbar = () => (
  <header className="bg-zinc-950 text-zinc-50">
    <div className="mx-auto flex min-h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
      <Brand />
    </div>
  </header>
);

export default Navbar;
