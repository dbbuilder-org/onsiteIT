'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/shared/StatsCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { DashboardStats, RevenueMonth, CategoryStat } from '@/lib/actions/admin'
import type { JobRow } from '@/lib/actions/jobs'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
  Briefcase, Users, UserCheck, DollarSign, FileText, Package,
  Clock, MapPin,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

interface Props {
  stats: DashboardStats | null
  revenueData: RevenueMonth[]
  jobsByCategory: CategoryStat[]
  jobs: JobRow[]
}

export function AdminDashboardClient({ stats, revenueData, jobsByCategory, jobs }: Props) {
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  const upcomingJobs = jobs.filter(j => j.status === 'assigned' || j.status === 'pending').slice(0, 4)

  const activityFeed = [
    { time: '11:23 AM', text: 'Alex Thompson started job #J-001', type: 'start' },
    { time: '10:45 AM', text: 'New booking from Michael Brown — Emergency server', type: 'new' },
    { time: '10:12 AM', text: 'Invoice INV-2026-003 sent to Linda Fraser', type: 'invoice' },
    { time: '09:55 AM', text: 'Sophie Lee completed Office 365 setup', type: 'complete' },
    { time: '09:30 AM', text: 'Quote QT-2026-002 accepted by Michael Brown', type: 'quote' },
    { time: '08:50 AM', text: 'Low stock alert: Power Boards (2 remaining)', type: 'alert' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Jobs"
          value={stats?.totalJobs ?? 0}
          subtitle={`${stats?.activeJobs ?? 0} active`}
          icon={Briefcase}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Active Contractors"
          value={stats?.activeContractors ?? 0}
          subtitle="on active jobs"
          icon={UserCheck}
          iconClassName="bg-orange-50"
        />
        <StatsCard
          title="Customers"
          value={stats?.totalCustomers ?? 0}
          subtitle="registered"
          icon={Users}
          iconClassName="bg-purple-50"
        />
        <StatsCard
          title="Revenue (paid)"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          subtitle="from paid invoices"
          icon={DollarSign}
          trend={{ value: 8, positive: true }}
          iconClassName="bg-green-50"
        />
        <StatsCard
          title="Pending Jobs"
          value={stats?.pendingJobs ?? 0}
          subtitle="awaiting assignment"
          icon={FileText}
          iconClassName="bg-yellow-50"
        />
        <StatsCard
          title="Parts in Stock"
          value={143}
          subtitle="3 low stock"
          icon={Package}
          iconClassName="bg-red-50"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: unknown) => formatCurrency(v as number)} />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Jobs by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={jobsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {jobsByCategory.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => `${v}%`} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-semibold text-slate-500 py-3">Job Type</th>
                    <th className="text-left text-xs font-semibold text-slate-500 py-3">Contractor</th>
                    <th className="text-left text-xs font-semibold text-slate-500 py-3">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-500 pr-6 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-slate-800">{job.customerName}</td>
                      <td className="py-3 text-sm text-slate-600">{job.type}</td>
                      <td className="py-3 text-sm text-slate-600">{job.contractorName || <span className="text-slate-400">Unassigned</span>}</td>
                      <td className="py-3"><StatusBadge status={job.status} /></td>
                      <td className="pr-6 py-3 text-sm font-medium text-right">{formatCurrency(job.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      item.type === 'alert'
                        ? 'bg-red-500'
                        : item.type === 'complete'
                        ? 'bg-green-500'
                        : item.type === 'new'
                        ? 'bg-blue-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <div>
                    <p className="text-sm text-slate-700">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming jobs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-700">Upcoming Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge status={job.priority} />
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-2 mb-1">{job.title}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3" />
                  {job.customerName}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3" />
                  {job.suburb}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(job.scheduledDate)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
