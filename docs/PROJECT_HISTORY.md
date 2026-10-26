# PROJECT_HISTORY — milestone log (append only)

Keep entries short; add one at the end of each meaningful milestone, not after every file edit.

## 2026-10-26 — Kickoff
- Scope fixed to frontend-only localStorage prototype for classroom demo.
- Four roles: customer, seller, admin, shipper.
- Deployment target: Vercel; repository: `shopee-mini-demo`.
- Implementation and validation have not started.

## 2026-10-26 23:50 — Phase 1-4: Complete 4-Role Marketplace Prototype
- Changed: Scaffolded React + Vite + TypeScript + Tailwind CSS application; configured Zustand store with `persist` middleware, schema versioning and initial seed data (4 users, 17 products, categories, vouchers, sample orders with tracking history); implemented Header with DEMO role switcher and reset modal, Footer, ProductCard with image fallback; implemented CartPage with DEMO10 voucher logic, CheckoutPage for COD orders with atomic stock deduction, OrdersPage and OrderDetailPage with 5-step visual tracking; implemented SellerDashboardPage (product creation PENDING, shop overview, order fulfillment), AdminApprovalsPage (approve/reject workflow), ShipperPortalPage (pickup and COD delivery completion), DemoGuidePage with 6-step testing walkthrough, and comprehensive README.md.
- Verified: `npm install` (143 packages), `npm run build` (`tsc -b && vite build` built cleanly with zero errors in 6.17s), node fetch HTTP route checks returned 200 OK on `/`, `/seller`, `/admin`, `/orders`, `/demo-guide`, `/cart`.
- Outstanding: Local visual inspection on `http://localhost:5173/` by the user, and deployment to Vercel when requested.
