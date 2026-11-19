import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DiscreteStemChart, {
  type StemPoint,
} from '@/features/charts/discrete-stem-chart';
import { convolve } from '@/utils/dsp';

type DiscretePulseLabProps = {
  sample: number;
  onSampleChange: (sample: number) => void;
};
const inputSequence = Array.from({ length: 15 }, (_, index) =>
  index >= 5 && index <= 9 ? 1 : 0,
);

export const DiscretePulseLab = ({
  sample,
  onSampleChange,
}: DiscretePulseLabProps) => {
  const [filterMode, setFilterMode] = useState<'average' | 'difference'>(
    'average',
  );
  const isLowpass = filterMode === 'average';
  const coefficients = isLowpass ? [1 / 3, 1 / 3, 1 / 3] : [1, -1];
  const result = convolve(inputSequence, coefficients);
  const selected = Math.max(0, Math.min(result.length - 1, sample));
  const terms = coefficients.map((coefficient, index) => ({
    coefficient,
    input: inputSequence[selected - index] ?? 0,
    index,
  }));
  const total = terms.reduce(
    (sum, term) => sum + term.coefficient * term.input,
    0,
  );
  const inputData: StemPoint[] = inputSequence.map((value, index) => ({
    index: index - 5,
    value,
    active: terms.some(
      (term) => selected - term.index === index && term.input !== 0,
    ),
  }));
  const coefficientData: StemPoint[] = coefficients.map((value, index) => ({
    index,
    value,
  }));
  const outputData: StemPoint[] = result.map((value, index) => ({
    index: index - 5,
    value,
    active: index === selected,
  }));

  const setFilter = (value: string) => {
    if (value === 'average' || value === 'difference') {
      setFilterMode(value);
      onSampleChange(value === 'average' ? 6 : 5);
    }
  };
  const selectSample = (value: number) =>
    onSampleChange(Math.max(0, Math.min(result.length - 1, value)));

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Uma sequência atravessa o filtro
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Veja como os coeficientes transformam cada amostra do pulso.
          </p>
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          value={filterMode}
          onValueChange={setFilter}
          className="grid w-full max-w-[440px] grid-cols-2"
        >
          <ToggleGroupItem value="average" className="w-full text-sm">
            Passa-baixa: média
          </ToggleGroupItem>
          <ToggleGroupItem value="difference" className="w-full text-sm">
            Passa-alta: diferença
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Entrada <span className="font-mono">x[n]</span>
            </CardTitle>
            <CardDescription>
              Pulso com cinco amostras de altura 1.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DiscreteStemChart
              data={inputData}
              color="#68717a"
              height={210}
              domain={[-0.2, 1.2]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Coeficientes <span className="font-mono">h[k]</span>
            </CardTitle>
            <CardDescription>
              {isLowpass
                ? 'Média móvel de três pontos.'
                : 'Diferença entre amostras adjacentes.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DiscreteStemChart
              data={coefficientData}
              color="#287fbb"
              height={210}
              domain={[-1.2, 1.2]}
            />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex-row items-end justify-between pb-2">
          <div>
            <CardTitle className="text-lg">
              Saída <span className="font-mono">y[n]</span>
            </CardTitle>
            <CardDescription>
              <span className="font-mono text-sm">
                y[n] = Σ h[k] × x[n − k]
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Amostra selecionada</p>
            <p className="text-xl font-semibold text-emerald-700 tabular-nums">
              {total.toFixed(3)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <DiscreteStemChart
            data={outputData}
            color="#287fbb"
            height={250}
            domain={[-1.25, 1.25]}
          />
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-28 justify-center"
              disabled={selected === 0}
              onClick={() => selectSample(selected - 1)}
            >
              <ArrowLeft /> Anterior
            </Button>
            <Label htmlFor="output-index" className="ml-1">
              Amostra n
            </Label>
            <Input
              id="output-index"
              type="number"
              min={0}
              max={result.length - 1}
              value={selected}
              onChange={(event) => selectSample(Number(event.target.value))}
              className="w-[78px] tabular-nums"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-28 justify-center"
              disabled={selected === result.length - 1}
              onClick={() => selectSample(selected + 1)}
            >
              Próxima <ArrowRight />
            </Button>
          </div>
          <div className="mt-4 rounded-xl bg-muted/40 p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">Cálculo da amostra</p>
              <p className="font-mono text-sm text-muted-foreground tabular-nums">
                n = {selected - 5}
              </p>
            </div>
            <p className="flex flex-wrap items-center gap-2 font-mono text-sm/7 text-muted-foreground">
              {terms.map((term, index) => (
                <span
                  key={term.index}
                  className={
                    term.input
                      ? 'rounded-md bg-sky-50 px-2 py-0.5 text-sky-900'
                      : 'rounded-md bg-muted/70 px-2 py-0.5'
                  }
                >
                  {term.coefficient.toFixed(2)} × {term.input}
                  {index < terms.length - 1 ? ' +' : ''}
                </span>
              ))}{' '}
              <strong className="rounded-md bg-slate-900 px-3 py-1 text-base text-white tabular-nums">
                = {total.toFixed(3)}
              </strong>
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {isLowpass
              ? 'A média suaviza as bordas do pulso.'
              : 'A subida gera +1; a região constante fica em zero e a queda gera −1.'}{' '}
            O cálculo usa convolução discreta direta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscretePulseLab;
