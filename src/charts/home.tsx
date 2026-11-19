import { AudioLines, Filter, Workflow } from 'lucide-react';

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
