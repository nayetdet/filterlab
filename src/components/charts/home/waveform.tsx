import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { signalData } from '@/charts/home';

export const WaveformChart = () => (
  <figure
    aria-label="Gráfico de uma onda senoidal ao longo do tempo"
    className="min-w-0"
  >
    <div className="mb-4 flex items-center justify-between px-1 text-xs text-muted-foreground">
      <span>Amplitude</span>
      <span>Forma de onda</span>
      <span>Tempo</span>
    </div>
    <div className="h-[220px] w-full sm:h-[300px] lg:h-[400px]">
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
);

export default WaveformChart;
