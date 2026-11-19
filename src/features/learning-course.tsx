import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Check, Lock, RotateCcw } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLearningStore, type LessonId } from '@/stores/learning-store';

type Lesson = {
  id: LessonId;
  title: string;
  concept: string;
  intuition: string;
  consequence: string;
  formula: string;
  prompt: string;
  control: string;
  kind: string;
};
type Module = { title: string; summary: string; lessons: Lesson[] };
type ProgressSegment = { key: string; fill: number; current: boolean };
const modules: Module[] = [
  {
    title: '01. Sinais e sistemas',
    summary: 'Descreva sons e sinais ao longo do tempo.',
    lessons: [
      {
        id: 'signals',
        title: 'Sinais contínuos e discretos',
        concept:
          'Um sinal representa uma quantidade que varia. Um microfone converte pressão sonora em tensão e o conversor mede essa tensão em instantes regulares.',
        intuition:
          'O sinal contínuo é uma curva. O sinal digital é uma sequência de medidas dessa curva, cada uma associada a um índice inteiro.',
        consequence:
          'A taxa de amostragem define quantos detalhes temporais conseguimos representar. Poucas amostras podem esconder mudanças rápidas.',
        formula: 'x[n]=A\\sin\\left(2\\pi\\frac{fn}{f_s}+\\varphi\\right)',
        prompt: 'Altere a frequência e compare o espaçamento das oscilações.',
        control: 'Frequência do tom',
        kind: 'signal',
      },
      {
        id: 'sampling',
        title: 'Amostragem',
        concept:
          'A amostragem transforma uma curva contínua em valores separados no tempo. A taxa fₛ indica quantas medidas são feitas por segundo.',
        intuition:
          'Imagine tirar fotografias de uma onda. Fotografias frequentes registram o movimento; poucas podem dar a impressão de outro movimento.',
        consequence:
          'Para representar uma frequência, a taxa de amostragem precisa ser maior que o dobro dela. Caso contrário, ocorre aliasing.',
        formula: 'x[n]=x_c\\left(\\frac{n}{f_s}\\right)',
        prompt:
          'Mude a taxa de amostragem e veja os pontos medidos sobre a onda contínua.',
        control: 'Taxa de amostragem',
        kind: 'sampling',
      },
      {
        id: 'aliasing',
        title: 'Aliasing',
        concept:
          'Aliasing acontece quando uma onda é amostrada devagar demais e aparece como uma frequência diferente da original.',
        intuition:
          'É o efeito visual de uma roda que parece girar para trás no vídeo. As amostras não conseguem distinguir o movimento real.',
        consequence:
          'Sons acima de metade da taxa de amostragem podem virar componentes graves falsas. Um filtro anti-aliasing reduz esse risco antes da conversão.',
        formula: 'f_{\\text{Nyquist}}=\\frac{f_s}{2}',
        prompt:
          'Cruze o limite de Nyquist e compare frequência original e percebida.',
        control: 'Frequência do sinal',
        kind: 'aliasing',
      },
    ],
  },
  {
    title: '02. Frequência e espectro',
    summary: 'Entenda os tons que formam um som.',
    lessons: [
      {
        id: 'frequency',
        title: 'Frequência e período',
        concept:
          'Frequência mede quantas repetições acontecem por segundo. O período é o tempo de uma repetição completa.',
        intuition:
          'Uma frequência maior significa ciclos mais rápidos e, no som, um tom mais agudo.',
        consequence:
          'Frequência e período são inversos: dobrar a frequência reduz o período à metade.',
        formula: 'T=\\frac{1}{f}',
        prompt:
          'Ajuste a frequência e observe o período mudar na forma de onda.',
        control: 'Frequência',
        kind: 'signal',
      },
      {
        id: 'spectrum',
        title: 'Espectro e FFT',
        concept:
          'O espectro mostra quanta energia existe em cada frequência. A FFT é um algoritmo eficiente para calcular essa representação a partir das amostras.',
        intuition:
          'A forma de onda é uma mistura vista no tempo. O espectro separa essa mistura em seus tons componentes.',
        consequence:
          'Picos no espectro revelam tons e interferências. A resolução depende da duração do trecho analisado.',
        formula: 'X[k]=\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N}',
        prompt: 'Combine dois tons e acompanhe os picos no espectro.',
        control: 'Intensidade do segundo tom',
        kind: 'spectrum',
      },
    ],
  },
  {
    title: '03. Filtros digitais',
    summary: 'Separe frequências que deseja ouvir das que deseja reduzir.',
    lessons: [
      {
        id: 'lowpass',
        title: 'Filtro passa-baixa',
        concept:
          'O passa-baixa preserva frequências menores que o corte e reduz frequências maiores.',
        intuition:
          'Ele age como uma porta que deixa os tons graves passarem e atenua os agudos.',
        consequence:
          'Um corte baixo remove mais ruído agudo, mas também pode retirar brilho e detalhe do som desejado.',
        formula:
          'H(f)\\approx\\begin{cases}1,&|f|<f_c\\\\0,&|f|>f_c\\end{cases}',
        prompt: 'Mova o corte e compare o tom desejado e a interferência.',
        control: 'Frequência de corte',
        kind: 'lowpass',
      },
      {
        id: 'highpass',
        title: 'Filtro passa-alta',
        concept:
          'O passa-alta reduz frequências abaixo do corte e preserva as frequências acima dele.',
        intuition:
          'É como remover uma vibração lenta de fundo sem apagar os detalhes mais rápidos do sinal.',
        consequence:
          'Um corte alto remove zumbido grave, mas pode enfraquecer sons fundamentais e deixar o áudio fino.',
        formula: 'H_{\\text{PA}}(f)=1-H_{\\text{PB}}(f)',
        prompt:
          'Ajuste o corte e veja o zumbido diminuir sem perder o tom principal.',
        control: 'Frequência de corte',
        kind: 'highpass',
      },
      {
        id: 'fir',
        title: 'Resposta em frequência',
        concept:
          'A resposta em frequência informa quanto o filtro amplifica ou atenua cada frequência.',
        intuition:
          'Para cada tom de entrada, o filtro aplica um ganho. A saída combina o tom original com esse ganho.',
        consequence:
          'A transição real ocupa uma faixa, então tons perto do corte são parcialmente alterados. Um corte ideal não pode ser realizado exatamente com um filtro finito.',
        formula: '|Y(f)|=|X(f)|\\,|H(f)|',
        prompt: 'Compare o ganho ideal com uma transição realizável.',
        control: 'Largura da transição',
        kind: 'response',
      },
    ],
  },
  {
    title: '04. FIR por dentro',
    summary: 'Veja como coeficientes produzem a filtragem.',
    lessons: [
      {
        id: 'impulse',
        title: 'Resposta ao impulso',
        concept:
          'A resposta ao impulso h[n] é a saída do filtro quando a entrada é um impulso unitário.',
        intuition:
          'Para um sistema linear e invariante no tempo, essa sequência contém informação suficiente para prever a saída para qualquer entrada.',
        consequence:
          'Coeficientes mais espalhados no tempo costumam produzir uma transição mais estreita em frequência, mas aumentam atraso e custo.',
        formula: 'h[n]=\\mathcal{H}\\{\\delta[n]\\}',
        prompt:
          'Altere a largura do impulso e compare a resposta no tempo e na frequência.',
        control: 'Largura dos coeficientes',
        kind: 'impulse',
      },
      {
        id: 'windows',
        title: 'Janelas e projeto FIR',
        concept:
          'Um FIR pode ser projetado truncando uma resposta ideal e multiplicando-a por uma janela, como Hamming.',
        intuition:
          'A janela suaviza as bordas do truncamento. Isso reduz ondulações, mas alarga a faixa de transição.',
        consequence:
          'Há uma troca entre largura da transição e atenuação da faixa rejeitada. Mais coeficientes permitem transições mais estreitas ao custo de mais cálculo e atraso.',
        formula: 'h[n]=h_{\\text{ideal}}[n]w[n]',
        prompt:
          'Compare resposta ideal e janelada ao mudar o tamanho do filtro.',
        control: 'Tamanho do filtro',
        kind: 'windows',
      },
    ],
  },
  {
    title: '05. Convolução',
    summary: 'Calcule como um sistema transforma uma entrada.',
    lessons: [
      {
        id: 'convolution-discrete',
        title: 'Convolução discreta',
        concept:
          'A saída FIR é a soma dos produtos entre coeficientes e amostras alinhadas da entrada.',
        intuition:
          'Inverta e deslize os coeficientes sobre o sinal. Em cada posição, multiplique os pares e some os resultados.',
        consequence:
          'Cada amostra de saída depende de uma vizinhança da entrada. Isso explica o atraso e a suavização produzida pelo filtro.',
        formula: 'y[n]=\\sum_{k=0}^{M-1}h[k]x[n-k]',
        prompt: 'Deslize a janela e confira cada produto que forma a saída.',
        control: 'Posição da janela',
        kind: 'discrete',
      },
      {
        id: 'convolution-continuous',
        title: 'Convolução contínua',
        concept:
          'Para sinais contínuos, a soma dos produtos vira uma integral sobre todos os deslocamentos.',
        intuition:
          'O valor de saída é a área do produto entre o sinal fixo e a versão refletida e deslocada da resposta ao impulso.',
        consequence:
          'Pulsos retangulares iguais produzem um triângulo; larguras diferentes produzem um trapézio.',
        formula: 'y(t)=\\int_{-\\infty}^{\\infty}x(\\tau)h(t-\\tau)\\,d\\tau',
        prompt: 'Desloque o pulso e compare sobreposição, produto e saída.',
        control: 'Deslocamento',
        kind: 'continuous',
      },
    ],
  },
  {
    title: '06. Além do FIR',
    summary: 'Conheça recursão, fase e limites de projeto.',
    lessons: [
      {
        id: 'iir',
        title: 'Introdução a IIR',
        concept:
          'Filtros IIR usam amostras atuais e saídas anteriores. A realimentação permite respostas longas com poucos coeficientes.',
        intuition:
          'Parte da saída volta para a entrada do cálculo seguinte, como um eco que se alimenta.',
        consequence:
          'IIRs podem alcançar transições estreitas com baixo custo, mas exigem cuidado com estabilidade e distorção de fase.',
        formula: 'y[n]=\\sum_k b_kx[n-k]-\\sum_{k=1}^{P}a_ky[n-k]',
        prompt:
          'Aumente a realimentação e veja a resposta ficar mais prolongada.',
        control: 'Realimentação',
        kind: 'iir',
      },
      {
        id: 'phase',
        title: 'Fase e atraso',
        concept:
          'A fase descreve o deslocamento temporal relativo de cada componente senoidal na saída.',
        intuition:
          'Dois tons podem manter o mesmo volume e ainda assim mudar de alinhamento no tempo.',
        consequence:
          'Fase não linear pode alterar a forma de transientes mesmo quando a resposta de amplitude parece correta. FIR simétrico tem fase linear e atraso constante.',
        formula: '\\tau_g(f)=-\\frac{1}{2\\pi}\\frac{d\\phi(f)}{df}',
        prompt:
          'Compare a fase e o atraso de filtros com respostas diferentes.',
        control: 'Inclinação de fase',
        kind: 'phase',
      },
    ],
  },
];
const lessons = modules.flatMap((module) => module.lessons);
const getProgressSegments = (
  completed: LessonId[],
  currentModuleIndex: number,
): ProgressSegment[] =>
  modules.map((module, index) => ({
    key: module.title,
    fill:
      (module.lessons.filter((lesson) => completed.includes(lesson.id)).length /
        module.lessons.length) *
      100,
    current: index === currentModuleIndex,
  }));
