'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMyCustomerProfile } from '@/lib/actions/customers'
import { submitJobRequest } from '@/lib/actions/matching'
import type { TimeWindow } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Wifi,
  Server,
  Camera,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

const steps = ['Service Type', 'Issue Details', 'Date & Time', 'Address', 'Review']

const serviceCategories = [
  {
    name: 'Computer & Laptop',
    icon: Monitor,
    services: ['Computer Repair', 'Laptop Repair', 'Screen Replacement', 'Hardware Upgrade'],
  },
  {
    name: 'Networking',
    icon: Wifi,
    services: ['Network Setup', 'WiFi Installation', 'Printer Setup'],
  },
  {
    name: 'Software & Security',
    icon: ShieldCheck,
    services: [
      'Virus/Malware Removal',
      'Software Installation',
      'Office 365 Setup',
      'Email Configuration',
    ],
  },
  {
    name: 'Server & Cloud',
    icon: Server,
    services: ['Server Setup', 'Cloud Migration', 'Data Recovery'],
  },
  {
    name: 'Security & CCTV',
    icon: Camera,
    services: ['CCTV Installation', 'Smart Home Setup'],
  },
]

const TIME_OPTIONS: { value: TimeWindow | 'any'; label: string; hours: string }[] = [
  { value: 'morning', label: 'Morning', hours: '8am – 12pm' },
  { value: 'afternoon', label: 'Afternoon', hours: '12pm – 5pm' },
  { value: 'evening', label: 'Evening', hours: '5pm – 9pm' },
  { value: 'any', label: 'Any Time', hours: 'Flexible' },
]

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildDateOptions(): { iso: string; day: string; date: string; month: string }[] {
  const result = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    const iso =
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0')
    result.push({ iso, day: DAY_ABBR[d.getDay()], date: String(d.getDate()), month: MONTH_ABBR[d.getMonth()] })
  }
  return result
}

