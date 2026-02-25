'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getMyContractorProfile, updateContractorProfile } from '@/lib/actions/contractors'
import type { WeeklyAvailability, TimeWindow, DayKey } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle } from 'lucide-react'

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
]

const WINDOWS: { key: TimeWindow; label: string; hours: string }[] = [
  { key: 'morning', label: 'Morning', hours: '8am – 12pm' },
  { key: 'afternoon', label: 'Afternoon', hours: '12pm – 5pm' },
  { key: 'evening', label: 'Evening', hours: '5pm – 9pm' },
]

function emptyAvailability(): WeeklyAvailability {
  return { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }
}

export default function ContractorAvailabilityPage() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [availability, setAvailability] = useState<WeeklyAvailability>(emptyAvailability)
  const [toast, setToast] = useState('')

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        setProfileId(r.data.id)
        setAvailability(r.data.availability as unknown as WeeklyAvailability)
      }
    })
  }, [])

  const toggleSlot = (day: DayKey, window: TimeWindow) => {
    setAvailability(prev => {
      const dayWindows = prev[day]
      const hasWindow = dayWindows.includes(window)
      return {
        ...prev,
        [day]: hasWindow ? dayWindows.filter(w => w !== window) : [...dayWindows, window],
      }
    })
  }

  const isActive = (day: DayKey, window: TimeWindow) => availability[day].includes(window)

  const totalSlots = Object.values(availability).reduce((sum, day) => sum + day.length, 0)

  const handleSave = async () => {
    if (!profileId) return
    const result = await updateContractorProfile({ id: profileId, availability })
    if (result.success) {
      setToast('Availability saved!')
      setTimeout(() => setToast(''), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Weekly Availability</h2>
          <p className="text-sm text-slate-500">
            {totalSlots} slot{totalSlots !== 1 ? 's' : ''} selected • Click a cell to toggle
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-600">
            Set the time windows when you're available to take jobs each week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-32 p-3 text-left text-xs font-semibold text-slate-500 bg-slate-50" />
                  {DAYS.map(day => (
                    <th
                      key={day.key}
                      className="p-3 text-center text-xs font-semibold text-slate-600 bg-slate-50"
                    >
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WINDOWS.map(win => (
                  <tr key={win.key} className="border-t border-slate-100">
                    <td className="p-3 bg-slate-50 border-r border-slate-100">
                      <p className="text-xs font-semibold text-slate-700">{win.label}</p>
                      <p className="text-xs text-slate-400">{win.hours}</p>
                    </td>
                    {DAYS.map(day => {
                      const active = isActive(day.key, win.key)
                      return (
                        <td key={day.key} className="p-2 text-center">
                          <button
                            onClick={() => toggleSlot(day.key, win.key)}
                            className={cn(
                              'w-full h-10 rounded-lg text-xs font-medium transition-all',
                              active
                                ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            )}
                          >
                            {active ? '✓' : '—'}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-6">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
          Save Availability
        </Button>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-slate-200" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">How availability affects matching</p>
          <p className="text-xs text-blue-700">
            When a customer submits a job request with preferred dates, the system checks your
            availability for those days and time windows. Higher availability alignment means
            a higher match score and more job assignments.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
