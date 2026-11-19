import Brand from '@/components/common/brand';
import { useLearningStore } from '@/stores/learning-store';

const copyrightYear = new Date().getFullYear();

export const Footer = () => {
  const openHome = useLearningStore((state) => state.openHome);

  return (
    <footer className="bg-zinc-900 text-zinc-50">
      <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Brand onClick={openHome} />
            <p className="mt-3 text-sm text-zinc-400">
              Simulador interativo de filtros digitais e convolução.
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            © {copyrightYear} FilterLab. Todos os direitos reservados.
          </p>
        </div>
        <hr className="mt-6 h-px border-0 bg-zinc-800" />
        <p className="pt-4 text-xs text-zinc-500">
          Aprenda processamento de sinais explorando cada conceito.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
