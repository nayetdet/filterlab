import Brand from '@/components/common/brand';
import type { SiteSection } from '@/types/navigation';

type FooterProps = { onSectionChange: (section: SiteSection) => void };
const copyrightYear = new Date().getFullYear();

export const Footer = ({ onSectionChange }: FooterProps) => (
  <footer className="bg-zinc-900 text-zinc-50">
    <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-2">
        <Brand onClick={() => onSectionChange('audio')} />
        <p className="max-w-sm text-sm/6 text-zinc-400">
          Simulador interativo de filtros digitais e convolução.
        </p>
      </div>
      <hr className="my-3 h-px border-0 bg-zinc-800" />
      <p className="text-left text-xs text-zinc-500">
        © {copyrightYear} FilterLab. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
