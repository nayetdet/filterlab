import { RotateCcw } from 'lucide-react';
import { useState, type Ref } from 'react';
import { Button } from '@/components/ui/button';
import ModuleList from '@/components/course/navigation/module-list';
import ModuleProgress from '@/components/course/navigation/module-progress';
import ResetProgressDialog from '@/components/course/navigation/reset-progress-dialog';
import { courseLessons } from '@/data/course';
import { useCourseStore, type LessonId } from '@/stores/course-store';

export type CourseMapProps = {
  mapRef: Ref<HTMLElement>;
  activeLesson: LessonId;
  currentModuleIndex: number;
  onSelectLesson: (lessonId: LessonId) => void;
};

export const CourseMap = ({
  mapRef,
  activeLesson,
  currentModuleIndex,
  onSelectLesson,
}: CourseMapProps) => {
  const completedLessons = useCourseStore((state) => state.completedLessons);
  const resetProgress = useCourseStore((state) => state.resetProgress);
  const [resetPending, setResetPending] = useState(false);

  return (
    <aside
      ref={mapRef}
      className="flex flex-col gap-6 lg:min-h-0 lg:overflow-hidden"
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
      <ModuleList
        activeLesson={activeLesson}
        completedLessons={completedLessons}
        onSelectLesson={onSelectLesson}
      />
    </aside>
  );
};

export default CourseMap;
