'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getJobs, updateJobStatus, assignContractor, createJob, type JobRow } from '@/lib/actions/jobs'
import { getContractors, type ContractorRow } from '@/lib/actions/contractors'
import { getCustomers, type CustomerRow } from '@/lib/actions/customers'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Search, MapPin, Clock, User, Plus, ChevronRight } from 'lucide-react'

const columns: { key: string; label: string; color: string }[] = [
  { key: 'pending', label: 'New / Pending', color: 'bg-yellow-500' },
  { key: 'assigned', label: 'Assigned', color: 'bg-blue-500' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-purple-500' },
  { key: 'completed', label: 'Completed', color: 'bg-green-500' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
]

const priorityColors: Record<string, string> = {
  low: 'border-l-slate-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
}

const JOB_TYPES = [
  'Network Infrastructure',
  'Workstation Setup',
  'Server Maintenance',
  'Data Recovery',
  'Backup Solution',
  'Security Audit',
  'Cloud Migration',
  'Software Installation',
  'Hardware Repair',
  'CCTV / Security',
  'VoIP / Phones',
  'Other',
]

const emptyForm = {
  title: '',
  description: '',
  type: JOB_TYPES[0],
  customerId: '',
  contractorId: '',
  address: '',
  suburb: '',
  scheduledDate: '',
  priority: 'medium' as const,
  laborRate: 95,
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [contractorList, setContractorList] = useState<ContractorRow[]>([])
  const [customerList, setCustomerList] = useState<CustomerRow[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null)
  const [assignContractorId, setAssignContractorId] = useState('')
  const [toast, setToast] = useState('')

  // new job dialog
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [newJobForm, setNewJobForm] = useState(emptyForm)
  const [newJobError, setNewJobError] = useState('')
  const [newJobSaving, setNewJobSaving] = useState(false)

  useEffect(() => {
    getJobs().then(r => r.success && setJobs(r.data))
    getContractors().then(r => r.success && setContractorList(r.data))
    getCustomers().then(r => r.success && setCustomerList(r.data))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const jobTypes = ['all', ...Array.from(new Set(jobs.map(j => j.type)))]

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.customerName.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || j.type === typeFilter
    return matchSearch && matchType
  })

  const getColumnJobs = (status: string) => filtered.filter(j => j.status === status)

  const handleAssign = async (jobId: string, contractorId: string) => {
    const result = await assignContractor({ jobId, contractorId })
    if (result.success) {
      setJobs(prev => prev.map(j => j.id === jobId ? result.data : j))
      setSelectedJob(prev => prev?.id === jobId ? result.data : prev)
      showToast(`Job assigned to ${result.data.contractorName}`)
    }
  }

  const handleStatusChange = async (jobId: string, status: string) => {
    const result = await updateJobStatus({ jobId, status: status as 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled' })
    if (result.success) {
      setJobs(prev => prev.map(j => j.id === jobId ? result.data : j))
      setSelectedJob(prev => prev?.id === jobId ? result.data : prev)
      showToast('Job status updated')
    }
  }

  const handleCreateJob = async () => {
    setNewJobError('')
    if (!newJobForm.title || !newJobForm.customerId || !newJobForm.address || !newJobForm.suburb || !newJobForm.scheduledDate) {
      setNewJobError('Please fill in all required fields.')
      return
    }
    setNewJobSaving(true)
    const result = await createJob({
      ...newJobForm,
      contractorId: newJobForm.contractorId || undefined,
      laborRate: Number(newJobForm.laborRate),
    })
    setNewJobSaving(false)
    if (result.success) {
      setJobs(prev => [result.data, ...prev])
      setNewJobOpen(false)
      setNewJobForm(emptyForm)
      showToast('Job created successfully')
    } else {
      setNewJobError(result.error)
    }
  }

  const setField = (key: keyof typeof emptyForm, value: string | number) =>
    setNewJobForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-4 max-w-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Jobs Board</h2>
          <p className="text-sm text-slate-500">{jobs.length} total jobs</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setNewJobOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search jobs..." className="pl-9 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {jobTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
      </div>

      {/* Mobile list view (< md) */}
      <div className="md:hidden space-y-5">
        {columns.map((col) => {
          const colJobs = getColumnJobs(col.key)
          return (
            <div key={col.key}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-slate-700">{col.label}</span>
                <span className="ml-auto bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{colJobs.length}</span>
              </div>
              {colJobs.length === 0 ? (
                <p className="text-xs text-slate-400 pl-4">No jobs</p>
              ) : (
                <div className="space-y-2">
                  {colJobs.map((job) => (
                    <div key={job.id}
                      className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColors[job.priority] || 'border-l-slate-300'} p-3 cursor-pointer hover:shadow-md transition-all`}
                      onClick={() => setSelectedJob(job)}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{job.title}</p>
                        <StatusBadge status={job.priority} />
                      </div>
                      <p className="text-xs text-slate-500">{job.customerName} · {job.suburb}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">{formatDateTime(job.scheduledDate)}</span>
                        <span className="text-xs font-semibold text-slate-700">{formatCurrency(job.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Kanban (md+) */}
      <div className="hidden md:flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
        {columns.map((col) => {
          const colJobs = getColumnJobs(col.key)
          return (
            <div key={col.key} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-slate-700">{col.label}</span>
                <span className="ml-auto bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {colJobs.length}
                </span>
              </div>
              <div className="space-y-3">
                {colJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColors[job.priority] || 'border-l-slate-300'} p-4 cursor-pointer hover:shadow-md transition-all`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{job.type}</Badge>
                      <StatusBadge status={job.priority} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2">{job.title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <User className="h-3 w-3" />{job.customerName}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />{job.suburb}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                      <Clock className="h-3 w-3" />{formatDateTime(job.scheduledDate)}
                    </p>
                    {job.contractorName ? (
                      <p className="text-xs text-blue-600 font-medium">{job.contractorName}</p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Unassigned</p>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-700">{formatCurrency(job.totalAmount)}</span>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </div>
                ))}
                {colJobs.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                    No jobs
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Job detail dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={selectedJob.status} />
                <StatusBadge status={selectedJob.priority} />
                <Badge variant="outline" className="text-xs">{selectedJob.type}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-medium text-slate-800">{selectedJob.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Scheduled</p>
                  <p className="font-medium text-slate-800">{formatDateTime(selectedJob.scheduledDate)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-medium text-slate-800">{selectedJob.address}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedJob.description}</p>
              </div>

              {/* Assign contractor */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-slate-700 mb-2">Assign Contractor</p>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                    value={assignContractorId || selectedJob.contractorId || ''}
                    onChange={(e) => setAssignContractorId(e.target.value)}
                  >
                    <option value="">Select contractor...</option>
                    {contractorList.filter(c => c.status !== 'offline').map(c => (
                      <option key={c.id} value={c.id}>{c.name} (${c.hourlyRate}/hr)</option>
                    ))}
                  </select>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => assignContractorId && handleAssign(selectedJob.id, assignContractorId)}>
                    Assign
                  </Button>
                </div>
              </div>

              {/* Status update */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'assigned', 'in-progress', 'completed', 'cancelled'] as const).map(s => (
                    <Button key={s} variant={selectedJob.status === s ? 'default' : 'outline'} size="sm"
                      className={selectedJob.status === s ? 'bg-blue-600 text-white' : ''}
                      onClick={() => handleStatusChange(selectedJob.id, s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Parts used */}
              {selectedJob.partsUsed.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Parts Used</p>
                  <div className="space-y-1">
                    {selectedJob.partsUsed.map((p, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-700">{p.name} x{p.qty}</span>
                        <span className="font-medium">{formatCurrency(p.cost * p.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-semibold text-slate-700">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(selectedJob.totalAmount)}</span>
              </div>

              {/* Notes */}
              {selectedJob.notes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Field Notes</p>
                  <div className="space-y-2">
                    {selectedJob.notes.map((note, i) => (
                      <div key={i} className="text-sm bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg text-slate-700">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Job dialog */}
      <Dialog open={newJobOpen} onOpenChange={(open) => { setNewJobOpen(open); if (!open) { setNewJobForm(emptyForm); setNewJobError('') } }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {newJobError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{newJobError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-sm">Job Title *</Label>
                <Input className="mt-1" placeholder="e.g. Network switch replacement" value={newJobForm.title} onChange={e => setField('title', e.target.value)} />
              </div>

              <div>
                <Label className="text-sm">Service Type *</Label>
                <select className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={newJobForm.type} onChange={e => setField('type', e.target.value)}>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <Label className="text-sm">Priority *</Label>
                <select className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={newJobForm.priority} onChange={e => setField('priority', e.target.value)}>
                  {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <Label className="text-sm">Customer *</Label>
                <select className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={newJobForm.customerId} onChange={e => setField('customerId', e.target.value)}>
                  <option value="">Select customer...</option>
                  {customerList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <Label className="text-sm">Assign Contractor (optional)</Label>
                <select className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={newJobForm.contractorId} onChange={e => setField('contractorId', e.target.value)}>
                  <option value="">Unassigned</option>
                  {contractorList.filter(c => c.status !== 'offline').map(c => (
                    <option key={c.id} value={c.id}>{c.name} (${c.hourlyRate}/hr)</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm">Address *</Label>
                <Input className="mt-1" placeholder="123 Example Street" value={newJobForm.address} onChange={e => setField('address', e.target.value)} />
              </div>

              <div>
                <Label className="text-sm">Suburb *</Label>
                <Input className="mt-1" placeholder="Sydney" value={newJobForm.suburb} onChange={e => setField('suburb', e.target.value)} />
              </div>

              <div>
                <Label className="text-sm">Scheduled Date *</Label>
                <Input className="mt-1" type="datetime-local" value={newJobForm.scheduledDate} onChange={e => setField('scheduledDate', e.target.value)} />
              </div>

              <div>
                <Label className="text-sm">Labour Rate ($/hr)</Label>
                <Input className="mt-1" type="number" min={0} value={newJobForm.laborRate} onChange={e => setField('laborRate', Number(e.target.value))} />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm">Description *</Label>
                <textarea
                  className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the work to be done..."
                  value={newJobForm.description}
                  onChange={e => setField('description', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => { setNewJobOpen(false); setNewJobForm(emptyForm); setNewJobError('') }}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateJob} disabled={newJobSaving}>
                {newJobSaving ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
