# OnsiteIT — Project Status Report
**Prepared for:** OnsiteIT Client
**Prepared by:** ServiceVision
**Date:** 26 February 2026
**Live URL:** https://onsiteit.servicevision.io

---

## Overview

OnsiteIT is a **Field Service Management (FSM) web application** purpose-built for an Australian IT contracting business. The platform provides three separate, role-based portals — for administrators, contractors, and customers — all running on a single Next.js 16 application with a shared PostgreSQL database backend.

The application has been fully built and is now live at **https://onsiteit.servicevision.io**.

---

## What Has Been Built

### Three Role-Based Portals

#### Admin Portal (`/admin`)
Accessible only to users with the `admin` role. Provides full business oversight:

| Page | What it does |
|------|-------------|
| **Dashboard** | Live KPIs — active jobs, total revenue, jobs by status (Kanban view), jobs by category (donut chart), contractor availability snapshot |
| **Jobs** | Full Kanban board across all statuses (Pending → Assigned → In Progress → Completed → Cancelled). Drag-and-drop status updates with contractor assignment. |
| **Customers** | Searchable customer directory with contact details, address, suburb, join date, and job history count |
| **Contractors** | Contractor directory with skills, service suburbs, hourly rate, availability, rating, and current/completed job counts |
| **Inventory** | Full inventory management — stock levels, minimum stock alerts, unit cost, supplier, SKU |
| **Quotes** | Quote register with line items, customer/contractor assignment, status workflow (Draft → Sent → Accepted → Declined) |
| **Invoices** | Invoice register with GST calculation (10%), subtotal/total, due dates, status workflow (Draft → Sent → Paid → Overdue) |
| **Reports** | Revenue chart (month-by-month bar chart), job category breakdown, contractor performance table |
| **Matching** | AI-driven job request matching — scores available contractors against each open request based on skill match, suburb proximity, availability, and rating |

#### Contractor Portal (`/contractor`)
Accessible only to users with the `contractor` role:

| Page | What it does |
|------|-------------|
| **Dashboard** | Personal stats — current jobs, completed jobs, earnings, rating. Today's schedule preview. |
| **Jobs** | Personal job list filtered to this contractor. Status updates, job notes, parts used. |
| **Schedule** | Weekly calendar view of assigned jobs |
| **Invoices** | Invoices associated with this contractor's completed jobs |
| **Quotes** | Quotes this contractor has been assigned to |
| **Skills & Areas** | Self-service skill management and service suburb selection. Hourly rate update. Changes persist to the database immediately. |
| **Availability** | Weekly availability grid (Mon–Sun, Morning/Afternoon). Changes persist to the database immediately. |
| **Inventory (Van Stock)** | View of inventory items relevant to van loadout |

#### Customer Portal (`/customer`)
Accessible only to users with the `customer` role:

| Page | What it does |
|------|-------------|
| **Dashboard** | Personalised greeting. Summary of open jobs, total spent on paid invoices. |
| **My Jobs** | Job history and status tracking. Open job requests (pre-assignment) shown separately. |
| **Book a Job** | Multi-step service booking wizard — service type, description, address prefill from profile, preferred dates/times, urgency level. Submits to the matching queue. |
| **Profile** | Editable profile — phone, address, suburb, state, postcode, payment method. Name and email are read-only (managed by authentication). |
| **Payment** | Invoice history with paid/unpaid status and amounts |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16.1.6 · React 19 · TypeScript (strict) |
| **UI** | Tailwind CSS v4 · shadcn/ui (Radix UI primitives) · lucide-react icons · Recharts |
| **Auth** | NextAuth.js v5 (beta) · Credentials provider · JWT sessions · Role-based route guards |
| **Database** | PostgreSQL 18 (Render, Oregon region) |
| **ORM** | Prisma v7 with `@prisma/adapter-pg` driver adapter |
| **Server Actions** | Next.js Server Actions for all data mutations — no REST API layer |
| **Deployment** | Vercel (frontend + server functions) |
| **CI/CD** | GitHub Actions → Vercel auto-deploy on every push to `main` |

---

## Infrastructure

### Hosting — Vercel
- **Production URL:** https://onsiteit.servicevision.io
- **Vercel URL (alias):** https://onsite-it.vercel.app
- **Plan:** Hobby (upgradeable to Pro for team collaboration features)
- **Auto-deploy:** Every push to the `main` branch on GitHub triggers a new production deployment. Build time is approximately 30–45 seconds.

