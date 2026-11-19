import { useState } from 'react';
import type { AudioSettings } from '@/types/audio-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioConvolutionInspector from '@/features/convolution/audio-convolution-inspector';
import ContinuousPulseLab from '@/features/convolution/continuous-pulse-lab';
import DiscretePulseLab from '@/features/convolution/discrete-pulse-lab';

type ConvolutionPageProps = {
  settings: AudioSettings;
  cursorSample: number;
  onCursorSampleChange: (sampleIndex: number) => void;
};

type ConvolutionMode = 'pulse' | 'rectangles' | 'audio';

export const ConvolutionPage = ({
  settings,
  cursorSample,
  onCursorSampleChange,
}: ConvolutionPageProps) => {
  const [activeMode, setActiveMode] = useState<ConvolutionMode>('pulse');
  const [discreteSampleIndex, setDiscreteSampleIndex] = useState(6);

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-[34px]">
          Convolução
        </h1>
      </div>
      <Tabs
        value={activeMode}
        onValueChange={(value) => setActiveMode(value as ConvolutionMode)}
        className="gap-6"
      >
        <TabsList
          variant="default"
          className="grid h-auto! min-h-11 w-full grid-cols-1 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-3"
        >
          <TabsTrigger
            value="pulse"
            className="h-auto min-h-11 cursor-pointer px-3 py-2 text-sm font-medium sm:text-base"
          >
            Filtrar um pulso
          </TabsTrigger>
          <TabsTrigger
            value="rectangles"
            className="h-auto min-h-11 cursor-pointer px-3 py-2 text-sm font-medium sm:text-base"
          >
            Pulsos contínuos
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="h-auto min-h-11 cursor-pointer px-3 py-2 text-sm font-medium sm:text-base"
          >
            Filtro de áudio
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pulse">
          <DiscretePulseLab
            sample={discreteSampleIndex}
            onSampleChange={setDiscreteSampleIndex}
          />
        </TabsContent>
        <TabsContent value="rectangles">
          <ContinuousPulseLab />
        </TabsContent>
        <TabsContent value="audio">
          <AudioConvolutionInspector
            settings={settings}
            alignedSample={cursorSample}
            onAlignedSampleChange={onCursorSampleChange}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ConvolutionPage;
