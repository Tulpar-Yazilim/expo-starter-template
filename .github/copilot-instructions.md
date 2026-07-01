# Copilot instructions for this repository

Purpose: concise, actionable guidance for Copilot-style assistants working in this repo.

---

Quick commands (yarn):
- Start (expo): `yarn start` (default uses EXPO_NO_DOTENV=1)
- Start for env: `yarn start:development|qa|staging|production`
- Run on device/emulator: `yarn ios`, `yarn android`, `yarn web`
- Build (EAS): `yarn build:<env>:ios|android|web` (e.g. `yarn build:development:ios`)
- Prebuild/native: `yarn prebuild`, `yarn prebuild:<env>`
- Lint: `yarn lint` (ESLint)
- Type check: `yarn type-check` (tsc --noemit)
- Translations lint & fix: `yarn lint:translations` (JSON key sorting)
- Test (Jest): `yarn test`; watch: `yarn test:watch`
- Run a single test file/pattern: `yarn test --testPathPattern="<path-or-pattern>"` (example: `yarn test --testPathPattern="src/lib/utils"`)
- CI coverage: `yarn test:ci`
- Full checks (lint + type + translations + tests): `yarn check-all`
- E2E (Maestro): `yarn e2e-test` (uses .maestro/ and APP_ID env)

---

High-level architecture (big picture):
- Expo + expo-router drives the app. File-based routes live in `app/` and are split into public routes and an authenticated `(app)/` group. Layouts (`app/_layout.tsx`, `app/(app)/_layout.tsx`) handle gating.
- Source root: `src/`
  - `src/api/` — axios client + React Query hooks (client in `src/api/common/client.ts`)
  - `src/components/` — shared UI; primitives under `src/components/ui/` (use these, not raw RN primitives)
  - `src/lib/` — env wrapper (`src/lib/env.js`), hooks, providers, stores, test-utils, and utilities
  - `src/lib/stores/` — Zustand stores persisted with MMKV (auth-store, app-store)
  - `src/translations/` — i18next JSON resources (keys must be sorted)
- State & data: Zustand + react-native-mmkv for persistence; data fetching via axios + @tanstack/react-query.
- Styling: NativeWind (Tailwind for RN). Theme/colors in `tailwind.config.js`. Prefer `className` on primitives.
- Environment: `.env.<environment>` files (not committed). Root `env.js` validates with Zod. Important: do NOT import root `env.js` from inside `src/` — use `@env` / `src/lib/env.js`.

---

Key repository conventions (non-obvious / automation-relevant):
- File/directory naming: kebab-case.
- Prefer named exports across modules (avoid default exports).
- Types over interfaces; avoid enums — use `const` objects with `as const`.
- No `any`. Explicit return types on functions.
- Small functions: max 3 params; max ~70 lines per function; max ~120 lines per component (enforced by lint rules).
- Use `createSelectors` (from `src/lib/utils.ts`) when creating Zustand stores — it generates `useX.use.<selector>()` hooks by convention.
- Import UI primitives from `@/components/ui` rather than raw RN primitives to keep styling consistent.
- Translation JSON keys must stay sorted (lint enforces this). Use `yarn lint:translations` to auto-fix where possible.
- Add new native-compatible packages with: `npx expo install <package>` to keep Expo SDK compatibility.
- Git hooks: Husky + commitlint enforced. Pre-commit runs `tsc --noemit` and ESLint; commit-msg must follow Conventional Commits.
- Use `yarn` as package manager (preinstall script enforces only-allow yarn).

---

Assistant / tooling pointers:
- CLAUDE.md (project root) contains an extended guide and many of the architecture/convention notes — consult it for contextual details.
- Cursor rules present under `.cursor/` and `.cursor/rules/` — they contain project-specific lint/rule guidance for assistants. Use them if available.
- E2E automation: `.maestro/` contains Maestro flows; `yarn e2e-test` runs those.

---

Files to consult first when answering code changes or CI questions:
- `package.json` (scripts, deps)
- `CLAUDE.md` (architecture & conventions)
- `app/_layout.tsx`, `app/(app)/_layout.tsx` (routing & auth gating)
- `src/lib/env.js` and `app.config.ts` (env handling)
- `src/lib/stores/*` (Zustand + MMKV patterns)
- `src/api/common/client.ts` (axios config + interceptors)

---

When proposing code changes, ensure:
- Don't import root env.js into `src/` — use `@env` wrapper
- Keep translation keys sorted if touching `src/translations/*` (run `yarn lint:translations`)
- Run `yarn lint` and `yarn type-check` locally; pre-commit will also run them

---

If you plan CI/automation changes: reference existing GitHub workflows (in `.github/workflows/`) and EAS profiles in `eas.json` before adding new build steps.

---

Where this file came from: condensed from README.md and CLAUDE.md plus package.json scripts and repository layout.

If you'd like, configure MCP servers next (mobile e2e/hosted runners such as Maestro or device-cloud integrations). Reply "Yes - configure MCP servers" to start, or say "No" to skip.

Summary: created .github/copilot-instructions.md with build/test/lint commands, high-level architecture, and key conventions. Want any adjustments or extra coverage for specific areas (CI, release, docs)?
