import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { FilterKind } from '@/types/filter';

type FilterDetailsChartsProps = {
  impulse: number[];
  step: number[];
  kind: FilterKind;
};

const impulseConfig = {
  coefficient: { label: 'h[n]', color: '#287fbb' },
} satisfies ChartConfig;
const stepConfig = {
  response: { label: 'Resposta', color: '#168574' },
} satisfies ChartConfig;

export const FilterDetailsCharts = ({
  impulse,
  step,
  kind,
}: FilterDetailsChartsProps) => (
  <div className="grid gap-6 pb-5 md:grid-cols-2">
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">
          Resposta ao impulso <span className="font-mono">h[n]</span>
        </h3>
        <span className="text-xs text-muted-foreground">129 coeficientes</span>
      </div>
      <ChartContainer
        config={impulseConfig}
        className="aspect-auto h-[190px] w-full"
      >
        <BarChart
          data={impulse.map((coefficient, index) => ({ index, coefficient }))}
          margin={{ top: 8, right: 10, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="index"
            ticks={[0, 32, 64, 96, 128]}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            width={40}
            fontSize={12}
          />
          <ReferenceLine y={0} stroke="#67717a" strokeWidth={1.5} />
          <ChartTooltip
            content={
              <ChartTooltipContent labelFormatter={(value) => `n = ${value}`} />
            }
          />
          <Bar
            dataKey="coefficient"
            fill="var(--color-coefficient)"
            barSize={4}
          />
        </BarChart>
      </ChartContainer>
      <p className="mt-2 text-xs text-muted-foreground">
        Atraso central destacado em n = 64.
      </p>
    </div>
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">Resposta ao degrau</h3>
        <span className="text-xs text-muted-foreground">Soma acumulada</span>
      </div>
      <ChartContainer
        config={stepConfig}
        className="aspect-auto h-[190px] w-full"
      >
        <LineChart
          data={step.map((response, index) => ({ index, response }))}
          margin={{ top: 8, right: 10, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="index"
            ticks={[0, 32, 64, 96, 128]}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            domain={kind === 'lowpass' ? [-0.15, 1.15] : [-0.15, 1.15]}
            tickLine={false}
            axisLine={false}
            width={40}
            fontSize={12}
          />
          <ReferenceLine
            y={kind === 'lowpass' ? 1 : 0}
            stroke="#aab1b8"
            strokeDasharray="3 4"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent labelFormatter={(value) => `n = ${value}`} />
            }
          />
          <Line
            type="monotone"
            dataKey="response"
            stroke="var(--color-response)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
      <p className="mt-2 text-xs text-muted-foreground">
        {kind === 'lowpass'
          ? 'A saída tende a 1.'
          : 'A saída retorna a 0 depois da transição.'}
      </p>
    </div>
  </div>
);

export default FilterDetailsCharts;
