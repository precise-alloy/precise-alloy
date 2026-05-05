# PreciseAlloy.Frontend Copilot Instructions

- For `xpack` generated assets, sourcemaps, prerendered HTML, and cache-busting hashes, make output deterministic across Windows, WSL, and Ubuntu inside the build tooling. Do not depend on project-specific `.gitattributes`, `core.autocrlf`, or local checkout line endings.
- Normalize text content to LF before embedding source-map `sourcesContent`, hashing text assets, writing prerendered HTML, or copying generated text assets into integration output folders. Preserve binary bytes unchanged.
- When changing `bun inte` output behavior, validate with `bun run test:ci`, run `bun inte`, then confirm no generated content diff with `git diff --quiet -- ../PreciseAlloy.Patterns ../PreciseAlloy.Web/wwwroot/assets`. On Windows, `git status` can still list LF-normalized generated files under `text=auto`; the content diff check is the source of truth.
