import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaveformChart from '@/components/charts/home/waveform';
import { courseLessons, courseModules } from '@/data/course';

type HeroProps = { completedCount: number; onContinue: () => void };

export const Hero = ({ completedCount, onContinue }: HeroProps) => {
  const hasProgress = completedCount > 0;

  return (
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
            fórmulas guiadas e experimentos que mostram o efeito de cada
            escolha.
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
              <span className="font-semibold text-foreground">
                {courseModules.length}
              </span>{' '}
              módulos
            </p>
            <p>
              <span className="font-semibold text-foreground">
                {courseLessons.length}
              </span>{' '}
              aulas guiadas
            </p>
            {hasProgress && <p>{completedCount} concluídas</p>}
          </div>
        </div>
        <WaveformChart />
      </div>
    </section>
  );
};

export default Hero;
