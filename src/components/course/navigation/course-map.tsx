import { ChevronDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ModuleList from '@/components/course/navigation/module-list';
import ModuleProgress from '@/components/course/navigation/module-progress';
import ResetProgressDialog from '@/components/course/navigation/reset-progress-dialog';
import { courseLessons } from '@/data/course';
import { useCourseStore, type LessonId } from '@/stores/course';

export type CourseMapProps = {
  activeLesson: LessonId;
  currentModuleIndex: number;
  onSelectLesson: (lessonId: LessonId) => void;
};

export const CourseMap = ({
  activeLesson,
  currentModuleIndex,
  onSelectLesson,
}: CourseMapProps) => {
  const completedLessons = useCourseStore((state) => state.completedLessons);
  const resetProgress = useCourseStore((state) => state.resetProgress);
  const [resetPending, setResetPending] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <aside
      className="flex flex-col gap-6 rounded-2xl bg-muted/30 p-5 lg:min-h-0 lg:overflow-hidden"
      aria-label="Mapa do curso"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">Seu percurso</p>
          <p className="mt-1 text-sm/5 text-muted-foreground">
            {completedLessons.length} de {courseLessons.length} aulas concluídas
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setResetPending(true)}>
          <RotateCcw /> Reiniciar
        </Button>
      </div>
      <ResetProgressDialog
        open={resetPending}
        onOpenChange={setResetPending}
        onConfirm={() => {
          resetProgress();
          setResetPending(false);
        }}
      />
      <ModuleProgress
        completedLessons={completedLessons}
        currentModuleIndex={currentModuleIndex}
      />
      <Button
        type="button"
        variant="ghost"
        className="h-11 w-full justify-between px-3 lg:hidden"
        aria-expanded={mobileExpanded}
        aria-controls="course-module-list"
        onClick={() => setMobileExpanded((expanded) => !expanded)}
      >
        {mobileExpanded ? 'Ocultar aulas' : 'Ver módulos e aulas'}
        <ChevronDown
          className={`transition-transform ${mobileExpanded ? 'rotate-180' : ''}`}
        />
      </Button>
      <ModuleList
        activeLesson={activeLesson}
        completedLessons={completedLessons}
        mobileExpanded={mobileExpanded}
        onSelectLesson={(lessonId) => {
          onSelectLesson(lessonId);
          setMobileExpanded(false);
        }}
      />
    </aside>
  );
};

export default CourseMap;
