import katex from 'katex';
import 'katex/dist/katex.min.css';

type LessonFormulaProps = { value: string };

export const LessonFormula = ({ value }: LessonFormulaProps) => (
  <div
    className="overflow-x-auto bg-muted/30 p-5 text-center text-base sm:px-6 [&_.katex]:text-[1.12em]"
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(value, {
        displayMode: true,
        throwOnError: false,
      }),
    }}
  />
);

export default LessonFormula;
