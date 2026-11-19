import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useCourseStore } from '@/stores/course-store';
import { useNavigate } from 'react-router-dom';
import { courseModules } from '@/data/course-content';
import {
  learningSteps,
  outcomes,
  previewCharts,
  signalData,
} from '@/data/home-content';

const modules = courseModules.map(
  (module) => [module.title.replace(/^\d+\.\s*/, ''), module.summary] as const,
);

export const HomePage = () => {
  const completedLessons = useCourseStore((state) => state.completedLessons);
  const navigate = useNavigate();
  const hasProgress = completedLessons.length > 0;

  return (
    <main>
      <section className="w-full bg-white">
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
              onClick={() => navigate('/course')}
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
              {hasProgress && <p>{completedLessons.length} concluídas</p>}
            </div>
          </div>
          <figure
            aria-label="Gráfico de uma onda senoidal ao longo do tempo"
            className="min-w-0"
          >
            <div className="mb-4 flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span>Amplitude</span>
              <span>Forma de onda</span>
              <span>Tempo</span>
            </div>
            <div className="h-[260px] w-full sm:h-[340px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={signalData}
                  margin={{ top: 8, right: 4, bottom: 8, left: 4 }}
                >
                  <XAxis dataKey="x" type="number" domain={[0, 10]} hide />
                  <YAxis domain={[-1.2, 1.2]} hide />
                  <ReferenceLine y={0} stroke="#d4d4d8" strokeWidth={1} />
                  <Tooltip cursor={false} />
                  <Area
                    dataKey="y"
                    type="monotone"
                    stroke="#27272a"
                    strokeWidth={3}
                    fill="#27272a"
                    fillOpacity={0.035}
                    dot={false}
                    isAnimationActive
                    animationDuration={1800}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <figcaption className="mt-2 text-right text-xs text-muted-foreground">
              Um sinal contínuo variando com o tempo
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <section className="mt-8 grid gap-8 rounded-2xl bg-zinc-950 p-6 text-zinc-50 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 shrink-0 text-zinc-300" />
              <h2 className="text-2xl font-semibold tracking-tight">
                O que você vai aprender a fazer
              </h2>
            </div>
            <p className="mt-3 text-sm/6 text-zinc-400">
              Conectar os cálculos ao resultado que você ouve e observa.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 text-sm/6 text-zinc-200">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-zinc-400" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <div className="mb-7 max-w-2xl">
            <p className="text-sm font-semibold text-muted-foreground">
              GRÁFICOS INTERATIVOS
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Veja os conceitos ganharem forma.
            </h2>
            <p className="mt-3 text-base/7 text-muted-foreground">
              Tempo, frequência e filtragem se conectam ao longo das aulas.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {previewCharts.map((chart) => {
              const Icon = chart.icon;

              return (
                <article
                  key={chart.title}
                  className="rounded-2xl bg-muted/40 p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{chart.title}</h3>
                      <p className="mt-1 text-sm/6 text-muted-foreground">
                        {chart.description}
                      </p>
                    </div>
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-background"
                      style={{ color: chart.color }}
                      aria-hidden="true"
                    >
                      <Icon className="size-[18px]" />
                    </span>
                  </div>
                  <div className="mt-4 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chart.data}
                        margin={{ top: 8, right: 4, bottom: 4, left: 4 }}
                      >
                        <XAxis
                          dataKey="x"
                          type="number"
                          domain={['dataMin', 'dataMax']}
                          hide
                        />
                        <YAxis hide />
                        <Line
                          dataKey="y"
                          type="monotone"
                          stroke={chart.color}
                          strokeWidth={2.5}
                          dot={false}
                          isAnimationActive
                          animationDuration={1200}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-muted-foreground">
              APRENDIZADO GUIADO
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Conceito, fórmula e experimento na mesma aula.
            </h2>
            <p className="mt-4 text-base/7 text-muted-foreground">
              Cada etapa conecta a explicação ao que você vê. Teste uma ideia e
              acompanhe suas consequências.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {learningSteps.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="rounded-2xl bg-muted/50 p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-muted-foreground tabular-nums">
                    ETAPA {index + 1}
                  </p>
                  <Icon
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm/6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 pb-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                O percurso
              </h2>
              <p className="mt-2 text-muted-foreground">
                Do primeiro sinal aos filtros digitais.
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-muted/50">
              <BookOpen className="size-5 text-muted-foreground" />
            </div>
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
      </div>
    </main>
  );
};

export default HomePage;
