'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getMyCustomerProfile } from '@/lib/actions/customers'
import { getJobs, type JobRow } from '@/lib/actions/jobs'
import { getJobRequests, type JobRequestRow } from '@/lib/actions/matching'
import type { JobRequest } from '@/lib/types'
import { formatCurrency, formatDateTime, formatDate } from '@/lib/utils'
import { Star, Package, User, MapPin, Clock, Shield, CheckCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const progressSteps = ['Booked', 'Assigned', 'En Route', 'In Progress', 'Completed']
const statusToStep: Record<string, number> = {
  pending: 0,
  assigned: 1,
  'in-progress': 3,
  completed: 4,
  cancelled: -1,
}

const REQUEST_STATUS_CONFIG: Record<
  JobRequest['status'],
  { label: string; className: string }
> = {
  pending: { label: 'Pending Match', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  matched: { label: 'Matched', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 border-green-200' },
}

export default function CustomerJobsPage() {
  const [myJobs, setMyJobs] = useState<JobRow[]>([])
  const [myRequests, setMyRequests] = useState<JobRequestRow[]>([])
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    getMyCustomerProfile().then(r => {
      if (r.success) {
        getJobs({ customerId: r.data.id }).then(jr => jr.success && setMyJobs(jr.data))
        getJobRequests(r.data.id).then(rr => rr.success && setMyRequests(rr.data))
      }
    })
  }, [])

  const activeJobs = myJobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled')
  const pastJobs = myJobs.filter(j => j.status === 'completed')

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">My Jobs</h2>
        <Link href="/customer/book">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
            + Book a Service
          </Button>
        </Link>
      </div>

      {/* Job requests */}
      {myRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            My Service Requests
          </h3>
          <div className="space-y-3">
            {myRequests.map(req => {
              const config = REQUEST_STATUS_CONFIG[req.status as JobRequest['status']] ?? REQUEST_STATUS_CONFIG.pending
              return (
                <Card
                  key={req.id}
                  className={cn(
                    'border-0 shadow-sm border-l-4',
                    req.status === 'confirmed'
                      ? 'border-l-green-500'
                      : req.status === 'matched'
                      ? 'border-l-blue-500'
                      : 'border-l-orange-400'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800">{req.serviceType}</p>
                          <Badge className={cn('text-xs border px-2 py-0.5 font-medium', config.className)}>
                            {config.label}
                          </Badge>
                          {req.priority !== 'normal' && (
                            <Badge className={cn(
                              'text-xs border px-2 py-0.5 font-medium',
                              req.priority === 'emergency'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-orange-100 text-orange-700 border-orange-200'
                            )}>
                              {req.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {req.suburb}
                        </p>
                        {req.description && (
                          <p className="text-xs text-slate-400 mt-1 truncate">{req.description}</p>
                        )}
                        {req.preferredDates.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {req.preferredDates.length} preferred date{req.preferredDates.length !== 1 ? 's' : ''}
                            {req.preferredTime !== 'any' && ` • ${req.preferredTime}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {req.status === 'confirmed' && req.matchedContractorName && (
                      <div className="mt-3 bg-green-50 rounded-lg p-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">{req.matchedContractorName}</p>
                          <p className="text-xs text-green-600">Your assigned technician</p>
                        </div>
                      </div>
                    )}

                    {req.status === 'pending' && (
                      <p className="mt-2 text-xs text-slate-400">
                        Waiting for admin to match a technician…
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      Submitted {new Date(req.createdAt).toLocaleDateString('en-AU')}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {myRequests.length === 0 && myJobs.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-7 w-7 text-blue-600" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">No jobs yet</p>
            <p className="text-sm text-slate-400 mb-4">
              Book your first IT service and a technician will be matched to you.
            </p>
            <Link href="/customer/book">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Book a Service</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Active jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Active Jobs</h3>
          <div className="space-y-4">
            {activeJobs.map(job => {
              const step = statusToStep[job.status] || 0
              return (
                <Card
                  key={job.id}
                  className="border-0 shadow-sm border-l-4 border-l-blue-600 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-800">{job.title}</p>
                        <p className="text-sm text-slate-500">{job.contractorName || 'Awaiting assignment'}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="relative mt-4 mb-2">
                      <div className="flex justify-between">
                        {progressSteps.map((s, i) => (
                          <div key={s} className="flex flex-col items-center flex-1">
                            <div className={cn(
                              'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mb-1',
                              i < step ? 'bg-blue-600 text-white' :
                              i === step ? 'bg-blue-100 text-blue-700 border-2 border-blue-600 ring-2 ring-blue-200' :
                              'bg-slate-100 text-slate-400'
                            )}>
                              {i < step ? '✓' : i + 1}
                            </div>
                            <span className={cn('text-xs text-center hidden sm:block', i <= step ? 'text-blue-600' : 'text-slate-400')}>
                              {s}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-200 -z-10">
                        <div className="h-full bg-blue-600 transition-all" style={{ width: `${(step / (progressSteps.length - 1)) * 100}%` }} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-3">
                      <Clock className="h-3 w-3" />{formatDateTime(job.scheduledDate)}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Past jobs */}
      {pastJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Job History</h3>
          <div className="space-y-3">
            {pastJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{job.title}</p>
                    <p className="text-sm text-slate-500">
                      {job.contractorName} • {formatDate(job.completedDate || job.scheduledDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{formatCurrency(job.totalAmount)}</p>
                    <StatusBadge status={job.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-slate-500">Rate this job:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={e => { e.stopPropagation(); setRatings(prev => ({ ...prev, [job.id]: star })); showToast('Thank you for your rating!') }}>
                        <Star className={cn('h-4 w-4 transition-colors', star <= (ratings[job.id] || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300')} />
                      </button>
                    ))}
                  </div>
                  {ratings[job.id] && <span className="text-xs text-green-600 font-medium">Rated!</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job detail dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <StatusBadge status={selectedJob.status} />
                <StatusBadge status={selectedJob.priority} />
              </div>
              {selectedJob.contractorName && (
                <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedJob.contractorName}</p>
                    <p className="text-xs text-slate-500">Your assigned technician</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Service Type</p>
                  <p className="font-medium">{selectedJob.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Scheduled</p>
                  <p className="font-medium">{formatDateTime(selectedJob.scheduledDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="text-sm text-slate-700 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />{selectedJob.address}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedJob.description}</p>
              </div>
              {selectedJob.partsUsed.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Parts Used</p>
                  <div className="space-y-1">
                    {selectedJob.partsUsed.map((p, i) => (
                      <div key={i} className="flex justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
                        <span className="flex items-center gap-1"><Package className="h-3 w-3 text-slate-400" />{p.name}</span>
                        <span className="font-medium">{formatCurrency(p.cost * p.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedJob.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700">30-day warranty on all labor. Parts have manufacturer warranty.</p>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700">Total</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(selectedJob.totalAmount)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
