import { lazy, Suspense, useState } from 'react';
import SiteLayout from '@/components/layout/site-layout';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { AudioSettings, AudioSettingsPatch } from '@/types/audio-settings';
import type { SiteSection } from '@/types/navigation';

const AudioFiltersPage = lazy(
  () => import('@/features/filters/audio-filters-page'),
);
const ConvolutionPage = lazy(
  () => import('@/features/convolution/convolution-page'),
);

export const App = () => {
  const [activeSection, setActiveSection] = useState<SiteSection>('audio');
  const [selectedAudioSample, setSelectedAudioSample] = useState(240);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    experiment: 'whistle',
    filterKind: 'lowpass',
    cutoff: 1000,
    interferenceFrequency: 3000,
    intensity: 0.4,
  });

  const updateAudioSettings = (patch: AudioSettingsPatch) =>
    setAudioSettings((currentSettings) => ({ ...currentSettings, ...patch }));

  return (
    <TooltipProvider>
      <SiteLayout section={activeSection} onSectionChange={setActiveSection}>
        <Suspense
          fallback={
            <main className="mx-auto min-h-[70vh] max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
              <div className="h-8 w-56 animate-pulse rounded-sm bg-muted" />
              <div className="mt-6 h-96 animate-pulse rounded-xl border bg-muted/30" />
            </main>
          }
        >
          {activeSection === 'audio' ? (
            <AudioFiltersPage
              settings={audioSettings}
              onSettingsChange={updateAudioSettings}
              cursorSample={selectedAudioSample}
              onCursorSampleChange={setSelectedAudioSample}
              onInspectAudioSample={(sampleIndex) => {
                setSelectedAudioSample(sampleIndex);
                setActiveSection('convolution');
              }}
            />
          ) : (
            <ConvolutionPage
              settings={audioSettings}
              cursorSample={selectedAudioSample}
              onCursorSampleChange={setSelectedAudioSample}
            />
          )}
        </Suspense>
      </SiteLayout>
    </TooltipProvider>
  );
};

export default App;
