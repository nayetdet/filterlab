import katex from 'katex';
import 'katex/dist/katex.min.css';

type LessonFormulaProps = { value: string };

export const LessonFormula = ({ value }: LessonFormulaProps) => (
  <div
    className="overflow-x-auto rounded-lg bg-background px-5 py-4 text-center"
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(value, {
        displayMode: true,
        throwOnError: false,
      }),
    }}
  />
);

export default LessonFormula;
