import { AudioLines, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Brand from '@/components/common/brand';
import type { SiteSection } from '@/types/navigation';

type NavbarProps = {
  section: SiteSection;
  onSectionChange: (section: SiteSection) => void;
};

export const Navbar = ({ section, onSectionChange }: NavbarProps) => (
  <header className="bg-zinc-950 text-zinc-50">
    <div className="mx-auto flex min-h-[76px] max-w-[1320px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
      <Brand onClick={() => onSectionChange('audio')} />
      <nav
        aria-label="Navegação principal"
        className="ml-auto grid w-full grid-cols-2 gap-1 rounded-2xl bg-zinc-900 p-1.5 sm:w-[400px]"
      >
        <Button
          variant="ghost"
          size="default"
          onClick={() => onSectionChange('audio')}
          aria-current={section === 'audio' ? 'page' : undefined}
          className={`h-11 w-full gap-2 rounded-xl px-2 text-sm font-medium ${section === 'audio' ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}`}
        >
          <AudioLines className="size-4" />
          Filtros de áudio
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={() => onSectionChange('convolution')}
          aria-current={section === 'convolution' ? 'page' : undefined}
          className={`h-11 w-full gap-2 rounded-xl px-2 text-sm font-medium ${section === 'convolution' ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}`}
        >
          <Sigma className="size-4" />
          Convolução
        </Button>
      </nav>
    </div>
  </header>
);

export default Navbar;
