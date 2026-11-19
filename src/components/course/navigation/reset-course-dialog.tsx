import { RotateCcw } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';

type ResetCourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const ResetCourseDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ResetCourseDialogProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
      <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-background p-6 text-foreground">
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
            <RotateCcw className="size-4 text-muted-foreground" />
          </span>
          <div>
            <DialogPrimitive.Title className="text-lg font-semibold tracking-tight">
              Reiniciar o percurso?
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 text-sm/6 text-muted-foreground">
              O progresso e as aulas concluídas serão apagados.
            </DialogPrimitive.Description>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <DialogPrimitive.Close asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogPrimitive.Close>
          <Button variant="destructive" onClick={onConfirm}>
            Reiniciar curso
          </Button>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export default ResetCourseDialog;
