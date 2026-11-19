import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaveformChart from '@/components/charts/home/waveform';
import { courseLessons, courseModules } from '@/data/course';

type HeroProps = { completedCount: number; onContinue: () => void };

export const Hero = ({ completedCount, onContinue }: HeroProps) => {
  const hasProgress = completedCount > 0;

  return (
    <section className="w-full bg-neutral-100">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1240px] items-center gap-5 px-5 py-10 sm:gap-8 sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground">
            FilterLab
          </p>
          <h1 className="mt-4 max-w-xl text-3xl leading-[1.05] font-semibold tracking-tighter sm:mt-5 sm:text-5xl lg:text-5xl xl:text-6xl">
            Entenda os sinais.
            <span className="block">Explore os filtros.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base/7 text-muted-foreground sm:mt-6 sm:text-lg/8">
            Explore filtros e convolução com explicações visuais e gráficos que
            respondem às suas escolhas.
          </p>
          <Button
            size="lg"
            className="mt-7 h-12 w-full rounded-full px-6 text-base sm:mt-8 sm:w-auto"
            onClick={onContinue}
          >
            {hasProgress ? 'Continuar aprendendo' : 'Começar o curso'}
            <ArrowRight />
          </Button>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 sm:mt-10">
            <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
              <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
                {courseModules.length}
              </span>
              módulos
            </p>
            <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
              <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
                {courseLessons.length}
              </span>
              aulas guiadas
            </p>
            {hasProgress && (
              <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
                <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
                  {completedCount}
                </span>
                concluídas
              </p>
            )}
          </div>
        </div>
        <WaveformChart />
      </div>
    </section>
  );
};

export default Hero;
