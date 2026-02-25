'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyContractorProfile, type ContractorRow } from '@/lib/actions/contractors'
import { getJobs, type JobRow } from '@/lib/actions/jobs'
import { getContractorPay, type PayRow } from '@/lib/actions/pay'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { MapPin, Clock, DollarSign, Briefcase, Star, Play, Square } from 'lucide-react'

export default function ContractorDashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<ContractorRow | null>(null)
  const [myJobs, setMyJobs] = useState<JobRow[]>([])
  const [myPay, setMyPay] = useState<PayRow[]>([])
  const [clockedIn, setClockedIn] = useState(false)
  const [clockTime, setClockTime] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        setProfile(r.data)
        getJobs({ contractorId: r.data.id }).then(jr => jr.success && setMyJobs(jr.data))
        getContractorPay(r.data.id).then(pr => pr.success && setMyPay(pr.data))
      }
    })
  }, [])

  const todayJobs = myJobs.filter(j => j.status === 'in-progress' || j.status === 'assigned')
  const weekEarnings = myPay.filter(p => p.period.includes('Feb 16')).reduce((s, p) => s + p.grossAmount, 0)
  const monthEarnings = myPay.reduce((s, p) => s + p.grossAmount, 0)

  const handleClock = () => {
    if (!clockedIn) {
      const now = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
      setClockTime(now)
      setClockedIn(true)
      showToast('Clocked in successfully!')
    } else {
      setClockedIn(false)
      showToast('Clocked out. Have a great day!')
    }
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  const activity = [
    { time: '09:00', text: 'Started job: Office 365 Setup', type: 'start' },
    { time: '08:45', text: 'Arrived at 55 George Street, Sydney CBD', type: 'arrive' },
    { time: '08:30', text: 'Accepted job: Office 365 Setup & Email Migration', type: 'accept' },
    { time: 'Yesterday', text: 'Completed: Printer Network Setup at Chatswood', type: 'complete' },
    { time: 'Yesterday', text: 'Invoice #INV-2026-005 generated', type: 'invoice' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      {/* Welcome + clock */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Good morning, {firstName}!</h2>
            <p className="text-slate-300 text-sm">{new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            {clockedIn && <p className="text-orange-400 text-sm mt-1">Clocked in since {clockTime}</p>}
          </div>
          <Button
            onClick={handleClock}
            className={`${clockedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white border-0 px-6 py-3 h-auto`}
          >
            {clockedIn ? <><Square className="h-4 w-4 mr-2" />Clock Out</> : <><Play className="h-4 w-4 mr-2" />Clock In</>}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-slate-500">Active Jobs</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{todayJobs.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-xs text-slate-500">This Week</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(weekEarnings)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-slate-500">This Month</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(monthEarnings)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-slate-500">Rating</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{profile?.rating ?? '—'} ★</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's jobs */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Today's Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayJobs.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No jobs today</p>}
            {todayJobs.map(job => (
              <div key={job.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-slate-800 text-sm">{job.title}</p>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3" />{job.address}
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />{formatDateTime(job.scheduledDate)}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-7">
                    Start Job
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    Navigate
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    item.type === 'complete' ? 'bg-green-500' :
                    item.type === 'start' ? 'bg-orange-500' :
                    item.type === 'arrive' ? 'bg-blue-500' :
                    'bg-slate-400'
                  }`} />
                  <div>
                    <p className="text-sm text-slate-700">{item.text}</p>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map placeholder */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            Today's Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <MapPin className="h-10 w-10 mx-auto mb-2" />
              <p className="text-sm font-medium">Interactive Map</p>
              <p className="text-xs">Google Maps integration placeholder</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
