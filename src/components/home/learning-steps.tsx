import { learningSteps } from '@/data/home';

export const LearningSteps = () => (
  <section>
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Conceito, fórmula e experimento na mesma aula.
      </h2>
      <p className="mt-3 text-base/7 text-muted-foreground sm:mt-4">
        Cada etapa conecta a explicação ao que você vê. Teste uma ideia e
        acompanhe suas consequências.
      </p>
    </div>
    <div className="mt-7 grid gap-4 md:mt-8 md:grid-cols-3">
      {learningSteps.map(({ title, description, icon: Icon }, index) => (
        <article key={title} className="rounded-2xl bg-muted/40 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Icon
              className="mt-1 size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground tabular-nums">
                ETAPA {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm/6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default LearningSteps;
