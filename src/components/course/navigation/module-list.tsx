import { Check } from 'lucide-react';
import { courseLessons, courseModules } from '@/data/course';
import type { LessonId } from '@/stores/course';

type ModuleListProps = {
  activeLesson: LessonId;
  completedLessons: LessonId[];
  mobileExpanded: boolean;
  onSelectLesson: (lessonId: LessonId) => void;
};

export const ModuleList = ({
  activeLesson,
  completedLessons,
  mobileExpanded,
  onSelectLesson,
}: ModuleListProps) => {
  return (
    <div
      className={`relative min-h-0 lg:flex-1 ${mobileExpanded ? 'block' : 'hidden'} lg:block`}
    >
      <nav
        id="course-module-list"
        aria-label="Lista de módulos e aulas"
        className="divide-y divide-border/70 pb-3"
      >
        {courseModules.map((module, moduleNumber) => (
          <section key={module.title} className="space-y-3 py-5 first:pt-0">
            <header className="flex items-start gap-3 px-2">
              <span className="pt-0.5 text-xs font-semibold text-muted-foreground tabular-nums">
                {String(moduleNumber + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm/5 font-semibold tracking-tight text-foreground">
                  {module.title.replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="mt-1 text-xs/5 text-muted-foreground">
                  {module.summary}
                </p>
              </div>
            </header>
            <div className="space-y-1">
              {module.lessons.map((item) => {
                const lessonIndex = courseLessons.indexOf(item);
                const complete = completedLessons.includes(item.id);
                const selected = activeLesson === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectLesson(item.id)}
                    aria-current={selected ? 'step' : undefined}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${selected ? 'bg-muted/70 text-foreground' : 'text-muted-foreground hover:bg-muted/40'}`}
                  >
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center text-xs tabular-nums ${selected ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                    >
                      {complete ? (
                        <Check className="size-3.5" />
                      ) : (
                        lessonIndex + 1
                      )}
                    </span>
                    <span className="text-sm/5 font-medium">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    </div>
  );
};

export default ModuleList;
