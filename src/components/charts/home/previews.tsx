import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { previewCharts } from '@/charts/home';

export const ChartPreviews = () => (
  <section>
    <div className="mb-7 max-w-2xl">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Veja os conceitos ganharem forma.
      </h2>
      <p className="mt-3 text-base/7 text-muted-foreground sm:mt-4">
        Tempo, frequência e filtragem se conectam ao longo das aulas.
      </p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-4 h-40 sm:h-44">
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
);

export default ChartPreviews;
