'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getRevenueData, getJobsByCategory, type RevenueMonth, type CategoryStat } from '@/lib/actions/admin'
import { formatCurrency } from '@/lib/utils'
import { Download, TrendingUp, Briefcase, Users, DollarSign } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const contractorPerf = [
  { name: 'Alex T.', jobs: 87, rating: 4.9, revenue: 8265 },
  { name: 'Ryan G.', jobs: 71, rating: 4.8, revenue: 6745 },
  { name: 'Jessica P.', jobs: 64, rating: 4.8, revenue: 5760 },
  { name: 'Marcus W.', jobs: 52, rating: 4.7, revenue: 5720 },
  { name: 'Sophie L.', jobs: 43, rating: 4.6, revenue: 3655 },
  { name: 'Natalie K.', jobs: 38, rating: 4.5, revenue: 3040 },
]

const acquisitionData = [
  { month: 'Sep', new: 2 },
  { month: 'Oct', new: 3 },
  { month: 'Nov', new: 1 },
  { month: 'Dec', new: 2 },
  { month: 'Jan', new: 4 },
  { month: 'Feb', new: 2 },
]

export default function ReportsPage() {
  const [revenueData, setRevenueData] = useState<RevenueMonth[]>([])
  const [jobsByCategory, setJobsByCategory] = useState<CategoryStat[]>([])

  useEffect(() => {
    getRevenueData().then(r => r.success && setRevenueData(r.data))
    getJobsByCategory().then(r => r.success && setJobsByCategory(r.data))
  }, [])

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Business performance overview</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />Export PDF
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (6mo)', value: formatCurrency(61090), icon: DollarSign, trend: '+22%', pos: true },
          { label: 'Jobs Completed', value: '167', icon: Briefcase, trend: '+18%', pos: true },
          { label: 'Avg Job Value', value: formatCurrency(366), icon: TrendingUp, trend: '+5%', pos: true },
          { label: 'Active Customers', value: '7', icon: Users, trend: '+3', pos: true },
        ].map(kpi => (
          <Card key={kpi.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-blue-600" />
                <span className="text-xs text-green-600 font-medium">{kpi.trend}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Revenue Trend (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => formatCurrency(v as number)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Jobs by Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={jobsByCategory} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {jobsByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Customer Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={acquisitionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="new" fill="#F97316" radius={[4, 4, 0, 0]} name="New Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contractor performance */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Contractor Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Contractor', 'Jobs Completed', 'Rating', 'Revenue Generated', 'Performance'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contractorPerf.map((c, i) => (
                <tr key={c.name} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">#{i + 1}</span>
                      <span className="text-sm font-medium text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{c.jobs}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-yellow-600">★ {c.rating}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{formatCurrency(c.revenue)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-24">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(c.jobs / 90) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{Math.round((c.jobs / 90) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
