import { useState } from 'react';
import { AudioLines, Pause, Play, RotateCcw } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import FrequencyResponseChart from '@/features/charts/frequency-response-chart';
import FilterDetailsCharts from '@/features/charts/filter-details-charts';
import SpectrumChart from '@/features/charts/spectrum-chart';
import WaveformChart from '@/features/charts/waveform-chart';
import { useAudioFilterModel } from '@/hooks/use-audio-filter-model';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import type {
  AudioExperiment,
  AudioSettings,
  AudioSettingsPatch,
} from '@/types/audio-settings';
import { formatDb, SAMPLE_RATE } from '@/utils/dsp';

type AudioFiltersPageProps = {
  settings: AudioSettings;
  onSettingsChange: (patch: AudioSettingsPatch) => void;
  cursorSample: number;
  onCursorSampleChange: (sample: number) => void;
  onInspectAudioSample: (sample: number) => void;
};

export const AudioFiltersPage = ({
  settings,
  onSettingsChange,
  cursorSample,
  onCursorSampleChange,
  onInspectAudioSample,
}: AudioFiltersPageProps) => {
  const [responseScale, setResponseScale] = useState<'linear' | 'db'>('linear');
  const [showNegativeFrequencies, setShowNegativeFrequencies] = useState(false);
  const [showTransitionSketch, setShowTransitionSketch] = useState(false);
  const [cursorFrequency, setCursorFrequency] = useState(440);
  const [showFft, setShowFft] = useState(false);
  const audioModel = useAudioFilterModel(
    settings,
    cursorSample,
    cursorFrequency,
  );
  const playback = useAudioPlayback(
    audioModel.inputSignal,
    audioModel.filteredSignal,
  );
  const {
    inputSignal,
    filterCoefficients,
    inputTones,
    outputTones,
    toneSpectrum,
    fftSpectrum,
    waveform,
    stepResponse,
    cursorGain,
  } = audioModel;

  const applyExperimentPreset = (
    experiment: AudioExperiment,
    resetIntensity = false,
  ) => {
    onSettingsChange({
      experiment,
      filterKind: experiment === 'whistle' ? 'lowpass' : 'highpass',
      cutoff: experiment === 'whistle' ? 1000 : 200,
      interferenceFrequency: experiment === 'whistle' ? 3000 : 80,
      ...(resetIntensity ? { intensity: 0.4 } : {}),
    });
  };

  const filterGain = (amplitude: number, sourceAmplitude: number) =>
    formatDb(amplitude / Math.max(sourceAmplitude, 0.0001));

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-[34px]">
            Filtros de áudio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Veja como separar um tom desejado do ruído e confira cada etapa do
            cálculo.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl tracking-tight">
              Experimento
            </CardTitle>
            <CardDescription>Tom principal de 440 Hz</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="experiment">Sinal de entrada</Label>
              <Select
                value={settings.experiment}
                onValueChange={(value) =>
                  applyExperimentPreset(value as AudioExperiment)
                }
              >
                <SelectTrigger id="experiment" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whistle">Remover apito agudo</SelectItem>
                  <SelectItem value="hum">Remover zumbido grave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="interference-frequency">Interferência</Label>
                <span className="text-sm text-muted-foreground">Hz</span>
              </div>
              <Input
                id="interference-frequency"
                type="number"
                min={20}
                max={7900}
                step={10}
                value={settings.interferenceFrequency}
                onChange={(event) =>
                  onSettingsChange({
                    interferenceFrequency: Math.max(
                      20,
                      Math.min(7900, Number(event.target.value)),
                    ),
                  })
                }
                className="h-10 tabular-nums"
              />
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <Label>Intensidade</Label>
                  <span className="text-sm font-medium tabular-nums">
                    {Math.round(settings.intensity * 100)}%
                  </span>
                </div>
                <Slider
                  aria-label="Intensidade da interferência"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.intensity]}
                  onValueChange={([value]) =>
                    onSettingsChange({ intensity: value ?? 0.4 })
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl bg-muted/30 p-4">
              <div className="space-y-2">
                <Label>Tipo de filtro</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={settings.filterKind}
                  onValueChange={(value) => {
                    if (value === 'lowpass' || value === 'highpass') {
                      onSettingsChange({ filterKind: value });
                    }
                  }}
                  className="grid w-full grid-cols-2"
                >
                  <ToggleGroupItem
                    value="lowpass"
                    className="h-10 w-full text-sm"
                  >
                    Passa-baixa
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="highpass"
                    className="h-10 w-full text-sm"
                  >
                    Passa-alta
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cutoff">Frequência de corte</Label>
                  <span className="text-sm text-muted-foreground">Hz</span>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    id="cutoff"
                    min={100}
                    max={6000}
                    step={10}
                    value={[settings.cutoff]}
                    onValueChange={([value]) =>
                      onSettingsChange({ cutoff: value ?? 1000 })
                    }
                  />
                  <Input
                    aria-label="Frequência de corte em hertz"
                    type="number"
                    min={100}
                    max={6000}
                    step={10}
                    value={settings.cutoff}
                    onChange={(event) =>
                      onSettingsChange({
                        cutoff: Math.max(
                          100,
                          Math.min(6000, Number(event.target.value)),
                        ),
                      })
                    }
                    className="h-10 w-[88px] tabular-nums"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyExperimentPreset(settings.experiment, true)}
                className="w-full justify-start px-2 text-muted-foreground"
              >
                <RotateCcw className="size-4" /> Restaurar experimento
              </Button>
            </div>

            <div className="space-y-3 rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AudioLines className="size-4 text-muted-foreground" />
                  <Label>Áudio</Label>
                </div>
                <Button
                  size="icon"
                  className="size-9"
                  onClick={() =>
                    playback.isPlaying ? playback.pause() : playback.play()
                  }
                  aria-label={
                    playback.isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'
                  }
                >
                  {playback.isPlaying ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </Button>
              </div>
              <Tabs
                value={playback.selectedSource}
                onValueChange={(value) =>
                  playback.selectSource(value as 'original' | 'filtered')
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="filtered">Filtrado</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid min-w-0 gap-5">
          <Card className="overflow-hidden">
            <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl tracking-tight">
                  Resposta em frequência
                </CardTitle>
                <CardDescription className="mt-1">
                  Curva calculada a partir de h[n] e limite ideal.
                </CardDescription>
              </div>
              <ToggleGroup
                type="single"
                variant="outline"
                value={responseScale}
                onValueChange={(value) => {
                  if (value === 'linear' || value === 'db') {
                    setResponseScale(value);
                  }
                }}
                className="grid w-28 grid-cols-2"
              >
                <ToggleGroupItem value="linear" className="w-full text-sm">
                  Linear
                </ToggleGroupItem>
                <ToggleGroupItem value="db" className="w-full text-sm">
                  dB
                </ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger className="inline-flex items-center gap-2">
                    <span className="h-0 w-5 border-t-2 border-dashed border-slate-500" />{' '}
                    Ideal
                  </TooltipTrigger>
                  <TooltipContent>
                    Resposta ideal, comparada à curva FIR real.
                  </TooltipContent>
                </Tooltip>
                <span className="inline-flex items-center gap-2">
                  <span className="h-0 w-5 border-t-2 border-sky-600" /> FIR
                  calculado
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-0 w-5 border-t-2 border-dashed border-rose-500" />{' '}
                  Corte
                </span>
                <label className="ml-auto inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showNegativeFrequencies}
                    onChange={(event) =>
                      setShowNegativeFrequencies(event.target.checked)
                    }
                    className="accent-sky-700"
                  />{' '}
                  ± frequências
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showTransitionSketch}
                    onChange={(event) =>
                      setShowTransitionSketch(event.target.checked)
                    }
                    className="accent-sky-700"
                  />{' '}
                  Esquema
                </label>
              </div>
              <FrequencyResponseChart
                settings={settings}
                responseScale={responseScale}
                showNegativeFrequencies={showNegativeFrequencies}
                showTransitionSketch={showTransitionSketch}
                cursorFrequency={cursorFrequency}
                onSelectFrequency={setCursorFrequency}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-24 justify-center px-2"
                    onClick={() => setCursorFrequency(440)}
                  >
                    440 Hz
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-24 justify-center px-2"
                    onClick={() =>
                      setCursorFrequency(settings.interferenceFrequency)
                    }
                  >
                    {settings.interferenceFrequency.toLocaleString('pt-BR')} Hz
                  </Button>
                </div>
                <span>
                  Ganho em{' '}
                  <strong className="font-semibold text-foreground tabular-nums">
                    {cursorFrequency.toLocaleString('pt-BR')} Hz:{' '}
                    {formatDb(cursorGain)}{' '}
                    <span className="font-normal text-muted-foreground">
                      ({cursorGain.toFixed(3)})
                    </span>
                  </strong>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl tracking-tight">
                  Espectro do áudio
                </CardTitle>
                <CardDescription>
                  Amplitude estimada com janela Hann, fora dos transientes.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFft((value) => !value)}
              >
                {showFft ? 'Ver tons' : 'Ver FFT'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <i className="size-2 rounded-full bg-zinc-400" /> Original
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-2 rounded-full bg-sky-600" /> Filtrado
                </span>
              </div>
              <SpectrumChart
                data={toneSpectrum}
                fftSpectrum={fftSpectrum}
                showFft={showFft}
              />
              <div className="grid gap-3 pt-4 sm:grid-cols-2">
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Tom principal, 440 Hz
                  </span>
                  <strong className="tabular-nums">
                    {inputTones.principal.toFixed(3)} →{' '}
                    {outputTones.principal.toFixed(3)}{' '}
                    <span className="ml-1 font-normal text-zinc-600">
                      {filterGain(outputTones.principal, inputTones.principal)}
                    </span>
                  </strong>
                </div>
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Interferência,{' '}
                    {settings.interferenceFrequency.toLocaleString('pt-BR')} Hz
                  </span>
                  <strong className="tabular-nums">
                    {inputTones.interference.toFixed(3)} →{' '}
                    {outputTones.interference.toFixed(3)}{' '}
                    <span className="ml-1 font-normal text-zinc-600">
                      {settings.intensity === 0
                        ? 'Indisponível'
                        : filterGain(
                            outputTones.interference,
                            inputTones.interference,
                          )}
                    </span>
                  </strong>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-xl tracking-tight">
                  Forma de onda
                </CardTitle>
                <CardDescription>
                  Trecho de 25 ms; atraso do FIR compensado.
                </CardDescription>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums">
                Cursor: {((cursorSample / SAMPLE_RATE) * 1000).toFixed(2)} ms
              </span>
            </CardHeader>
            <CardContent>
              <WaveformChart
                data={waveform}
                cursorSample={cursorSample}
                onCursorSampleChange={onCursorSampleChange}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <Slider
                  aria-label="Cursor da forma de onda"
                  min={0}
                  max={inputSignal.length - 1}
                  step={1}
                  value={[cursorSample]}
                  onValueChange={([sample]) =>
                    onCursorSampleChange(sample ?? 0)
                  }
                  className="max-w-md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInspectAudioSample(cursorSample)}
                >
                  <AudioLines className="size-4" /> Inspecionar amostra
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl tracking-tight">
                Como o filtro responde
              </CardTitle>
              <CardDescription>
                Coeficientes do filtro e resposta a uma entrada constante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterDetailsCharts
                impulse={filterCoefficients}
                step={stepResponse}
                kind={settings.filterKind}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AudioFiltersPage;
