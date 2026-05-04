# Frontend Test Coverage

## Purpose

This repository now has a real automated test gate for the most failure-prone frontend logic that was previously unprotected. The current rollout focuses on modules where silent regressions are expensive:

- runtime URL and API behavior
- asset include helpers used by rendered pages
- contact-form submission and error handling
- xpack script compilation and chunk/file naming rules

The immediate goal is not a vanity repo-wide percentage. The immediate goal is a hard gate around the logic that breaks builds, runtime asset loading, or form submission when changed carelessly.

## Commands

Use these commands locally:

```bash
bun run typecheck
bun run test
bun run test:watch
bun run test:coverage
bun run test:ci
```

`typecheck` runs `tsc --noEmit` and catches interface drift like stale Rolldown or Vite fixture objects before runtime tests even start.

`test:ci` is the command used by GitHub Actions. It now runs type checking before the coverage run, runs on Ubuntu, Windows, and macOS in the parent frontend workflows, and must pass on every OS before the updated CI, deploy, and integration workflows can complete.

After `bun install`, the repo also installs a local `pre-push` hook through `simple-git-hooks` that runs `bun run typecheck` before Git pushes proceed.

## Enforced Coverage Scope

The current hard-threshold gate applies to the following modules:

| Area                    | File                                     | Why it is gated now                                                                                   |
| ----------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| API wrapper             | `src/_api/avatar.ts`                     | Protects endpoint delegation for avatar data                                                          |
| API wrapper             | `src/_api/contact-form.ts`               | Protects endpoint delegation for contact form submission                                              |
| Theme helper            | `src/_helpers/handleTheme.ts`            | Protects localStorage and document theme state                                                        |
| Render helper           | `src/_helpers/ReactSection.tsx`          | Protects JSON payload script output and CSS inclusion                                                 |
| Asset helper            | `src/_helpers/RequireCss.tsx`            | Protects stylesheet path normalization                                                                |
| Asset helper            | `src/_helpers/RequireJs.tsx`             | Protects script path normalization and attributes                                                     |
| Runtime API             | `src/assets/scripts/main/api.ts`         | Protects URL building, HTTP method mapping, body handling, and fallback origin behavior               |
| Runtime helper          | `xpack/scripts/functions.ts`             | Protects `getModifiers`, `viteAbsoluteUrl`, cookies, paging, and numeric formatting                   |
| Mission-critical form   | `src/organisms/contact/contact-form.tsx` | Protects payload mapping, success/failure alerts, and reset behavior                                  |
| xpack output naming     | `xpack/filename.ts`                      | Protects asset, entry, and chunk naming conventions                                                   |
| xpack integration core  | `xpack/integration-core.ts`              | Protects asset copying, hash manifest generation, pattern normalization, and required-file validation |
| xpack chunk naming      | `xpack/manual-chunk.ts`                  | Protects internal entry chunk naming                                                                  |
| xpack prerender core    | `xpack/prerender-core.ts`                | Protects prerender URL building, duplicate asset relocation, and cache-busting rules                  |
| xpack script build core | `xpack/scripts-core.ts`                  | Protects esbuild options, output writes, watch wiring, and error logging                              |
| xpack styles core       | `xpack/styles-core.ts`                   | Protects injected SCSS prelude handling, sourcemap line shifting, and output naming                   |

These files are intentionally enforced with hard thresholds now because they are already covered by explicit tests. The next rollout phases will expand this gate to additional xpack build modules after their side effects are split into testable cores.

## Coverage Thresholds

The enforced thresholds for the gated module set are:

- statements: `>= 100%`
- lines: `>= 100%`
- functions: `>= 100%`
- branches: `>= 95%`
- enforcement mode: per file

This means a single weakly tested critical module fails the build even if the aggregate percentage looks acceptable.

The branches threshold sits at 95% because a single defensive `||` operand in `removeDuplicateAssets` (`attr('defer') === ''`) reports as a partial branch under V8 depending on cheerio's attribute normalization, even though the matching unit test exercises the bare-defer path explicitly. All other gated modules are at 100% across every metric.

## Implemented Test Contracts

### Theme and Rendering Helpers

Current tests protect these rules:

- `handleTheme.ts` must default to light mode when storage is empty.
- `handleTheme.ts` must store the selected theme and update `document.documentElement[data-theme]`.
- `handleTheme.ts` must treat stored `light` values case-insensitively.
- `handleTheme.ts` must toggle light and dark predictably.
- `RequireCss.tsx` must map local component names into `/assets/css/*.css`.
- `RequireCss.tsx` must map vendor assets into `/assets/vendors/*.css`.
- `RequireCss.tsx` must preserve absolute URLs.
- `RequireJs.tsx` must map local component names into `/assets/js/*.js`.
- `RequireJs.tsx` must map vendor assets into `/assets/vendors/*.js`.
- `RequireJs.tsx` must preserve `async`, `defer`, `data-pl-inplace`, and `type` attributes.
- `ReactSection.tsx` must emit JSON script payloads with `data-rct`.
- `ReactSection.tsx` must add one stylesheet per declared CSS dependency.

If one of these helpers changes path rules, removes attributes, or changes the rendered payload shape, the corresponding test fails with the exact contract name.

### Runtime Browser Helpers

Current tests protect these rules:

