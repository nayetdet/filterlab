import Brand from '@/components/common/brand';

const copyrightYear = new Date().getFullYear();

export const Footer = () => (
  <footer className="bg-zinc-900 text-zinc-50">
    <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8">
      <Brand />
      <p className="mt-3 text-sm text-zinc-400">
        Simulador interativo de filtros digitais e convolução.
      </p>
      <hr className="mt-6 h-px border-0 bg-zinc-800" />
      <div className="flex flex-col gap-2 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Aprenda processamento de sinais explorando cada conceito.</p>
        <p>© {copyrightYear} FilterLab. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
