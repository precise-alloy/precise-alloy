---
description: 'Use when modifying frontend logic, xpack build tooling, Vitest coverage settings, or frontend CI workflows in PreciseAlloy.Frontend. Enforces the highest possible coverage, matching tests for every logic change, and bun run test:ci validation.'
name: 'Frontend Test Coverage Policy'
applyTo:
  - 'src/**'
  - 'xpack/**'
  - 'package.json'
  - 'vitest.config.ts'
  - 'docs/test-coverage.md'
  - '.github/workflows/frontend-*.yml'
---

# Frontend Test Coverage Policy

- Preserve or improve the highest feasible coverage for every affected module.
- For every logic, branch, error-handling, path, or workflow behavior change, add or update tests in the same change.
- Do not lower coverage thresholds, remove gated modules, or weaken `bun run test:ci` workflow gates without explicit approval.
- Do not remove or weaken the local `simple-git-hooks` `pre-push` gate that runs `bun run typecheck` without explicit approval.
- Prefer extracting a testable core helper from side-effect-heavy `xpack` modules instead of accepting untested logic.
- Validate with the narrowest impacted suites first, then run `bun run test:ci` when execution is available.
- If a change makes a new critical module testable, widen the enforced coverage scope and update `docs/test-coverage.md`.
- Use the `test-coverage` skill for the repo-specific requirements, decisions, completed rollout, and the remaining GitHub branch-protection step.
