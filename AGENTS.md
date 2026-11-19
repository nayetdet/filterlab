# Project instructions

- Always write code and project documentation in English.
- Never modify `src/index.css`.
- Declare React components as named exported constants, such as
  `export const Component = () => {}`. Also provide a default export for every
  React component.
- Declare other exported functions as named exported constants. Do not use
  `function` declarations for exported functions.
- Do not add comments to code.
- Do not use em dashes in project text, documentation, or code.
- Do not use em dashes or centered dot bullets as prose separators in interface
  text or documentation. Use sentences, commas, or explicit labels instead.
- Avoid decorative borders in the UI. Prefer spacing, typography, and subtle
  surface contrast. Keep borders only where they are needed for controls or data
  separation.
- Avoid decorative shadows in the UI. Prefer spacing, typography, and subtle
  surface contrast. Use shadows only when needed to distinguish floating or
  layered elements.
- Do not use relative imports; use the `@/` alias for project imports.
- Use kebab-case for every file name inside `src/`, except `App.tsx`.
- Before creating a component from scratch, check whether an existing component
  in the project's component libraries can be used or extended.
- Typeset mathematical formulas with a dedicated math renderer such as KaTeX or
  MathJax. Do not present formulas in the regular interface font or as plain
  monospace text. Typeset fractions as stacked fractions with `\frac` and use
  proper mathematical notation for indices and exponents.
- After making changes, run `bun check` and resolve any failures before
  finishing.
