import {
  AudioLines,
  ChartNoAxesCombined,
  Filter,
  Lightbulb,
  Sigma,
  Workflow,
} from 'lucide-react';

export const learningSteps = [
  {
    title: 'Entenda a ideia',
    description: 'Comece pela intuição e veja o que o conceito descreve.',
    icon: Lightbulb,
  },
  {
    title: 'Leia a fórmula',
    description: 'Conheça os símbolos e acompanhe como eles se relacionam.',
    icon: Sigma,
  },
  {
    title: 'Teste no gráfico',
    description: 'Mude os parâmetros e observe suas consequências.',
    icon: ChartNoAxesCombined,
  },
];
export const outcomes = [
  'Reconhecer tons e interferências no espectro.',
  'Escolher entre passa-baixa e passa-alta.',
  'Entender como coeficientes FIR filtram um sinal.',
  'Acompanhar a soma que forma cada amostra de saída.',
];
export const signalData = Array.from({ length: 201 }, (_, index) => {
  const x = index / 20;
  return { x, y: Math.sin((x * Math.PI) / 2) };
});
export const previewCharts = [
  {
    title: 'Espectro',
    description: 'Veja os tons que compõem um som.',
    color: '#287fbb',
    icon: AudioLines,
    data: Array.from({ length: 81 }, (_, index) => {
      const x = index / 8;
      return {
        x,
        y:
          Math.exp(-((x - 2.2) ** 2) * 2) +
          0.65 * Math.exp(-((x - 6.3) ** 2) * 3),
      };
    }),
  },
  {
    title: 'Filtro',
    description: 'A faixa de corte muda o que permanece.',
    color: '#168574',
    icon: Filter,
    data: Array.from({ length: 81 }, (_, index) => {
      const x = index / 8;
      return { x, y: 1 / (1 + Math.exp((x - 4.8) * 2.4)) };
    }),
  },
  {
    title: 'Convolução',
    description: 'A sobreposição define o sinal de saída.',
    color: '#8b6bb1',
    icon: Workflow,
    data: Array.from({ length: 81 }, (_, index) => {
      const x = index / 8 - 5;
      return { x, y: Math.max(0, 2 - Math.abs(x)) };
    }),
  },
];
