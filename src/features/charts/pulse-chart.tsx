import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

type PulseChartProps = {
  title: string;
  subtitle: string;
  config: ChartConfig;
  children: ReactNode;
};

export const PulseChart = ({
  title,
  subtitle,
  config,
  children,
}: PulseChartProps) => (
  <Card className="min-w-0">
    <CardHeader className="pb-1">
      <CardTitle className="text-sm">{title}</CardTitle>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardHeader>
    <CardContent>
      <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
        {children}
      </ChartContainer>
    </CardContent>
  </Card>
);

export default PulseChart;
