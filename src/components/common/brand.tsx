type BrandProps = { onClick?: () => void };

export const Brand = ({ onClick }: BrandProps) => (
  <a
    href="#home"
    className="flex shrink-0 cursor-pointer items-center gap-3 text-xl font-semibold tracking-[-0.04em]"
    onClick={(event) => {
      event.preventDefault();
      onClick?.();
    }}
  >
    <span className="grid size-9 place-items-center rounded-[10px] bg-white p-1.5">
      <img src="/favicon.svg" alt="" className="size-full invert" />
    </span>
    FilterLab
  </a>
);

export default Brand;
