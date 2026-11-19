import { CheckCircle2, Sparkles } from 'lucide-react';
import { outcomes } from '@/data/home-content';

export const HomeOutcomes = () => (
  <section className="mt-16 grid gap-8 rounded-2xl bg-zinc-950 p-6 text-zinc-50 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
    <div>
      <div className="flex items-center gap-3">
        <Sparkles className="size-5 shrink-0 text-zinc-300" />
        <h2 className="text-2xl font-semibold tracking-tight">
          O que você vai aprender a fazer
        </h2>
      </div>
      <p className="mt-3 text-sm/6 text-zinc-400">
        Conectar os cálculos ao resultado que você ouve e observa.
      </p>
    </div>
    <ul className="grid gap-3 sm:grid-cols-2">
      {outcomes.map((outcome) => (
        <li key={outcome} className="flex gap-3 text-sm/6 text-zinc-200">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-zinc-400" />
          <span>{outcome}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default HomeOutcomes;
