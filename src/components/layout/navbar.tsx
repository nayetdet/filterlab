import { BookOpen, House } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Brand from '@/components/common/brand';

export const Navbar = () => {
  const links = [
    { label: 'Início', to: '/', icon: House },
    { label: 'Curso', to: '/course', icon: BookOpen },
  ];

  return (
    <header className="bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-16 max-w-[1240px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-2 sm:px-8">
        <Brand />
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-1 rounded-full bg-white/5 p-1"
        >
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex h-10 items-center justify-center gap-2 rounded-full px-2.5 text-sm font-medium transition-colors sm:px-4 ${isActive ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
