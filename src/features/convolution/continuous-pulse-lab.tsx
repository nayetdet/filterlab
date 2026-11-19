import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import PulseChart from '@/features/charts/pulse-chart';

const chartConfig = {
  fixed: { label: 'x(τ)', color: '#66727d' },
  moving: { label: 'h(t−τ)', color: '#287fbb' },
  product: { label: 'Produto', color: '#168574' },
  output: { label: 'y(t)', color: '#287fbb' },
} satisfies ChartConfig;

const overlapWidth = (widthX: number, widthH: number, shift: number) =>
  Math.max(
    0,
    Math.min(widthX / 2, shift + widthH / 2) -
      Math.max(-widthX / 2, shift - widthH / 2),
  );

export const ContinuousPulseLab = () => {
  const [widthX, setWidthX] = useState(2);
  const [widthH, setWidthH] = useState(2);
  const [shift, setShift] = useState(0);
  const [playing, setPlaying] = useState(false);
  const overlap = overlapWidth(widthX, widthH, shift);
  const fixedStart = -widthX / 2;
  const fixedEnd = widthX / 2;
  const movingStart = shift - widthH / 2;
  const movingEnd = shift + widthH / 2;
  const intersectionStart = Math.max(fixedStart, movingStart);
  const intersectionEnd = Math.min(fixedEnd, movingEnd);

  const pulseData = useMemo(
    () =>
      Array.from({ length: 201 }, (_, index) => {
        const tau = -4 + index * 0.04;
        return {
          tau,
          fixed: tau >= fixedStart && tau <= fixedEnd ? 1 : 0,
          moving: tau >= movingStart && tau <= movingEnd ? 0.78 : 0,
          product: tau >= intersectionStart && tau <= intersectionEnd ? 1 : 0,
        };
      }),
    [
      fixedEnd,
      fixedStart,
      intersectionEnd,
      intersectionStart,
      movingEnd,
      movingStart,
    ],
  );
  const outputData = useMemo(
    () =>
      Array.from({ length: 251 }, (_, index) => {
        const time = -5 + index * 0.04;
        return { time, output: overlapWidth(widthX, widthH, time) };
      }),
    [widthH, widthX],
  );

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    const timer = window.setInterval(
      () => setShift((value) => (value >= 4 ? -4 : value + 0.08)),
      35,
    );
    return () => window.clearInterval(timer);
  }, [playing]);

  const preset = (equal: boolean) => {
    setWidthX(equal ? 2 : 3.2);
    setWidthH(equal ? 2 : 1.8);
  };
  const step = (amount: number) => {
    setPlaying(false);
    setShift((value) => Math.max(-4, Math.min(4, value + amount)));
  };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            A área da sobreposição
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A saída é a área de interseção entre os pulsos em cada deslocamento.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-10 min-w-0 flex-1 justify-center px-3 sm:w-40 sm:flex-none"
            onClick={() => preset(true)}
          >
            Larguras iguais
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 min-w-0 flex-1 justify-center px-3 sm:w-40 sm:flex-none"
            onClick={() => preset(false)}
          >
            Larguras diferentes
          </Button>
        </div>
      </div>
      <div className="grid gap-4 rounded-xl bg-muted/40 p-4 sm:grid-cols-[1fr_1fr_130px] sm:items-center">
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <Label>
              Largura de <span className="font-mono">x(τ)</span>
            </Label>
            <strong className="tabular-nums">{widthX.toFixed(1)}</strong>
          </div>
          <Slider
            aria-label="Largura do pulso fixo"
            min={1}
            max={4}
            step={0.1}
            value={[widthX]}
            onValueChange={([value]) => setWidthX(value ?? 2)}
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <Label>
              Largura de <span className="font-mono">h(t − τ)</span>
            </Label>
            <strong className="tabular-nums">{widthH.toFixed(1)}</strong>
          </div>
          <Slider
            aria-label="Largura do pulso móvel"
            min={1}
            max={4}
            step={0.1}
            value={[widthH]}
            onValueChange={([value]) => setWidthH(value ?? 2)}
          />
        </div>
        <div className="flex items-center justify-between pt-3 sm:block sm:pt-0 sm:pl-5">
          <span className="text-xs text-muted-foreground">Área atual</span>
          <strong className="text-xl text-emerald-700 tabular-nums">
            {overlap.toFixed(2)}
          </strong>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <PulseChart
          title="Pulsos sobrepostos"
          subtitle="Interseção destacada"
          config={chartConfig}
        >
          <LineChart
            data={pulseData}
            margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tau"
              type="number"
              domain={[-4, 4]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis hide domain={[0, 1.15]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `τ = ${Number(value).toFixed(2)}`}
                />
              }
            />
            {overlap > 0 && (
              <ReferenceArea
                x1={intersectionStart}
                x2={intersectionEnd}
                y1={0}
                y2={1}
                fill="#168574"
                fillOpacity={0.19}
              />
            )}
            <Line
              type="stepAfter"
              dataKey="fixed"
              stroke="var(--color-fixed)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="stepAfter"
              dataKey="moving"
              stroke="var(--color-moving)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </PulseChart>
        <PulseChart
          title="Produto no instante"
          subtitle={`Área = ${overlap.toFixed(2)}`}
          config={chartConfig}
        >
          <AreaChart
            data={pulseData}
            margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tau"
              type="number"
              domain={[-4, 4]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis hide domain={[0, 1.15]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `τ = ${Number(value).toFixed(2)}`}
                />
              }
            />
            <Area
              type="stepAfter"
              dataKey="product"
              stroke="var(--color-product)"
              fill="var(--color-product)"
              fillOpacity={0.25}
              isAnimationActive={false}
            />
          </AreaChart>
        </PulseChart>
        <PulseChart
          title="Saída y(t)"
          subtitle={`y(${shift.toFixed(2)}) = ${overlap.toFixed(2)}`}
          config={chartConfig}
        >
          <LineChart
            data={outputData}
            margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={[-5, 5]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              domain={[0, Math.max(widthX, widthH) + 0.3]}
              tickLine={false}
              axisLine={false}
              width={32}
              fontSize={12}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `t = ${Number(value).toFixed(2)}`}
                />
              }
            />
            <ReferenceLine x={shift} stroke="#168574" strokeDasharray="3 4" />
            <Line
              type="linear"
              dataKey="output"
              stroke="var(--color-output)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#168574' }}
              isAnimationActive={false}
            />
          </LineChart>
        </PulseChart>
      </div>
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Button
            size="icon"
            aria-label={playing ? 'Pausar animação' : 'Reproduzir animação'}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-24 justify-center"
            onClick={() => step(-0.1)}
          >
            <ArrowLeft /> Passo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-24 justify-center"
            onClick={() => step(0.1)}
          >
            Passo <ArrowRight />
          </Button>
          <Label htmlFor="shift" className="ml-auto text-xs">
            Deslocamento{' '}
            <strong className="ml-1 tabular-nums">
              t = {shift.toFixed(2)}
            </strong>
          </Label>
          <Slider
            id="shift"
            aria-label="Deslocamento t"
            min={-4}
            max={4}
            step={0.01}
            value={[shift]}
            onValueChange={([value]) => {
              setPlaying(false);
              setShift(value ?? 0);
            }}
            className="basis-full sm:max-w-72"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContinuousPulseLab;
