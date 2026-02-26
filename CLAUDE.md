# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OnsiteIT is a **Field Service Management (FSM) application** for an Australian IT contracting business. It is a Next.js 16 / React 19 application with a PostgreSQL backend (hosted on Render), Prisma v7 ORM, and NextAuth.js v5 for authentication. All data mutations go through Server Actions.

## Commands

```bash
npm run dev      # Start dev server (Turbopack enabled)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Serve production build

npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma migrate dev       # Run migrations against dev DB
npx prisma db seed           # Seed the database
npx prisma studio            # Open Prisma Studio GUI
```

No test runner is configured yet.

To add shadcn/ui components:
```bash
npx shadcn add <component-name>
```

## Architecture

### Role-Based Routing
The app has three portals under separate route groups, each protected by its own layout:

| Route prefix | Role | Layout file |
|---|---|---|
| `/admin/*` | Admin | `src/app/admin/layout.tsx` |
| `/contractor/*` | Contractor | `src/app/contractor/layout.tsx` |
| `/customer/*` | Customer | `src/app/customer/layout.tsx` |

Each layout is an **async server component** that calls `auth()` from NextAuth and redirects to `/` if the role doesn't match. The root `/` is the login page (`src/app/page.tsx`).

### Auth & State
- **NextAuth.js v5** — configured in `src/lib/auth.ts` with a CredentialsProvider
- JWT session includes `user.id` (User.id), `user.role`, and `user.name`
- Demo accounts: `admin@onsiteit.com`, `tech@onsiteit.com` (contractor), `customer@email.com` — all use `password123`
- **`src/lib/store.ts`** — stripped to sidebar toggle only (no auth state, no data state)
- Session accessed via `useSession()` client-side, `auth()` server-side

### Data Layer
- **PostgreSQL** hosted on Render (free tier)
- **Prisma v7** ORM — schema at `prisma/schema.prisma`
- **`src/lib/db.ts`** — Prisma client singleton using `@prisma/adapter-pg` (required by Prisma 7)
- **`prisma/seed.ts`** — seeds all mock data; run with `npx prisma db seed`
- **`src/lib/mock-data.ts`** — still present but no longer imported by any pages
- **`src/lib/constants.ts`** — `skills[]` and `nswSuburbs[]` (imported by skills/booking pages)

### Server Actions (`src/lib/actions/`)
All actions return `ActionResult<T> = { success: true; data: T } | { success: false; error: string }`.
Every action calls `auth()` and checks session role before touching the DB.

| File | Key exports |
|---|---|
| `auth.ts` | `signUpCustomerAction` |
| `jobs.ts` | `getJobs(filter?)`, `updateJobStatus({jobId, status})`, `assignContractor` |
| `contractors.ts` | `getContractors()`, `getMyContractorProfile()`, `updateContractorProfile({id,...})` |
| `customers.ts` | `getCustomers()`, `getMyCustomerProfile()`, `updateCustomerProfile({id,...})` |
| `admin.ts` | `getDashboardStats()`, `getRevenueData()`, `getJobsByCategory()` |
| `inventory.ts` | `getInventory()`, `updateStock({id, stock})` |
| `quotes.ts` | `getQuotes(filter?)`, `updateQuoteStatus({id, status})` |
| `invoices.ts` | `getInvoices(filter?)`, `updateInvoiceStatus({id, status})` |
| `pay.ts` | `getContractorPay(contractorId?)`, `markPayPaid({id})` |
| `matching.ts` | `getJobRequests(customerId?)`, `submitJobRequest({...})`, `confirmMatch({jobRequestId, contractorId})` |

### Important ID Distinction
- `session.user.id` = **User.id** (the auth user)
- `ContractorProfile.id` / `CustomerProfile.id` are **separate cuid IDs** (not User.id)
- Always call `getMyContractorProfile()` or `getMyCustomerProfile()` first to get the profile ID, then use that for data queries

### Contractor/Customer Page Pattern
```typescript
useEffect(() => {
  getMyContractorProfile().then(r => {
    if (r.success) {
      // use r.data.id (ContractorProfile.id) for subsequent queries
      getJobs({ contractorId: r.data.id }).then(jr => jr.success && setJobs(jr.data))
    }
  })
}, [])
```

### Prisma 7 Notes
- `schema.prisma` must NOT have `url` in the datasource block — URL goes in `prisma.config.ts`
- `db.ts` uses `@prisma/adapter-pg` (PrismaClient constructor requires an adapter in Prisma 7)
- `z.record()` requires two args in newer Zod: `z.record(z.string(), z.array(z.string()))`
- `ZodError` uses `.issues[0].message`, not `.errors[0].message`
- Exclude `prisma/` from `tsconfig.json` to prevent seed.ts being type-checked during build

### Component Structure
```
src/components/
  ui/           # shadcn/ui primitives (never edit directly)
  layout/       # AdminSidebar, ContractorSidebar, CustomerSidebar, Header
  shared/       # StatsCard, StatusBadge (reusable across portals)
```

### UI Stack
- **Tailwind CSS v4** with `@tailwindcss/postcss` — config is in `postcss.config.mjs`, not a separate `tailwind.config.js`
- **shadcn/ui** via Radix UI primitives — `components.json` at root controls configuration
- **Recharts** for charts (revenue, job category donut) on the admin dashboard/reports pages
- **lucide-react** for all icons
- **date-fns** for date formatting

### Conventions
- All pages that use hooks or event handlers must have `'use client'` at the top
- Layouts are async server components (no `'use client'`)
- Status indicators use the `StatusBadge` component (`src/components/shared/StatusBadge.tsx`)
- The `cn()` utility (`src/lib/utils.ts`) is used for conditional class merging (clsx + tailwind-merge)
- Australian context: prices in AUD, GST at 10%, addresses in NSW suburbs, contractors have ABN numbers
- `JobRow.status` uses hyphens (`in-progress`), Prisma enum uses underscores (`in_progress`) — `fromDbStatus()` / `toDbStatus()` in `src/lib/job-status.ts` handles conversion

## Pending Tasks
- None — all initial tasks complete.