const isUnlocked = (targetIndex: number, completedLessons: LessonId[]) =>
  targetIndex === 0 ||
  lessons
    .slice(0, targetIndex)
    .every((item) => completedLessons.includes(item.id));
const chartColor = '#287fbb';
const createChartData = (kind: string, control: number) =>
  Array.from({ length: 101 }, (_, i) => {
    const x = (i - 50) / 10;
    const amount = control / 100;
    const tone = Math.sin(x * (0.6 + amount * 2));
    const second = 0.45 * Math.sin(x * 4.4);
    const cutoff = 0.6 + amount * 3;
    const low = 1 / (1 + Math.exp((Math.abs(x) - cutoff) * 3));
    const windowed =
      Math.exp(-Math.abs(x) * (0.35 + amount * 0.9)) * Math.cos(x * 2.4);
    const pulse = Math.max(
      0,
      Math.min(1, 1.5 - Math.abs(x - (amount * 5 - 2.5))),
    );
    const values: Record<string, number> = {
      signal: tone,
      sampling: tone,
      aliasing: Math.sin(x * (amount * 5 + 0.2)),
      frequency: tone,
      spectrum:
        Math.exp(-((x - 1) ** 2)) + amount * 0.6 * Math.exp(-((x + 2) ** 2)),
      lowpass: low,
      highpass: 1 - low,
      response: low,
      impulse: windowed,
      windows: windowed,
      discrete: pulse,
      continuous: Math.max(0, 2 - Math.abs(x - (amount * 5 - 2.5))),
      iir: Math.exp(-Math.abs(x) * (1.2 - amount)) * Math.cos(x * 2),
      phase: x * amount,
    };
    return {
      x,
      input: tone + second,
      output: values[kind] ?? tone,
      ideal: Math.abs(x) < cutoff ? 1 : 0,
      filtered: tone * low + second * (1 - low),
      fixed: Math.abs(x) < 2 ? 1 : 0,
      moving: Math.abs(x - (amount * 5 - 2.5)) < 2 ? 1 : 0,
    };
  });

