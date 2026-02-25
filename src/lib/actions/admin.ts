'use server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  pendingJobs: number
  completedJobs: number
  totalRevenue: number
  pendingRevenue: number
  totalCustomers: number
  activeContractors: number
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  try {
    const [
      totalJobs,
      activeJobs,
      pendingJobs,
      completedJobs,
      paidRevenue,
      pendingRevenue,
      totalCustomers,
      activeContractors,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: { in: ['assigned', 'in_progress'] } } }),
      prisma.job.count({ where: { status: 'pending' } }),
      prisma.job.count({ where: { status: 'completed' } }),
      prisma.invoice.aggregate({
        where: { status: 'paid' },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: { status: { in: ['sent', 'overdue'] } },
        _sum: { total: true },
      }),
      prisma.customerProfile.count(),
      prisma.contractorProfile.count({ where: { status: { in: ['available', 'busy'] } } }),
    ])

    return ok({
      totalJobs,
      activeJobs,
      pendingJobs,
      completedJobs,
      totalRevenue: paidRevenue._sum.total ?? 0,
      pendingRevenue: pendingRevenue._sum.total ?? 0,
      totalCustomers,
      activeContractors,
    })
  } catch {
    return err('Database error')
  }
}

export interface RevenueMonth {
  month: string
  revenue: number
  jobs: number
}

export async function getRevenueData(): Promise<ActionResult<RevenueMonth[]>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  // Return hardcoded chart data (would be derived from real invoices in production)
  return ok([
    { month: 'Sep', revenue: 8200, jobs: 22 },
    { month: 'Oct', revenue: 11400, jobs: 31 },
    { month: 'Nov', revenue: 9800, jobs: 27 },
    { month: 'Dec', revenue: 7200, jobs: 20 },
    { month: 'Jan', revenue: 13600, jobs: 38 },
    { month: 'Feb', revenue: 10890, jobs: 29 },
  ])
}

export interface CategoryStat {
  name: string
  value: number
  color: string
}

export async function getJobsByCategory(): Promise<ActionResult<CategoryStat[]>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  return ok([
    { name: 'Networking', value: 28, color: '#2563EB' },
    { name: 'Hardware Repair', value: 22, color: '#F97316' },
    { name: 'Server Setup', value: 18, color: '#10B981' },
    { name: 'CCTV/Security', value: 12, color: '#8B5CF6' },
    { name: 'Virus Removal', value: 10, color: '#EF4444' },
    { name: 'Other', value: 10, color: '#6B7280' },
  ])
}
