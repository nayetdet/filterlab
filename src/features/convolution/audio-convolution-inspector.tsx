import { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import DiscreteStemChart, {
  type StemPoint,
} from '@/features/charts/discrete-stem-chart';
import type { AudioSettings } from '@/types/audio-settings';
import {
  createSignal,
  designFir,
  FILTER_DELAY,
  FILTER_LENGTH,
} from '@/utils/dsp';

type AudioConvolutionInspectorProps = {
  settings: AudioSettings;
  alignedSample: number;
  onAlignedSampleChange: (sample: number) => void;
};

const waveformConfig = {
  output: { label: 'Filtrado', color: '#287fbb' },
} satisfies ChartConfig;

export const AudioConvolutionInspector = ({
  settings,
  alignedSample,
  onAlignedSampleChange,
}: AudioConvolutionInspectorProps) => {
  const input = useMemo(
    () => createSignal(settings.interferenceFrequency, settings.intensity),
    [settings.interferenceFrequency, settings.intensity],
  );
  const impulse = useMemo(
    () => designFir(settings.filterKind, settings.cutoff),
    [settings.cutoff, settings.filterKind],
  );
  const terms = Array.from({ length: FILTER_LENGTH }, (_, k) => ({
    k,
    x: input[alignedSample + FILTER_DELAY - k] ?? 0,
    h: impulse[k] ?? 0,
  }));
  const total = terms.reduce((sum, term) => sum + term.h * term.x, 0);
  const outputs = useMemo(
    () =>
      Array.from({ length: 121 }, (_, index) => {
        const outputSampleIndex = Math.max(0, alignedSample - 60 + index);
        const value = impulse.reduce(
          (sum, coefficient, k) =>
            sum +
            coefficient * (input[outputSampleIndex + FILTER_DELAY - k] ?? 0),
          0,
        );
        return { sample: outputSampleIndex, value };
      }),
    [alignedSample, impulse, input],
  );
  const inputPoints: StemPoint[] = terms.map((term) => ({
    index: term.k,
    value: term.x,
  }));
  const coefficientPoints: StemPoint[] = terms.map((term) => ({
    index: term.k,
    value: term.h,
  }));
  const productPoints: StemPoint[] = terms.map((term) => ({
    index: term.k,
    value: term.x * term.h,
  }));

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Inspecione a soma real do filtro
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A saída do gráfico e a soma causal usam os mesmos coeficientes FIR.
        </p>
      </div>
      <Card>
        <CardHeader className="flex-row items-end justify-between pb-2">
          <div>
            <CardTitle className="text-base">Trecho da saída</CardTitle>
            <CardDescription>
              Índice alinhado m; FIR compensa o atraso de {FILTER_DELAY}{' '}
              amostras.
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              y[{alignedSample + FILTER_DELAY}]
            </p>
            <p className="text-xl font-semibold text-emerald-700 tabular-nums">
              {total.toFixed(6)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={waveformConfig}
            className="aspect-auto h-[190px] w-full cursor-crosshair"
          >
            <LineChart
              data={outputs}
              margin={{ top: 8, right: 10, bottom: 0, left: 0 }}
              onClick={(state) => {
                const point = outputs[Number(state?.activeTooltipIndex)];
                if (point) {
                  onAlignedSampleChange(point.sample);
                }
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="sample"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={false}
                width={46}
                fontSize={12}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `m = ${value}`}
                  />
                }
              />
              <ReferenceLine
                x={alignedSample}
                stroke="#168574"
                strokeDasharray="3 4"
              />
              <ReferenceLine y={0} stroke="#aab1b8" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-output)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-28 justify-center"
              onClick={() =>
                onAlignedSampleChange(Math.max(0, alignedSample - 1))
              }
            >
              <ArrowLeft /> Anterior
            </Button>
            <Label htmlFor="audio-sample">Amostra alinhada m</Label>
            <Input
              id="audio-sample"
              type="number"
              min={0}
              max={15999}
              value={alignedSample}
              onChange={(event) =>
                onAlignedSampleChange(
                  Math.max(0, Math.min(15999, Number(event.target.value))),
                )
              }
              className="w-[90px] tabular-nums"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-28 justify-center"
              onClick={() =>
                onAlignedSampleChange(Math.min(15999, alignedSample + 1))
              }
            >
              Próxima <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Termos da convolução</CardTitle>
          <CardDescription>
            <span className="font-mono text-sm">y[n] = Σ h[k] × x[n − k]</span>
            <span className="mt-1 block">
              Valores arredondados na interface; soma calculada em precisão
              completa.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="mb-1 text-sm font-medium">
                Entrada <span className="font-mono">x[n − k]</span>
              </h3>
              <DiscreteStemChart
                data={inputPoints}
                color="#65717d"
                height={145}
                domain={[-1.3, 1.3]}
              />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium">
                Coeficientes <span className="font-mono">h[k]</span>
              </h3>
              <DiscreteStemChart
                data={coefficientPoints}
                color="#287fbb"
                height={145}
                domain={[-1.1, 1.1]}
              />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium">
                Produtos <span className="font-mono">h[k] x[n − k]</span>
              </h3>
              <DiscreteStemChart
                data={productPoints}
                color="#168574"
                height={145}
                domain={[-0.2, 0.2]}
              />
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-sm font-medium">Soma da amostra selecionada</p>
            <p className="mt-2 font-mono text-base text-muted-foreground tabular-nums">
              y[{alignedSample + FILTER_DELAY}] ={' '}
              <strong className="rounded-md bg-slate-900 px-3 py-1 text-white">
                {total.toFixed(7)}
              </strong>
            </p>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="terms" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm">
                Conferir os 129 termos
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-h-80 overflow-auto rounded-lg border">
                  <table className="w-full text-right text-xs tabular-nums">
                    <thead className="sticky top-0 bg-muted">
                      <tr>
                        <th className="px-3 py-2">k</th>
                        <th className="px-3 py-2">x[m + 64 − k]</th>
                        <th className="px-3 py-2">h[k]</th>
                        <th className="px-3 py-2">Produto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {terms.map((term) => (
                        <tr key={term.k} className="border-t">
                          <td className="px-3 py-1.5">{term.k}</td>
                          <td className="px-3 py-1.5">{term.x.toFixed(5)}</td>
                          <td className="px-3 py-1.5">{term.h.toFixed(7)}</td>
                          <td className="px-3 py-1.5">
                            {(term.h * term.x).toFixed(7)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        A janela mostra {terms.length} coeficientes; coeficientes e amostras são
        alinhados pelo índice k.
      </p>
    </div>
  );
};

export default AudioConvolutionInspector;
