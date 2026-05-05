# Copilot Instructions

This `ui` workspace builds frontend assets that are compiled and then served by the Zola site in the parent repository. This project uses **Bun** as its package manager and script runner — use `bun` instead of `npm`.

## Verification commands

- If you modify any CSS/SCSS files, run `bun styles` to ensure everything still compiles correctly.
- If you modify scripts in the `src/assets` folder, run `bun build:static` to verify.
- If you modify any other CSS/SCSS/JS/TS/TSX files, run `bun inte` to verify.

## Guidelines

- Treat PageSpeed Insights results as a first-class requirement when changing frontend code in this workspace.
- Treat accessibility score as a first-class requirement when changing frontend code in this workspace.
- Treat print output and print workflows as a first-class requirement when changing frontend code in this workspace.
- All frontend updates that affect layout, spacing, positioning, icon direction, or transforms must support both LTR and RTL text direction. Prefer logical CSS properties and the existing `$rtl-sign` variable and `rtl()` function instead of hard-coded left/right assumptions.
- Be careful about layout thrashing, forced reflow, heavy scroll handlers, excessive DOM writes, and other patterns that hurt performance metrics.
- Preserve or improve keyboard accessibility, semantics, focus behavior, ARIA state, and screen-reader behavior when updating interactive UI.
- Any frontend change that can affect layout, visibility, interaction, or generated DOM must also consider print behavior, print media styles, and beforeprint/afterprint flows where relevant.
- All code changes must include detailed comments when they add, change, or preserve non-trivial behavior. Document the relevant constraints, tradeoffs, and why the chosen option was preferred so future maintainers can understand the context without reconstructing the decision.
- Do not review a script or stylesheet in isolation when its runtime usage matters: these assets are consumed by Zola templates in the parent folder.
- If you need to verify where a script or style file is used, inspect the Zola templates in `../templates`.
- When there is a tradeoff, prefer changes that improve real frontend performance and accessibility over micro-optimizing code style or exact visual behavior.

## Deterministic output

- For `xpack` generated assets, sourcemaps, prerendered HTML, and cache-busting hashes, make output deterministic across Windows, WSL, and Ubuntu inside the build tooling. Do not depend on project-specific `.gitattributes`, `core.autocrlf`, or local checkout line endings.
- Normalize text content to LF before embedding source-map `sourcesContent`, hashing text assets, writing prerendered HTML, or copying generated text assets into integration output folders. Preserve binary bytes unchanged.
- When changing `bun inte` output behavior, validate with `bun run test:ci`, run `bun inte`, then confirm no generated content diff with `git diff --quiet -- {VITE_INTE_PATTERN_DIR} {VITE_INTE_ASSET_DIR}`. On Windows, `git status` can still list LF-normalized generated files under `text=auto`; the content diff check is the source of truth.
