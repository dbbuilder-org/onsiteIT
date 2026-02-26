'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyContractorProfile } from '@/lib/actions/contractors'
import { getJobs, type JobRow } from '@/lib/actions/jobs'
import { formatCurrency } from '@/lib/utils'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const defaultAvailability = {
  Mon: { available: true, start: '08:00', end: '17:00' },
  Tue: { available: true, start: '08:00', end: '17:00' },
  Wed: { available: true, start: '08:00', end: '15:00' },
  Thu: { available: true, start: '09:00', end: '17:00' },
  Fri: { available: true, start: '08:00', end: '17:00' },
  Sat: { available: false, start: '', end: '' },
  Sun: { available: false, start: '', end: '' },
}

export default function ContractorSchedulePage() {
  const [myJobs, setMyJobs] = useState<JobRow[]>([])
  const [avail, setAvail] = useState(defaultAvailability)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        getJobs({ contractorId: r.data.id }).then(jr => {
          if (jr.success) {
            setMyJobs(jr.data.filter(j => j.status === 'assigned' || j.status === 'in-progress'))
          }
        })
      }
    })
  }, [])

  const toggleDay = (day: string) => {
    setAvail(prev => ({
      ...prev,
      [day]: { ...(prev as any)[day], available: !(prev as any)[day].available }
    }))
    showToast('Availability updated')
  }

  const weekDates = [23, 24, 25, 26, 27, 28, 1].map((d, i) => ({
    day: days[(0 + i) % 7],
    date: d,
    isToday: d === 23 && i < 6,
    isCurrentMonth: i < 6
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-800">My Schedule</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium text-slate-700">Feb 23 - Mar 1, 2026</span>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Weekly calendar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[480px]">
          <div className="grid grid-cols-7 border-b border-slate-100">
            {weekDates.map(({ day, date, isToday }) => (
              <div key={day} className={cn("text-center py-3 border-r border-slate-100 last:border-r-0",
                isToday && "bg-blue-50")}>
                <p className="text-xs text-slate-500">{day}</p>
                <p className={cn("text-sm font-semibold mt-0.5",
                  isToday ? "text-blue-600 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto" : "text-slate-700")}>
                  {date}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-32">
            {weekDates.map(({ day, date, isToday }, i) => {
              const dayJobs = myJobs.filter(j => {
                const d = new Date(j.scheduledDate).getDate()
                return d === date && i < 6
              })
              const avDay = (avail as any)[days[(0 + i) % 7]]
              return (
                <div key={day} className={cn("border-r border-slate-100 last:border-r-0 p-2 min-h-24",
                  isToday && "bg-blue-50/50")}>
                  {avDay?.available && (
                    <div className="bg-green-100 rounded-lg px-2 py-1 mb-2">
                      <p className="text-xs text-green-700 font-medium">{avDay.start}-{avDay.end}</p>
                    </div>
                  )}
                  {dayJobs.map(job => (
                    <div key={job.id} className="bg-orange-100 rounded-lg px-2 py-1.5 mb-1 cursor-pointer hover:bg-orange-200 transition-colors">
                      <p className="text-xs font-semibold text-orange-800 truncate">{job.type}</p>
                      <p className="text-xs text-orange-700">{job.suburb}</p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability toggles */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Weekly Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const avDay = (avail as any)[day]
              return (
                <div key={day} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-8">{day}</span>
                    <button
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "relative inline-flex h-5 w-9 rounded-full transition-colors",
                        avDay?.available ? "bg-green-500" : "bg-slate-200"
                      )}
                    >
                      <span className={cn(
                        "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                        avDay?.available && "translate-x-4"
                      )} />
                    </button>
                  </div>
                  {avDay?.available ? (
                    <div className="flex items-center gap-2">
                      <select className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"
                        defaultValue={avDay.start}>
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span className="text-slate-400 text-sm">to</span>
                      <select className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"
                        defaultValue={avDay.end}>
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Unavailable</span>
                  )}
                </div>
              )
            })}
          </div>
          <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => showToast('Availability saved!')}>
            Save Availability
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming assigned jobs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Upcoming Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myJobs.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No upcoming assignments</p>}
          {myJobs.map(job => (
            <div key={job.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="bg-orange-100 text-orange-600 px-3 py-2 rounded-lg text-center min-w-14">
                <p className="text-sm font-bold">{new Date(job.scheduledDate).getDate()}</p>
                <p className="text-xs">{new Date(job.scheduledDate).toLocaleString('default', { month: 'short' })}</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{job.title}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{job.suburb} •
                  <Clock className="h-3 w-3 ml-1" />{new Date(job.scheduledDate).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{formatCurrency(job.totalAmount)}</p>
                <StatusBadge status={job.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
