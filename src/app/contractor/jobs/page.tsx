'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyContractorProfile } from '@/lib/actions/contractors'
import { getJobs, updateJobStatus, type JobRow } from '@/lib/actions/jobs'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { MapPin, Clock, Package, Play, CheckCircle, Plus } from 'lucide-react'

export default function ContractorJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null)
  const [noteText, setNoteText] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        getJobs({ contractorId: r.data.id }).then(jr => jr.success && setJobs(jr.data))
      }
    })
  }, [])

  const activeJobs = jobs.filter(j => j.status === 'in-progress' || j.status === 'assigned')
  const completedJobs = jobs.filter(j => j.status === 'completed')

  const handleStatusChange = async (id: string, status: 'in-progress' | 'completed') => {
    const result = await updateJobStatus({ jobId: id, status })
    if (result.success) {
      setJobs(prev => prev.map(j => j.id === id ? result.data : j))
      setSelectedJob(prev => prev?.id === id ? result.data : prev)
      showToast(status === 'completed' ? 'Job marked as complete!' : 'Job started!')
    }
  }

  const handleAddNote = (jobId: string) => {
    if (!noteText.trim()) return
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, notes: [...j.notes, noteText] } : j))
    setSelectedJob(prev => prev ? { ...prev, notes: [...prev.notes, noteText] } : null)
    setNoteText('')
    showToast('Note added')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>}

      <h2 className="text-xl font-bold text-slate-800">My Jobs</h2>

      {/* Active jobs */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Active ({activeJobs.length})</h3>
        <div className="space-y-4">
          {activeJobs.map(job => (
            <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedJob(job)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-slate-800">{job.title}</p>
                    <p className="text-sm text-slate-500">{job.customerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={job.status} />
                    <StatusBadge status={job.priority} />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-orange-500" />{job.suburb}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-500" />{formatDateTime(job.scheduledDate)}</span>
                  <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5 text-purple-500" />{job.partsUsed.length} parts</span>
                </div>
                <div className="flex gap-2">
                  {job.status === 'assigned' && (
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(job.id, 'in-progress') }}>
                      <Play className="h-3.5 w-3.5 mr-1" />Start Job
                    </Button>
                  )}
                  {job.status === 'in-progress' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(job.id, 'completed') }}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />Mark Complete
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedJob(job) }}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed jobs */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Completed ({completedJobs.length})</h3>
        <div className="space-y-3">
          {completedJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedJob(job)}>
              <div>
                <p className="font-semibold text-slate-700 text-sm">{job.title}</p>
                <p className="text-xs text-slate-500">{job.customerName} • {job.suburb}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-green-600">{formatCurrency(job.totalAmount)}</span>
                <StatusBadge status="completed" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job detail dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => { setSelectedJob(null); setNoteText('') }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <StatusBadge status={selectedJob.status} />
                <StatusBadge status={selectedJob.priority} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Customer</p>
                <p className="font-semibold text-slate-800">{selectedJob.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="text-sm text-slate-700">{selectedJob.address}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Scheduled</p>
                <p className="text-sm text-slate-700">{formatDateTime(selectedJob.scheduledDate)}</p>
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
                        <span>{p.name} x{p.qty}</span>
                        <span className="font-medium">{formatCurrency(p.cost * p.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Field Notes</p>
                <div className="space-y-2 mb-3">
                  {selectedJob.notes.map((note, i) => (
                    <div key={i} className="text-sm bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-lg">{note}</div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedJob.id)}
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAddNote(selectedJob.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700">Total Value</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(selectedJob.totalAmount)}</span>
              </div>

              {selectedJob.status !== 'completed' && (
                <div className="flex gap-2">
                  {selectedJob.status === 'assigned' && (
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => handleStatusChange(selectedJob.id, 'in-progress')}>
                      Start Job
                    </Button>
                  )}
                  {selectedJob.status === 'in-progress' && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusChange(selectedJob.id, 'completed')}>
                      Mark Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