const MathFormula = ({ value }: { value: string }) => (
  <div
    className="overflow-x-auto rounded-lg bg-background px-5 py-4 text-center"
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(value, {
        displayMode: true,
        throwOnError: false,
      }),
    }}
  />
);
const LessonChart = ({
  title,
  data,
  dataKey,
  color = chartColor,
  reference,
}: {
  title: string;
  data: ReturnType<typeof createChartData>;
  dataKey: string;
  color?: string;
  reference?: boolean;
}) => (
  <section className="min-w-0 rounded-xl bg-muted/30 p-3 sm:p-4">
    <h3 className="mb-2 text-sm font-semibold">{title}</h3>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#71717a" />
          {reference && (
            <ReferenceLine y={1} stroke="#71717a" strokeDasharray="4 4" />
          )}
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export const LearningCourse = () => {
  const {
    activeLesson,
    completedLessons,
    experimentValue,
    selectLesson,
    completeActivity,
    setExperimentValue,
    resetCourse,
  } = useLearningStore();
  const [resetPending, setResetPending] = useState(false);
  const courseMapRef = useRef<HTMLElement>(null);
  const lessonContentRef = useRef<HTMLElement>(null);
  const lessonConclusionRef = useRef<HTMLDivElement>(null);
  const lessonIndex = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === activeLesson),
  );
  const lesson = lessons[lessonIndex] ?? {
    id: 'signals' as const,
    title: 'Sinais contínuos e discretos',
    concept: '',
    intuition: '',
    consequence: '',
    formula: '',
    prompt: '',
    control: '',
    kind: 'signal',
  };
  const moduleIndex = modules.findIndex((module) =>
    module.lessons.some((item) => item.id === lesson.id),
  );
  const currentModule = modules[moduleIndex] ?? {
    title: '',
    summary: '',
    lessons: [lesson],
  };
  const moduleLessonIndex = currentModule.lessons.findIndex(
    (item) => item.id === lesson.id,
  );
  const data = createChartData(lesson.kind, experimentValue);
  const progressSegments = getProgressSegments(completedLessons, moduleIndex);
  const changeValue = (value: number) => {
    setExperimentValue(value);
    completeActivity();
  };
  const select = (id: LessonId) => {
    selectLesson(id);
    useLearningStore.getState().continueCourse();
  };
  const reset = () => setResetPending(true);
  useLayoutEffect(() => {
    const map = courseMapRef.current;
    const content = lessonContentRef.current;
    const conclusion = lessonConclusionRef.current;
    if (!map || !content || !conclusion) {
      return undefined;
    }

    const syncHeight = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const contentTop = content.getBoundingClientRect().top;
      const conclusionBottom = conclusion.getBoundingClientRect().bottom;
      const mapHeight = `${conclusionBottom - contentTop}px`;
      map.style.height = desktop ? mapHeight : '';
      map.style.maxHeight = desktop ? mapHeight : '';
      map.style.minHeight = desktop ? mapHeight : '';
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(content);
    observer.observe(conclusion);
    window.addEventListener('resize', syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
      map.style.height = '';
      map.style.maxHeight = '';
      map.style.minHeight = '';
    };
  }, []);
  return (
    <main className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10">
      <aside
        ref={courseMapRef}
        className="flex flex-col gap-5 lg:min-h-0 lg:overflow-hidden"
        aria-label="Mapa do curso"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">Seu percurso</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {completedLessons.length} de {lessons.length} aulas concluídas
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw /> Reiniciar
          </Button>
        </div>
        <div
          hidden={!resetPending}
          role="alertdialog"
          aria-label="Confirmar reinício"
          className="rounded-lg bg-muted p-4"
        >
          <p className="text-sm font-medium">
            Apagar o progresso e reiniciar o curso?
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                resetCourse();
                setResetPending(false);
              }}
            >
              Reiniciar curso
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResetPending(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
        <fieldset
          className="grid grid-cols-6 gap-1.5 border-0 p-0"
          aria-label="Progresso por módulo"
        >
          {progressSegments.map((segment) => (
            <div
              key={segment.key}
              className="h-2 overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              <div
                className={`h-full transition-[width] ${segment.current ? 'bg-primary' : 'bg-foreground/70'}`}
                style={{ width: `${segment.fill}%` }}
              />
            </div>
          ))}
        </fieldset>
        <div className="space-y-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
          {modules.map((module) => (
            <section key={module.title} className="space-y-1">
              <div className="px-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {module.title}
                </p>
                <p className="mt-1 text-xs/5 text-muted-foreground">
                  {module.summary}
                </p>
              </div>
              {module.lessons.map((item) => {
                const globalIndex = lessons.findIndex(
                  (entry) => entry.id === item.id,
                );
                const locked = !isUnlocked(globalIndex, completedLessons);
                const complete = completedLessons.includes(item.id);
                let marker = <span>{globalIndex + 1}</span>;
                if (complete) {
                  marker = <Check className="size-3.5" />;
                } else if (locked) {
                  marker = <Lock className="size-3" />;
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={locked}
                    onClick={() => select(item.id)}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${activeLesson === item.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background text-[11px]">
                      {marker}
                    </span>
                    <span className="text-sm/5 font-medium">{item.title}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </div>
      </aside>
      <article ref={lessonContentRef} className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Módulo {moduleIndex + 1} de {modules.length}
            </p>
            <p className="mt-1 text-base font-semibold tracking-tight">
              {currentModule.title.replace(/^\d+\.\s*/, '')}
            </p>
          </div>
          <p className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium tabular-nums">
            Aula {moduleLessonIndex + 1} de {currentModule.lessons.length}
          </p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-5 max-w-4xl text-lg/8">{lesson.concept}</p>
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl bg-muted/50 p-5">
            <h2 className="text-sm font-semibold">Intuição</h2>
            <p className="mt-2 text-base/7 text-muted-foreground">
              {lesson.intuition}
            </p>
          </section>
          <section className="rounded-xl bg-muted/50 p-5">
            <h2 className="mb-3 text-sm font-semibold">A relação matemática</h2>
            <MathFormula value={lesson.formula} />
          </section>
        </div>
        <section className="mt-5 rounded-xl bg-zinc-950 p-5 text-zinc-50">
          <h2 className="text-sm font-semibold">Por que isso importa</h2>
          <p className="mt-2 text-base/7 text-zinc-300">{lesson.consequence}</p>
        </section>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Explore no gráfico</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lesson.prompt}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <label
              htmlFor="lesson-control"
              className="mb-3 block text-sm font-medium"
            >
              {lesson.control}:{' '}
              <span className="text-muted-foreground tabular-nums">
                {experimentValue}%
              </span>
            </label>
            <Slider
              id="lesson-control"
              value={[experimentValue]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => changeValue(values[0] ?? 0)}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <LessonChart title="Sinal no tempo" data={data} dataKey="input" />
          <LessonChart
            title={
              lesson.kind === 'continuous'
                ? 'Sobreposição dos pulsos'
                : 'Efeito do parâmetro'
            }
            data={data}
            dataKey={lesson.kind === 'continuous' ? 'moving' : 'output'}
            color="#168574"
            reference={lesson.kind === 'response' || lesson.kind === 'lowpass'}
          />
        </div>
        {[
          'lowpass',
          'highpass',
          'response',
          'spectrum',
          'windows',
          'fir',
        ].includes(lesson.kind) && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <LessonChart
              title="Entrada e saída"
              data={data}
              dataKey="filtered"
              color="#287fbb"
            />
            <LessonChart
              title="Resposta ideal de referência"
              data={data}
              dataKey="ideal"
              color="#d97706"
            />
          </div>
        )}
        <div
          ref={lessonConclusionRef}
          className="mt-8 flex min-h-[88px] flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/50 p-5"
        >
          <div>
            <p className="font-semibold">
              {completedLessons.includes(lesson.id)
                ? 'Exploração concluída'
                : 'Pronto para seguir?'}
            </p>
            <p className="mt-1 text-sm/6 text-muted-foreground">
              {completedLessons.includes(lesson.id)
                ? 'A próxima aula já está disponível no mapa.'
                : 'Conclua esta exploração para liberar a próxima aula.'}
            </p>
          </div>
          {!completedLessons.includes(lesson.id) && (
            <Button
              size="lg"
              className="h-11 gap-2 px-5"
              onClick={completeActivity}
            >
              <Check /> Concluir aula
            </Button>
          )}
        </div>
      </article>
    </main>
  );
};

export default LearningCourse;
