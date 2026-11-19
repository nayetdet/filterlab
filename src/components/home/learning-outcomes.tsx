import { CheckCircle2 } from 'lucide-react';
import { outcomes } from '@/data/home';

export const LearningOutcomes = () => (
  <section className="grid gap-6 rounded-2xl bg-muted/40 p-6 sm:gap-8 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
    <div>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        O que você vai aprender a fazer
      </h2>
      <p className="mt-3 text-sm/6 text-muted-foreground sm:text-base/7">
        Conectar os cálculos ao resultado que você ouve e observa.
      </p>
    </div>
    <ul className="grid gap-3 sm:grid-cols-2">
      {outcomes.map((outcome) => (
        <li
          key={outcome}
          className="flex gap-3 text-sm/6 text-foreground sm:text-base/6"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>{outcome}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default LearningOutcomes;
