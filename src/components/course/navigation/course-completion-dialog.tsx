import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';

type CourseCompletionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CourseCompletionDialog = ({
  open,
  onOpenChange,
}: CourseCompletionDialogProps) => {
  const navigate = useNavigate();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-1/2 rounded-3xl bg-background p-6 text-foreground shadow-2xl shadow-black/15 sm:p-9">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-muted">
              <Award className="size-7 text-foreground" aria-hidden="true" />
            </span>
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Percurso completo
              </p>
              <DialogPrimitive.Title className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Curso concluído!
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mx-auto mt-3 max-w-sm text-sm/6 text-muted-foreground">
                Você chegou ao fim do curso. Os gráficos continuam disponíveis
                para explorar e testar novas ideias.
              </DialogPrimitive.Description>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <DialogPrimitive.Close asChild>
              <Button className="h-11 w-full px-5 sm:w-auto" variant="outline">
                Continuar explorando
              </Button>
            </DialogPrimitive.Close>
            <Button
              className="h-11 w-full px-5 sm:w-auto"
              onClick={() => navigate('/')}
            >
              Voltar ao início <ArrowRight />
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default CourseCompletionDialog;
