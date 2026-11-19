import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useLearningStore } from '@/stores/learning-store';

const modules = [
  ['Sinais e sistemas', 'Sinais digitais, amostragem e aliasing'],
  ['Frequência e espectro', 'Tons, período e análise com FFT'],
  ['Filtros digitais', 'Passa-baixa, passa-alta e resposta'],
  ['FIR por dentro', 'Impulso, janelas e coeficientes'],
  ['Convolução', 'Soma discreta e área contínua'],
  ['Além do FIR', 'IIR, fase e atraso'],
];

const signalData = Array.from({ length: 201 }, (_, index) => {
  const x = index / 20;
  return { x, y: Math.sin((x * Math.PI) / 2) };
});

export const HomePage = () => {
  const { completedLessons, continueCourse } = useLearningStore();
  const hasProgress = completedLessons.length > 0;

  return (
    <main className="mx-auto w-full max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-muted-foreground">
            FILTERLAB
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Entenda os sinais. Explore os filtros.
          </h1>
          <p className="mt-6 max-w-2xl text-lg/8 text-muted-foreground">
            Aprenda processamento digital de sinais com explicações visuais,
            fórmulas guiadas e experimentos que mostram o efeito de cada
            escolha.
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 px-6 text-base"
            onClick={continueCourse}
          >
            {hasProgress ? 'Continuar aprendendo' : 'Começar o curso'}{' '}
            <ArrowRight />
          </Button>
          {hasProgress && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4" /> {completedLessons.length}{' '}
              aulas concluídas
            </p>
          )}
        </div>
        <figure
          aria-label="Gráfico animado de uma onda senoidal"
          className="h-[280px] w-full sm:h-[340px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={signalData}
              margin={{ top: 16, right: 16, bottom: 8, left: 4 }}
            >
              <CartesianGrid
                stroke="#e4e4e7"
                strokeDasharray="3 5"
                vertical={false}
              />
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tickLine={false}
                axisLine={{ stroke: '#a1a1aa' }}
                tick={{ fill: '#71717a', fontSize: 12 }}
              />
              <YAxis
                domain={[-1.2, 1.2]}
                ticks={[-1, 0, 1]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                width={28}
              />
              <ReferenceLine y={0} stroke="#a1a1aa" />
              <Tooltip cursor={{ stroke: '#a1a1aa', strokeDasharray: '3 3' }} />
              <Line
                dataKey="y"
                type="monotone"
                stroke="#27272a"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive
                animationDuration={1600}
                animationEasing="ease-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </figure>
      </section>
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              O percurso
            </h2>
            <p className="mt-2 text-muted-foreground">
              Do primeiro sinal aos filtros digitais.
            </p>
          </div>
          <BookOpen className="mb-1 size-5 text-muted-foreground" />
        </div>
        <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(([title, description], index) => (
            <div
              key={title}
              className="flex gap-4 border-t border-border/70 py-5"
            >
              <span className="text-sm text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm/6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
