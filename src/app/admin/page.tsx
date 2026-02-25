import { getDashboardStats, getRevenueData, getJobsByCategory } from '@/lib/actions/admin'
import { getJobs } from '@/lib/actions/jobs'
import { AdminDashboardClient } from './AdminDashboardClient'

export default async function AdminDashboard() {
  const [statsResult, revenueResult, categoryResult, jobsResult] = await Promise.all([
    getDashboardStats(),
    getRevenueData(),
    getJobsByCategory(),
    getJobs(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const revenueData = revenueResult.success ? revenueResult.data : []
  const jobsByCategory = categoryResult.success ? categoryResult.data : []
  const jobs = jobsResult.success ? jobsResult.data : []

  return (
    <AdminDashboardClient
      stats={stats}
      revenueData={revenueData}
      jobsByCategory={jobsByCategory}
      jobs={jobs}
    />
  )
}