export default function BookingPage() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [dateOptions, setDateOptions] = useState<ReturnType<typeof buildDateOptions>>([])
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState({
    serviceType: '',
    description: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'emergency',
    preferredDates: [] as string[],
    preferredTime: 'any' as TimeWindow | 'any',
    address: '',
    suburb: '',
    state: 'NSW',
    postcode: '',
    notes: '',
  })
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null)

  // Build date options client-side to avoid hydration mismatch
  useEffect(() => {
    setDateOptions(buildDateOptions())
  }, [])

  // Pre-fill address from customer profile
  useEffect(() => {
    getMyCustomerProfile().then(r => {
      if (r.success) {
        setProfileId(r.data.id)
        if (r.data.address) {
          setBooking(prev => ({
            ...prev,
            address: r.data.address,
            suburb: r.data.suburb,
            state: r.data.state || 'NSW',
            postcode: r.data.postcode,
          }))
        }
      }
    })
  }, [])

  const handleNext = () => { if (step < steps.length - 1) setStep(s => s + 1) }
  const handleBack = () => { if (step > 0) setStep(s => s - 1) }

  const toggleDate = (iso: string) => {
    setBooking(prev => {
      const selected = prev.preferredDates
      if (selected.includes(iso)) return { ...prev, preferredDates: selected.filter(d => d !== iso) }
      if (selected.length >= 5) return prev
      return { ...prev, preferredDates: [...selected, iso] }
    })
  }

  const handleSubmit = async () => {
    if (!profileId) return
    const result = await submitJobRequest({
      customerId: profileId,
      serviceType: booking.serviceType,
      description: booking.description || booking.serviceType,
      address: `${booking.address}, ${booking.suburb} ${booking.state} ${booking.postcode}`.trim(),
      suburb: booking.suburb,
      preferredDates: booking.preferredDates,
      preferredTime: booking.preferredTime,
      priority: booking.urgency,
    })
    if (result.success) {
      setSubmittedJobId(result.data.id.slice(0, 8).toUpperCase())
    }
  }

  if (submittedJobId) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h2>
        <p className="text-slate-500 mb-2">
          Your service request has been submitted and is pending technician matching.
        </p>
        <p className="text-sm font-mono bg-slate-100 inline-block px-3 py-1 rounded-lg text-slate-700 mb-6">
          Job #{submittedJobId}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/customer/jobs">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
              View my jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSubmittedJobId(null)
              setStep(0)
              setBooking(prev => ({
                ...prev,
                serviceType: '',
                description: '',
                urgency: 'normal',
                preferredDates: [],
                preferredTime: 'any',
                notes: '',
              }))
            }}
          >
            Book another service
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Book a Service</h2>
        <p className="text-sm text-slate-500">
          Step {step + 1} of {steps.length}: {steps[step]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {steps.map((s, i) => (
          <div key={s} className={cn('h-1.5 flex-1 rounded-full transition-all', i <= step ? 'bg-blue-600' : 'bg-slate-200')} />
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {/* Step 1: Service Type */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 mb-4">What do you need help with?</h3>
              <div className="space-y-3">
                {serviceCategories.map(cat => (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2 mb-2">
                      <cat.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-600">{cat.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-6">
                      {cat.services.map(service => (
                        <button
                          key={service}
                          onClick={() => setBooking(prev => ({ ...prev, serviceType: service }))}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-sm border transition-all',
                            booking.serviceType === service
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                          )}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Describe your issue</h3>
              <div>
                <Label className="text-sm font-medium">Issue Description</Label>
                <textarea
                  className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please describe the problem in detail. What's happening? When did it start?"
                  value={booking.description}
                  onChange={e => setBooking(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Urgency</Label>
                <div className="flex gap-3 mt-2">
                  {[
                    { key: 'normal', label: 'Normal', desc: '2-3 business days' },
                    { key: 'urgent', label: 'Urgent', desc: 'Same day' },
                    { key: 'emergency', label: 'Emergency', desc: 'Within 2 hours' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setBooking(prev => ({ ...prev, urgency: opt.key as 'normal' | 'urgent' | 'emergency' }))}
                      className={cn(
                        'flex-1 p-3 rounded-xl border-2 text-center transition-all',
                        booking.urgency === opt.key
                          ? opt.key === 'emergency' ? 'border-red-400 bg-red-50 text-red-700'
                          : opt.key === 'urgent' ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs mt-0.5 opacity-75">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-slate-800">Choose preferred dates and time</h3>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    Preferred Dates
                  </Label>
                  <span className="text-xs text-slate-500">{booking.preferredDates.length}/5 selected</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {dateOptions.map(d => {
                    const selected = booking.preferredDates.includes(d.iso)
                    const atMax = booking.preferredDates.length >= 5 && !selected
                    return (
                      <button
                        key={d.iso}
                        onClick={() => !atMax && toggleDate(d.iso)}
                        disabled={atMax}
                        className={cn(
                          'flex flex-col items-center p-1.5 rounded-lg text-xs transition-all border',
                          selected ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : atMax ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                        )}
                      >
                        <span className="font-medium">{d.day}</span>
                        <span className="text-base font-bold leading-none">{d.date}</span>
                        <span className="opacity-70">{d.month}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Select up to 5 preferred dates (we'll try to match one of them)</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Preferred Time</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {TIME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setBooking(prev => ({ ...prev, preferredTime: opt.value }))}
                      className={cn(
                        'p-3 rounded-xl border text-sm font-medium transition-all',
                        booking.preferredTime === opt.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      )}
                    >
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-xs opacity-75 mt-0.5">{opt.hours}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Address */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Confirm your address</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Street Address', key: 'address', col: 'col-span-2' },
                  { label: 'Suburb', key: 'suburb', col: '' },
                  { label: 'State', key: 'state', col: '' },
                  { label: 'Postcode', key: 'postcode', col: '' },
                ].map(f => (
                  <div key={f.key} className={f.col}>
                    <Label className="text-sm font-medium">{f.label}</Label>
                    <Input
                      className="mt-1"
                      value={(booking as unknown as Record<string, string>)[f.key]}
                      onChange={e => setBooking(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-sm font-medium">Additional Notes (optional)</Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Ring doorbell, park in driveway, etc."
                  value={booking.notes}
                  onChange={e => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Review your booking</h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Service', value: booking.serviceType },
                  { label: 'Urgency', value: booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1) },
                  { label: 'Description', value: booking.description || 'Not provided' },
                  { label: 'Preferred Dates', value: booking.preferredDates.length > 0 ? booking.preferredDates.join(', ') : 'None selected' },
                  { label: 'Preferred Time', value: TIME_OPTIONS.find(t => t.value === booking.preferredTime)?.label ?? 'Any' },
                  { label: 'Address', value: `${booking.address}, ${booking.suburb} ${booking.state} ${booking.postcode}`.trim() },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">{item.label}</span>
                    <span className="text-slate-800 text-right max-w-xs">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">Estimated pricing</p>
                <p>Labor: $85–$140/hr depending on technician and urgency</p>
                <p>Parts will be quoted separately if needed</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleNext}
            disabled={(step === 0 && !booking.serviceType) || (step === 2 && booking.preferredDates.length === 0)}
          >
            Next<ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit}>
            <CheckCircle className="h-4 w-4 mr-2" />Submit Request
          </Button>
        )}
      </div>
    </div>
  )
}
