import { RotateCcw } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';

type ResetProgressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const ResetProgressDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ResetProgressDialogProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-sm" />
      <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-3xl bg-background p-6 text-foreground shadow-2xl shadow-black/15 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted">
            <RotateCcw className="size-5 text-foreground" aria-hidden="true" />
          </span>
          <div className="pt-0.5">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Progresso do curso
            </p>
            <DialogPrimitive.Title className="mt-1 text-xl font-semibold tracking-tight">
              Reiniciar o percurso?
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 text-sm/6 text-muted-foreground">
              O progresso e as aulas concluídas serão apagados.
            </DialogPrimitive.Description>
          </div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogPrimitive.Close asChild>
            <Button
              className="h-11 w-full rounded-xl px-5 sm:w-auto"
              variant="outline"
            >
              Cancelar
            </Button>
          </DialogPrimitive.Close>
          <Button
            className="h-11 w-full rounded-xl px-5 sm:w-auto"
            variant="default"
            onClick={onConfirm}
          >
            Reiniciar curso
          </Button>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export default ResetProgressDialog;
