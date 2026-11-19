import { learningSteps } from '@/data/home-content';

export const HomeLearningSteps = () => (
  <section className="mt-20">
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-muted-foreground">
        APRENDIZADO GUIADO
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Conceito, fórmula e experimento na mesma aula.
      </h2>
      <p className="mt-4 text-base/7 text-muted-foreground">
        Cada etapa conecta a explicação ao que você vê. Teste uma ideia e
        acompanhe suas consequências.
      </p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {learningSteps.map(({ title, description, icon: Icon }, index) => (
        <article key={title} className="rounded-2xl bg-muted/50 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground tabular-nums">
              ETAPA {index + 1}
            </p>
            <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm/6 text-muted-foreground">{description}</p>
        </article>
      ))}
    </div>
  </section>
);

export default HomeLearningSteps;