### Database — Render (PostgreSQL)
- **Provider:** Render.com
- **Plan:** Basic 256 MB
- **Region:** Oregon, USA
- **PostgreSQL version:** 18
- **Connection:** SSL required (`sslmode=require`)
- **Schema:** 9 tables, 8 enums — fully normalised relational schema

### DNS
- `onsiteit.servicevision.io` → Vercel CDN (CNAME via Name.com)
- SSL certificate managed automatically by Vercel (Let's Encrypt)

### Repository
- **GitHub:** `dbbuilder-org/onsiteIT` (private)
- **Main branch:** `main` (protected — no direct pushes)

---

## Database Schema

### Tables

| Table | Description | Key Fields |
|-------|-------------|-----------|
| `User` | Auth accounts | email (unique), passwordHash, role (admin/contractor/customer), name |
| `ContractorProfile` | Contractor-specific data | phone, ABN, skills[], serviceSuburbs[], hourlyRate, rating, status, availability, joinedDate |
| `CustomerProfile` | Customer-specific data | phone, address, suburb, state, postcode, notes, paymentMethod, joinedDate |
| `Job` | Service jobs | title, type, status, priority, scheduledDate, address, suburb, laborHours, laborRate, partsUsed, totalAmount, notes[] |
| `InventoryItem` | Stock items | name, SKU (unique), category, stock, minStock, unitCost, supplier |
| `Quote` | Service quotes | quoteNumber (unique), lineItems, total, status, expiryDate |
| `Invoice` | Customer invoices | invoiceNumber (unique), lineItems, subtotal, GST, total, dueDate, paidDate |
| `ContractorPay` | Contractor pay periods | period, hoursLogged, jobsCompleted, grossAmount, status, payDate |
| `JobRequest` | Booking requests (pre-matching) | serviceType, description, address, suburb, preferredDates[], preferredTime, priority, status, matchedContractorId |

### Enums

| Enum | Values |
|------|--------|
| `UserRole` | admin, contractor, customer |
| `ContractorStatus` | available, busy, offline |
| `JobStatus` | pending, assigned, in_progress, completed, cancelled |
| `JobPriority` | low, medium, high, urgent |
| `QuoteStatus` | draft, sent, accepted, declined |
| `InvoiceStatus` | draft, sent, paid, overdue |
| `PayStatus` | pending, paid |
| `RequestStatus` | pending, matched, confirmed |

---

## Demo Accounts

All demo accounts use the password: **`password123`**

| Email | Role | Portal |
|-------|------|--------|
| `admin@onsiteit.com` | Admin | https://onsiteit.servicevision.io/admin |
| `tech@onsiteit.com` | Contractor | https://onsiteit.servicevision.io/contractor |
| `customer@email.com` | Customer | https://onsiteit.servicevision.io/customer |

There are **15 user accounts** total in the seeded database:
- 1 admin
- 6 contractor accounts (with varied skills, suburbs, and availability)
- 8 customer accounts

All 15 accounts use `password123`.

---

## Seeded Demo Data

The database is pre-loaded with realistic demo data:

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 15 | 1 admin, 6 contractors, 8 customers |
| Contractor Profiles | 6 | Varied skills, suburbs, hourly rates ($65–$120/hr) |
| Customer Profiles | 8 | NSW addresses across multiple suburbs |
| Jobs | 12 | Mix of statuses — some unassigned, some completed |
| Inventory Items | 18 | IT hardware and consumables |
| Quotes | 5 | Various statuses across the workflow |
| Invoices | 6 | Including paid and outstanding |
| Contractor Pay Periods | 8 | Mix of paid and pending |

---

## Key Workflows

### 1. Customer Books a Job
1. Customer logs in → `/customer/book`
2. Selects service type, describes the issue, confirms address, picks preferred dates/time and urgency
3. Submits → `JobRequest` record created with status `pending`
4. Admin sees the request in `/admin/matching`

### 2. Admin Matches and Assigns
1. Admin opens `/admin/matching`
2. System automatically scores all available contractors against each request (skills match, suburb proximity, current workload, rating)
3. Admin reviews scores and clicks **Assign** on the best match
4. `JobRequest` status → `confirmed`, `Job` record created with status `assigned`, contractor is notified (future: email/push)

### 3. Contractor Completes a Job
1. Contractor logs in → `/contractor/jobs`
2. Views assigned jobs, updates status to `in_progress` when on-site
3. Logs hours, adds parts used, adds job notes
4. Marks job `completed`
5. Admin can then generate an invoice from `/admin/invoices`

### 4. Contractor Updates Availability
1. Contractor → `/contractor/availability`
2. Toggles morning/afternoon slots for each day of the week
3. Saves — changes persist to database immediately, reflected in matching scores in real time

---

## Environment Variables (Vercel)

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgresql://...@render.com/onsiteit?sslmode=require` | Render PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `[32-byte random secret]` | JWT signing key — must never be rotated without re-signing all sessions |
| `NEXTAUTH_URL` | `https://onsiteit.servicevision.io` | Used by NextAuth for callback URL construction |

---

## What Is Not Yet Built

The following items are identified as next-phase work:

### High Priority
| Feature | Notes |
|---------|-------|
| **Customer registration page** (`/register`) | Currently customers must be created manually in the database or by an admin. A self-service sign-up page needs to be added. |
| **Email notifications** | Job assignment, invoice sent, and booking confirmation emails. Recommend Resend or SendGrid. |

### Medium Priority
| Feature | Notes |
|---------|-------|
| **Admin: Create/edit jobs** | Currently jobs are created by the matching workflow. Admins cannot manually create a job from scratch via the UI. |
| **Admin: Create/edit customers and contractors** | Admin can view but not create new accounts via the UI. |
| **Invoice PDF generation** | Invoices display on-screen but cannot be downloaded as PDF. |
| **Quote PDF / email** | Quotes cannot currently be emailed directly to customers. |
| **Contractor push notifications** | New job assignment notifications. |

### Lower Priority
| Feature | Notes |
|---------|-------|
| **Real-time updates** | Job board and matching page currently require a page refresh to see new data. WebSockets or polling could be added. |
| **File attachments** | Photos taken on-site, signed service agreements. |
| **Contractor GPS tracking** | Live location for "en route" status. |
| **Customer ratings** | Post-job customer rating of contractor. |
| **Payroll export** | CSV/PDF export of contractor pay periods for accounting. |

---

## Known Issues / Limitations

| Issue | Detail | Workaround / Resolution |
|-------|--------|------------------------|
| **Render new-instance TLS** | Render PostgreSQL instances provisioned today exhibit a TLS handshake failure that prevents external connections for several hours after creation. Affects macOS psql, Node.js pg, and GitHub Actions. | Database runs on a proven instance (6+ weeks old). No user impact. |
| **mock-data.ts still in repo** | The original mock data file (`src/lib/mock-data.ts`) is no longer imported by any page but still exists in the repository. | Delete when convenient — it has no runtime impact. |
| **GitHub Actions deploy token** | The `VERCEL_TOKEN` secret stored in GitHub Actions is stale. The GitHub Actions deploy workflow fails; however, Vercel's own GitHub integration deploys correctly on every push. | Update `VERCEL_TOKEN` in GitHub repository secrets. |
| **No customer self-registration** | New customers must be added manually to the database. | Build `/register` page (next-phase item). |

---

## Cost Summary (Current)

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Vercel | Hobby | Free |
| Render PostgreSQL | Basic 256 MB | ~$7 USD/month |
| GitHub | Free | Free |
| Name.com DNS | servicevision.io domain | ~$1 USD/month (amortised) |
| **Total** | | **~$8 USD/month** |

> **Note:** If multiple team members need to collaborate on the Vercel dashboard (view deployments, manage env vars, etc.), upgrading to Vercel Pro ($20/month/member) would be required.

---

## How to Access the Live Application

**URL:** https://onsiteit.servicevision.io

Use the demo credentials above, or ask your administrator to create a new account directly in the database. Customer self-registration is on the roadmap for the next development phase.

---

## How Deployments Work

1. A developer pushes code to the `main` branch on GitHub
2. Vercel detects the push via its GitHub integration
3. Vercel builds the application (`prisma generate && next build`)
4. If the build passes, Vercel automatically promotes the new build to production
5. The live site at https://onsiteit.servicevision.io is updated within ~45 seconds
6. Zero downtime — Vercel swaps deployments atomically

No manual steps are required for a standard deployment.

---

*Document generated by ServiceVision · chris@servicevision.net*
*Repository: github.com/dbbuilder-org/onsiteIT*
