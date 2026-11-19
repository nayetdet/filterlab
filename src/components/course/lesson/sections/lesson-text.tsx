import katex from 'katex';

type LessonTextProps = { value: string; className?: string };

export const LessonText = ({ value, className }: LessonTextProps) => {
  const parts = value.split(/\\\((.+?)\\\)/g);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span
            key={`${index}-${part}`}
            className="mx-0.5 whitespace-nowrap [&_.katex]:text-[1.04em]"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part, { throwOnError: false }),
            }}
          />
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default LessonText;
