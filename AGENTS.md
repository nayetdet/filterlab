# Project instructions

- Always write code and project documentation in English.
- Never modify `src/index.css`.
- Declare React components as named exported constants, such as
  `export const Component = () => {}`. Also provide a default export for every
  React component.
- Declare other exported functions as named exported constants. Do not use
  `function` declarations for exported functions.
- Do not add comments to code.
- Do not use relative imports; use the `@/` alias for project imports.
- Before creating a component from scratch, check whether an existing component
  in the project's component libraries can be used or extended.
- After making changes, run `bun check` and resolve any failures before
  finishing.