- `xpack/scripts/functions.ts` must compose classes from base, global modifiers, style modifiers, and theme.
- `xpack/scripts/functions.ts` must preserve absolute URLs in `viteAbsoluteUrl`.
- `xpack/scripts/functions.ts` must normalize relative URLs and append the configured page extension only when requested.
- `xpack/scripts/functions.ts` must support base URLs with and without trailing slashes.
- `xpack/scripts/functions.ts` must read cookies by trimmed key name.
- `xpack/scripts/functions.ts` must generate paging windows correctly at the beginning, middle, end, and short-range cases.
- `xpack/scripts/functions.ts` must reject non-number input in `roundNumber` and format numeric input to the requested precision.
- `api.ts` must build API URLs from `VITE_APP_API_URL` when present.
- `api.ts` must fall back to `window.location.origin` when no API base is configured.
- `api.ts` must serialize only defined query params and stringify booleans.
- `api.ts` must send JSON bodies and headers for body-bearing requests.
- `api.ts` must return the raw response when `skipResponseBody` is true.
- `api.ts` must expose `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` with the expected HTTP methods.
- `api.ts` must reject with the documented wrapped error shape when URL construction fails.

If runtime URL, cookie, or request-building behavior changes, the failure output points at the broken rule rather than just reporting a snapshot diff.

### Contact Form

Current tests protect these rules:

- the form must render only the fields configured by the model
- the submit payload must map field values to `name`, `email`, and `message`
- successful submission must alert the success message and reset the form
- unsuccessful API responses with a message must surface as an `Error`
- rejected API promises must be alerted back to the user
- omitted optional fields must not crash submission

This is the most user-visible mission-critical suite currently enforced.

### xpack Build Helpers

Current tests protect these rules:

- `scripts-core.ts` must disable sourcemaps for `critical` script filenames and use external sourcemaps otherwise
- `scripts-core.ts` must write output into `public/assets/js/<name>.js`
- `scripts-core.ts` must create the output directory when missing
- `scripts-core.ts` must compile every discovered script in batch mode
- `scripts-core.ts` must wire `add`, `change`, and `unlink` handlers in watch mode
- `scripts-core.ts` must log transform errors instead of throwing and stopping the process abruptly
- `filename.ts` must preserve the current hashed and unhashed filename conventions
- `manual-chunk.ts` must keep the current internal entry chunk naming convention
- `prerender-core.ts` must preserve the current hashed-filename detection rule, `VITE_DOMAIN` prefixing, cache-busting eligibility, and duplicate asset relocation behavior
- `prerender-core.ts` must keep `style-base` removal on the root route logic intact
- `integration-core.ts` must preserve asset copy behavior, hash manifest generation, pattern output normalization, and required-file validation without relying on `process.exit`
- `styles-core.ts` must preserve shared `@use` prelude injection, sourcemap prelude stripping, and CSS output naming

If build output naming changes, these tests fail before the change reaches deploy or the backend integration package.

## GitHub Workflow Gate

The parent workflows now run `bun run test:ci` on `ubuntu-latest`, `windows-latest`, and `macos-latest` before continuing:

- `.github/workflows/frontend-ci.yml`
- `.github/workflows/frontend-deploy.yml`
- `.github/workflows/frontend-integration.yml`

This gives four separate protections:

- PR validation fails before merge when the CI workflow runs.
- OS-specific path behavior is checked on Linux, Windows, and macOS before later workflow steps run.
- Static-site deployment cannot continue if tests or coverage fail.
- Integration-package generation cannot continue if tests or coverage fail.

The CI workflow also uploads the `coverage/` folder as a GitHub Actions artifact per OS.

## Required GitHub Setting

Workflow files alone cannot force GitHub branch protection. In repository settings, require the checks from the `Frontend CI` workflow before merging into `master`.

In the GitHub Checks UI these include the cross-platform `Test (ubuntu-latest)`, `Test (windows-latest)`, and `Test (macos-latest)` jobs, plus the Ubuntu `build` job.

Without that repository setting, the PR workflow still fails correctly, but GitHub will not treat it as a mandatory merge gate.

## Copilot Coverage Policy

The repository now also includes workspace Copilot customization for this coverage policy:

- `.github/skills/test-coverage/SKILL.md`
- `.github/instructions/test-coverage.instructions.md`

The skill captures the repo-specific requirements, decisions, completed rollout, and current enforced coverage scope.

The instruction file makes the policy effectively always-on for frontend code, `xpack` tooling, Vitest coverage config, and the parent frontend workflow files, so ordinary code changes are expected to preserve or improve the highest feasible coverage and keep `bun run test:ci` passing.

## Local Review Checklist

Before pushing a change that touches any gated module:

1. Run `bun run test:ci`.
2. Keep the local `pre-push` hook active so `bun run typecheck` blocks stale type drift before the push leaves the machine.
3. If the change touches build tooling, also run the narrow xpack suite first for faster failure feedback.
4. If the change touches the contact form or runtime browser helpers, rerun the specific affected suite before the full coverage run.
5. If the change alters asset naming, paths, or resource URL behavior, verify the failing test names still describe the new contract clearly.

## Next Expansion Phases

The next recommended phases for this rollout are:

1. Finish the remaining `xpack/styles.ts` orchestration surface around Sass importer behavior, PostCSS emission, and watch-mode routing.
2. Extract and test the remaining `xpack/prerender.ts` render-loop and file-write orchestration surface.
3. Extract and test the remaining `xpack/renderer.ts` request-time HTML transform surface.
4. Expand the component-behavior suites across the remaining high-value organisms that own conditional rendering or API-backed behavior.
5. After those phases land, raise thresholds further and widen the enforced module set.

## Why the Gate Is Scoped This Way

A repo-wide global threshold would currently punish untouched template and content files that do not yet have isolated tests, while still failing to tell developers which mission-critical contract actually broke.

The current strategy is stricter where it matters:

- high per-file thresholds
- explicit critical-module list
- tests named after the protected rule
- workflow enforcement at PR, deploy, and integration-package stages

That makes failures actionable now, while leaving a clear path to widen the gate as the remaining xpack modules are refactored into testable units.
