# Frontend Test Coverage State

## Original Requirements

The repo coverage rollout was designed around these requirements:

- coverage should be as high as possible
- failing tests should clearly signal what logic changed
- parent-folder GitHub workflows should require tests before deploy and merge
- `docs/test-coverage.md` should document the policy and rollout
- planning and implementation should be detailed enough for mission-critical site use
- refactors are allowed when needed to make critical logic testable

## What We Decided

- The customization should be workspace-shared because the policy is repo-specific and team-facing.
- A skill is needed for discoverable, repeatable coverage workflow guidance.
- A matching workspace instruction is also needed because the requirement applies to ordinary code changes, not only to explicit skill use.
- The frontend test stack is `Vitest + jsdom + React Testing Library + user-event + V8 coverage`.
- Coverage is enforced per file for the gated critical-module set.
- The current enforced thresholds are:
  - statements: `>= 90%`
  - lines: `>= 90%`
  - functions: `>= 90%`
  - branches: `>= 80%`
- Workflow gates must run `bun run test:ci` before frontend CI, deploy, and integration-package steps continue.
- Side-effect-heavy `xpack` modules should be split into testable `*-core.ts` helpers before the logic is considered adequately protected.
- Thresholds, gated scope, or workflow gates must not be weakened without explicit approval.

## What Has Been Done

### Harness And Policy

- Added a standalone frontend Vitest harness in `package.json`, `vitest.config.ts`, and `test/setup.ts`.
- Added the repo coverage document in `docs/test-coverage.md`.
- Added workspace Copilot customization files for coverage governance.

### Critical Runtime And Component Coverage

- Covered `src/_api/avatar.ts`
- Covered `src/_api/contact-form.ts`
- Covered `src/_helpers/handleTheme.ts`
- Covered `src/_helpers/ReactSection.tsx`
- Covered `src/_helpers/RequireCss.tsx`
- Covered `src/_helpers/RequireJs.tsx`
- Covered `src/assets/scripts/main/api.ts`
- Covered `src/assets/scripts/main/functions.ts`
- Covered `src/organisms/contact/contact-form.tsx`

### xpack Core Coverage

- Extracted and covered `xpack/scripts-core.ts`
- Extracted and covered `xpack/prerender-core.ts`
- Extracted and covered `xpack/integration-core.ts`
- Extracted and covered `xpack/styles-core.ts`
- Covered `xpack/filename.ts`
- Covered `xpack/manual-chunk.ts`

### Workflow Gates

- Updated `.github/workflows/frontend-ci.yml`
- Updated `.github/workflows/frontend-deploy.yml`
- Updated `.github/workflows/frontend-integration.yml`
- All three now run `bun run test:ci` before continuing to build, deploy, or integration packaging.

## Current Validated State

Latest implemented validation target:

- `bun run test:ci`

Latest validated outcome at implementation time:

- `15` test files passed
- `72` tests passed
- enforced coverage scope passed with approximately:
  - `96.6%` statements
  - `96.6%` lines
  - `91.05%` branches
  - `100%` functions

## Current Enforced Module Set

- `src/_api/avatar.ts`
- `src/_api/contact-form.ts`
- `src/_helpers/handleTheme.ts`
- `src/_helpers/ReactSection.tsx`
- `src/_helpers/RequireCss.tsx`
- `src/_helpers/RequireJs.tsx`
- `src/assets/scripts/main/api.ts`
- `src/assets/scripts/main/functions.ts`
- `src/organisms/contact/contact-form.tsx`
- `xpack/filename.ts`
- `xpack/integration-core.ts`
- `xpack/manual-chunk.ts`
- `xpack/prerender-core.ts`
- `xpack/scripts-core.ts`
- `xpack/styles-core.ts`

## Working Rule For Future Changes

For any frontend change covered by the workspace instruction:

- preserve or improve coverage for the affected modules
- add tests for every logic, branch, path, error-handling, or workflow behavior change
- run narrow impacted suites first, then run `bun run test:ci`
- update `docs/test-coverage.md` when the enforced scope, thresholds, or workflow policy changes
- widen the gated module set when new critical code becomes testable

## Remaining External Step

Repository files cannot enforce GitHub branch protection by themselves.

The remaining manual or authenticated API step is to require the `Frontend CI / build` check on `master` in GitHub branch protection.

At the time this coverage rollout was implemented, the local environment was not authenticated with `gh`, so that GitHub-side setting could not be applied from the session.
