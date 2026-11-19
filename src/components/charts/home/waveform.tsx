import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { signalData } from '@/charts/home';

export const WaveformChart = () => (
  <figure
    aria-label="Gráfico de uma onda senoidal ao longo do tempo"
    className="min-w-0"
  >
    <div className="h-[190px] w-full sm:h-[280px] lg:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={signalData}
          margin={{ top: 8, right: 4, bottom: 8, left: 4 }}
        >
          <XAxis dataKey="x" type="number" domain={[0, 10]} hide />
          <YAxis domain={[-1.2, 1.2]} hide />
          <ReferenceLine y={0} stroke="#d4d4d8" strokeWidth={1} />
          <Line
            dataKey="y"
            type="monotone"
            stroke="#27272a"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive
            animationDuration={1800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </figure>
);

export default WaveformChart;
