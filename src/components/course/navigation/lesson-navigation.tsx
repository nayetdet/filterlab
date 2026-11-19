import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LessonNavigationProps = {
  description: string;
  lessonCompleted: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onComplete: () => void;
  onNext: () => void;
};

export const LessonNavigation = ({
  description,
  lessonCompleted,
  hasPrevious,
  hasNext,
  onPrevious,
  onComplete,
  onNext,
}: LessonNavigationProps) => (
  <div className="flex w-full flex-wrap items-center justify-between gap-4">
    <div>
      <p className="font-semibold">
        {lessonCompleted ? 'Exploração concluída' : 'Terminou de explorar?'}
      </p>
      <p className="mt-1 text-sm/6 text-muted-foreground">{description}</p>
    </div>
    <div className="ml-auto grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
      <Button
        variant="secondary"
        className="h-11 min-w-40 gap-2 px-5"
        disabled={!hasPrevious}
        onClick={onPrevious}
      >
        <ArrowLeft /> Aula anterior
      </Button>
      {lessonCompleted && hasNext && (
        <Button size="lg" className="h-11 min-w-40 gap-2 px-5" onClick={onNext}>
          Próxima aula <ArrowRight />
        </Button>
      )}
      {!lessonCompleted && (
        <Button
          size="lg"
          className="h-11 min-w-40 gap-2 px-5"
          onClick={onComplete}
        >
          <Check /> {hasNext ? 'Concluir e avançar' : 'Concluir curso'}
        </Button>
      )}
    </div>
  </div>
);

export default LessonNavigation;
