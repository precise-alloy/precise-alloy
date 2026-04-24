---
name: test-coverage
description: 'Use when working on test coverage, Vitest thresholds, CI test gates, xpack refactors for testability, workflow enforcement, or reviewing whether a frontend change in PreciseAlloy.Frontend preserves the highest possible coverage. Covers the agreed requirements, current decisions, completed rollout, and the mandatory validation policy for any code change.'
argument-hint: 'Describe the change, touched files, and coverage concern.'
user-invocable: true
---

# Test Coverage Governance

Use this skill for repo-specific coverage work in `PreciseAlloy.Frontend`.

## When To Use

- Adding or changing frontend logic in `src/`
- Refactoring `xpack/` build tooling for testability
- Updating Vitest coverage thresholds or enforced module scope
- Changing frontend CI, deploy, or integration workflow gates
- Reviewing whether a change preserves the highest feasible coverage
- Updating the coverage policy or rollout documentation

## Required Policy

- Any logic change must preserve or improve the highest feasible coverage for the affected modules.
- New branches, new error handling, new path rules, and new CI behavior require matching tests in the same change.
- Do not lower thresholds, narrow the gated module list, or weaken workflow gates without explicit user approval.
- Do not remove or weaken the local `pre-push` typecheck gate installed through `simple-git-hooks` without explicit user approval.
- Prefer extracting testable core helpers from side-effect-heavy `xpack` modules rather than accepting untested logic.
- Treat a change as incomplete until the narrow affected suites and `bun run test:ci` pass when execution is available.

## Procedure

1. Read [the current repo coverage state](./references/current-state.md).
2. Identify whether the change touches a currently gated module or creates a newly testable critical module.
3. Add or update targeted tests so failures point to the changed behavior, not to a broad snapshot diff.
4. If `xpack` code is blocked by top-level side effects, extract a `*-core.ts` helper from the CLI shell first.
5. Run the narrowest impacted suites before widening validation.
6. Run `bun run test:ci` before considering the change complete.
7. If the change expands what can be tested, widen the enforced coverage scope in `vitest.config.ts` and update `docs/test-coverage.md`.
8. If local developer tooling changes, preserve the `simple-git-hooks` `pre-push` gate that runs `bun run typecheck` after install.
9. If the change touches CI or merge rules, verify the frontend workflow files still run `bun run test:ci` before build, deploy, or integration steps.
10. If GitHub branch protection must change, note that repository files are not enough and GitHub authentication/settings are required.

## Expected Outcome

- Tests and coverage updates land in the same change as the logic update.
- Coverage stays at or above the current enforced maximum for affected modules, or moves upward.
- The coverage doc, skill reference, and workflow gates remain aligned with the actual implementation.
