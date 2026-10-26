# Antigravity Workspace Rules — Shopee Mini Demo

## Mission and limits
- This is a classroom **interactive prototype**, not a production e-commerce platform.
- Goal: a polished, stable, deployable 4-role shopping demo by 2026-10-27.
- Work inside this repository only. Never edit sibling projects.
- Build the smallest functioning end-to-end experience; prioritize a working flow over page count.
- Stack: Vite, React, TypeScript, Tailwind CSS, React Router, Zustand persist (or similarly simple typed local state), lucide-react.
- Data is seeded and persisted using browser localStorage; no database, real authentication, payment gateways, OAuth, backend, secrets, or API server.
- Present the UI as an educational marketplace demo inspired by Shopee, not as official Shopee. Avoid copying official logos/assets.

## Mandatory start/resume routine
1. Read `docs/PROJECT_STATE.md` and the most recent entries of `docs/PROJECT_HISTORY.md` before new coding or after context reset.
2. Verify existing files and the actual state of the codebase; never infer a feature is complete just because a document says so.
3. Work on the highest-priority incomplete task. Avoid changing working modules without reason.
4. At each completed milestone or before context exhaustion, update `docs/PROJECT_STATE.md` (accurate progress, next action, blockers) and append ONE concise entry to `docs/PROJECT_HISTORY.md` (changes + validation).
5. Summarize the outcome with changed files, verified workflows, run/build status, and next recommended action.

## Engineering rules
- P0 use cases: Seller lists a product -> Admin approves -> Customer can browse and buy COD -> Seller processes order -> Shipper updates delivery -> Customer sees updated tracking.
- Shared single source of truth for products, cart, orders and session, with coherent state transitions and persistence on refresh and role switch.
- Seed realistic Vietnamese demo content and demo accounts; include a Reset Demo Data button with confirmation.
- Use role switcher marked as DEMO ONLY. Do not store passwords or imply secure authentication.
- Customer cannot see pending/rejected products; seller can modify only their own items; admin approval is required for new listings.
- Prevent negative stock, empty checkout, duplicate accidental submit, invalid quantities, NaN totals, and missing-image crashes.
- All primary buttons must have actual actions, proper feedback, disabled states, or explain why unavailable. Never leave fake functional controls.
- Responsive desktop and mobile, Vietnamese copy, VND formatting, consistent orange-themed modern marketplace UI.
- No unnecessary abstraction, giant dependencies, additional docs, SSR, real payment flow, or expensive refactors.
- Keep `npm run build` passing. Fix failures before calling a phase complete. Test browser flows if the tooling permits; do not claim tests were run unless they were.
- Use React Router BrowserRouter and root `vercel.json` SPA rewrite. Vercel output directory `dist`.
- Never delete project files, Git history, or force-push without explicit user approval.
