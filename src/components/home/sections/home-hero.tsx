import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HomeWaveChart from '@/components/home/charts/home-wave-chart';

type HomeHeroProps = {
  hasProgress: boolean;
  completedCount: number;
  onContinue: () => void;
};

export const HomeHero = ({
  hasProgress,
  completedCount,
  onContinue,
}: HomeHeroProps) => (
  <section className="w-full bg-neutral-100">
    <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1240px] items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          FilterLab, curso interativo
        </p>
        <h1 className="mt-6 text-5xl leading-[1.04] font-semibold tracking-tighter sm:text-7xl">
          Entenda os sinais. Explore os filtros.
        </h1>
        <p className="mt-6 max-w-xl text-lg/8 text-muted-foreground">
          Aprenda processamento digital de sinais com explicações visuais,
          fórmulas guiadas e experimentos que mostram o efeito de cada escolha.
        </p>
        <Button
          size="lg"
          className="mt-8 h-12 rounded-full px-6 text-base"
          onClick={onContinue}
        >
          {hasProgress ? 'Continuar aprendendo' : 'Começar o curso'}
          <ArrowRight />
        </Button>
        <div className="mt-8 flex gap-7 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">6</span> módulos
          </p>
          <p>
            <span className="font-semibold text-foreground">14</span> aulas
            guiadas
          </p>
          {hasProgress && <p>{completedCount} concluídas</p>}
        </div>
      </div>
      <HomeWaveChart />
    </div>
  </section>
);

export default HomeHero;
