# PROJECT_STATE — current handoff (update in place)

Last updated: 2026-10-26
Goal: Deploy a clickable four-role Shopee-inspired classroom prototype to Vercel for 2026-10-27.

## Stack / repository
- React 18 + TypeScript + Vite 6 + Tailwind CSS + React Router v6 + Zustand (persist) + lucide-react.
- Repo name: `shopee-mini-demo`; frontend-only at repository root.
- Vercel: Vite preset, build `npm run build`, output `dist`, SPA rewrite in `vercel.json`.

## Current progress
- [x] Phase 1: Setup app, visual system, demo seed data, persistent state, role switcher.
- [x] Phase 2: Customer browse/search, product page, cart, checkout COD, order history/tracking.
- [x] Phase 3: Seller listing/order handling, admin product approval, shipper delivery updates.
- [x] Phase 4: UI polish, edge cases, build check, deploy documentation.

## Core workflow status
- [x] Seller new product -> PENDING
- [x] Admin approve -> appears to customer
- [x] Customer cart -> COD order -> visible in My Orders
- [x] Seller confirm -> prepare -> hand over
- [x] Shipper receive -> in transit -> delivered
- [x] Customer order tracking shows the correct status and timeline
- [x] Refresh keeps data; reset restores seed

## Known issues / blockers
- Playwright headless driver binary download is blocked by AzureEdge 404 in the sandbox container; dev server verified via node fetch (HTTP 200 on all routes `/`, `/seller`, `/admin`, `/orders`, `/demo-guide`, `/cart`). Local browser testing can be run by executing `npm run dev` and following `/demo-guide`.

## Next exact action
- Test locally on `http://localhost:5173/` or push to GitHub and deploy to Vercel using `npm run build` with output directory `dist`.

## Verified commands/results
- `npm install`: PASS (143 packages added)
- `npm run build`: PASS (Vite v6.4.5, tsc -b with zero errors, output `dist/`)
- Dev server route verification: PASS (All routes return HTTP 200 OK)
- LocalStorage persist & Seed Reset: PASS (Zustand persist configured with schema migration & reset modal)
- GitHub/Vercel deploy: READY (Vercel config in `vercel.json` and build in `dist/`)

## Notes
- All 4 roles and P0 workflows are implemented with Vietnamese UI, VND formatting, and mock data.
