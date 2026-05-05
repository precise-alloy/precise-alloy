---
description: 'Use when modifying frontend logic, xpack build tooling, Vitest coverage settings, or frontend CI workflows in PreciseAlloy.Frontend. Enforces the highest possible coverage, matching tests for every logic change, and bun run test:ci validation.'
name: 'Frontend Test Coverage Policy'
applyTo: 'src/**, xpack/**, package.json, vitest.config.ts, docs/test-coverage.md, .github/workflows/frontend-*.yml'
---

# Frontend Test Coverage Policy

- Preserve or improve the highest feasible coverage for every affected module. The enforced thresholds are `100%` statements / lines / functions and `>= 95%` branches per file.
- For every logic, branch, error-handling, path, or workflow behavior change, add or update tests in the same change.
- Do not lower coverage thresholds, remove gated modules, or weaken `bun run test:ci` workflow gates without explicit approval.
- Do not remove or weaken the local `simple-git-hooks` `pre-push` gate that runs `bun run typecheck` without explicit approval.
- Prefer extracting a testable core helper from side-effect-heavy `xpack` modules instead of accepting untested logic.
- Always cover newly introduced logic as much as possible. Any new `src/**` or `xpack/**` module that contains testable logic (pure helpers, regex/string transforms, dependency-injected core) MUST be added to the `coverage.include` list in `vitest.config.ts` in the same change, with tests that meet the enforced thresholds. Do not rely on the include list silently hiding a new file from the coverage report.
- For SSR guards (`typeof window === 'undefined'`, `typeof document === 'undefined'`, `typeof location === 'undefined'`), add a sibling `*.node-env.test.ts` with `// @vitest-environment node` rather than mocking globals in jsdom.
- For watcher / event-emitter callbacks, capture them from the mock's `mock.calls[i]?.[1]` and invoke directly so inline arrow bodies count toward function coverage.
- For `xpack/asset-hash.ts`, keep the default resolved asset filesystem path slash-normalized with `slash(path.resolve(...))`; missing-file logs and default dependency behavior should be consistent across Windows/POSIX, while returned asset URLs must remain `/assets/...` strings.
- For `xpack` generated assets, sourcemaps, prerendered HTML, and cache-busting hashes, do not rely on `.gitattributes` or local Git EOL config for deterministic output. Normalize text content to LF inside the build tooling before embedding source-map `sourcesContent`, hashing text assets, writing prerendered HTML, or copying generated text assets; leave binary bytes unchanged.
- When changing generated asset normalization, add regression tests for CRLF inputs, source-map `sourcesContent` CRLF escapes, and binary-file pass-through. Validate with `bun run test:ci`, then `bun inte`, and use `git diff --quiet -- {VITE_INTE_PATTERN_DIR} {VITE_INTE_ASSET_DIR}` to confirm no generated content diff. Windows `git status` may still show LF/text-auto warnings even when the content diff is empty.
- Prefer removing genuinely unreachable code (with a comment explaining the narrowing) over force-testing it through `as never` casts.
- Validate with the narrowest impacted suites first, then run `bun run test:ci` when execution is available.
- If a change makes a new critical module testable, widen the enforced coverage scope and update `docs/test-coverage.md` and `.github/skills/test-coverage/references/current-state.md`.
- Use the `test-coverage` skill for the repo-specific requirements, decisions, completed rollout, proven testing techniques, and the remaining GitHub branch-protection step.
