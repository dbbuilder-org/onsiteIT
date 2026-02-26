'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyCustomerProfile } from '@/lib/actions/customers'
import { getJobs, type JobRow } from '@/lib/actions/jobs'
import { getInvoices, type InvoiceRow } from '@/lib/actions/invoices'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { PlusCircle, CheckCircle, Clock, DollarSign, MapPin, Bell } from 'lucide-react'
import Link from 'next/link'

export default function CustomerDashboard() {
  const { data: session } = useSession()
  const [myJobs, setMyJobs] = useState<JobRow[]>([])
  const [myInvoices, setMyInvoices] = useState<InvoiceRow[]>([])

  useEffect(() => {
    getMyCustomerProfile().then(r => {
      if (r.success) {
        getJobs({ customerId: r.data.id }).then(jr => jr.success && setMyJobs(jr.data))
        getInvoices({ customerId: r.data.id }).then(ir => ir.success && setMyInvoices(ir.data))
      }
    })
  }, [])

  const activeJob = myJobs.find(j => j.status === 'in-progress')
  const totalSpent = myInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)

  const notifications = [
    { text: 'Your technician is on the way to your location', time: '5 min ago', type: 'info' },
    { text: 'Your network setup job has been started', time: '10 min ago', type: 'start' },
    { text: 'Latest invoice has been paid', time: '3 days ago', type: 'success' },
  ]

  const progressSteps = ['Booked', 'Assigned', 'En Route', 'In Progress', 'Completed']
  const currentStep = 3

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome back, {firstName}!</h2>
            <p className="text-blue-200 text-sm">{new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <Link href="/customer/book" className="self-start sm:self-auto">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-semibold">
              <PlusCircle className="h-4 w-4 mr-2" />Book a Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs', value: myJobs.length, icon: Clock, color: 'text-blue-600' },
          { label: 'Completed', value: myJobs.filter(j => j.status === 'completed').length, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), icon: DollarSign, color: 'text-purple-600' },
          { label: 'Active Jobs', value: myJobs.filter(j => j.status === 'in-progress').length, icon: MapPin, color: 'text-orange-500' },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active job tracker */}
      {activeJob && (
        <Card className="border-0 shadow-sm border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-700">Active Job</CardTitle>
              <StatusBadge status="in-progress" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-slate-800 mb-1">{activeJob.title}</p>
            <p className="text-sm text-slate-500 mb-4">Technician: {activeJob.contractorName || 'Assigned'}</p>

            {/* Progress tracker */}
            <div className="relative mb-6">
              <div className="flex justify-between mb-2">
                {progressSteps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      i < currentStep ? 'bg-blue-600 text-white' :
                      i === currentStep ? 'bg-blue-100 text-blue-700 border-2 border-blue-600' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs text-center ${i <= currentStep ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-slate-200 -z-10">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(currentStep / (progressSteps.length - 1)) * 100}%` }} />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium">Your technician is currently working on your job</p>
              <p className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" />{activeJob.address}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent jobs */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-700">Recent Jobs</CardTitle>
              <Link href="/customer/jobs">
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {myJobs.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No jobs yet</p>}
            {myJobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{job.title}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(job.scheduledDate)}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-xl ${
                n.type === 'success' ? 'bg-green-50' : n.type === 'start' ? 'bg-blue-50' : 'bg-orange-50'
              }`}>
                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                  n.type === 'success' ? 'bg-green-500' : n.type === 'start' ? 'bg-blue-500' : 'bg-orange-500'
                }`} />
                <div>
                  <p className="text-sm text-slate-700">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
