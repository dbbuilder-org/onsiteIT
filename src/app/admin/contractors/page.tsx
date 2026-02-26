'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getContractors, createContractor, type ContractorRow } from '@/lib/actions/contractors'
import { skills as allSkills } from '@/lib/constants'
import { formatCurrency, getInitials } from '@/lib/utils'
import { Plus, Search, Star, Briefcase, DollarSign, Phone, Mail, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<ContractorRow[]>([])
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedContractor, setSelectedContractor] = useState<ContractorRow | null>(null)
  const [newContractor, setNewContractor] = useState({ name: '', email: '', phone: '', hourlyRate: '85', abn: '' })
  const [addError, setAddError] = useState('')
  const [addSaving, setAddSaving] = useState(false)

  useEffect(() => {
    getContractors().then(r => r.success && setContractors(r.data))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = contractors.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    const matchSkill = !skillFilter || c.skills.includes(skillFilter)
    return matchSearch && matchStatus && matchSkill
  })

  const handleAdd = async () => {
    setAddError('')
    setAddSaving(true)
    const result = await createContractor({
      ...newContractor,
      hourlyRate: Number(newContractor.hourlyRate),
    })
    setAddSaving(false)
    if (result.success) {
      setContractors(prev => [result.data, ...prev])
      setNewContractor({ name: '', email: '', phone: '', hourlyRate: '85', abn: '' })
      setAddOpen(false)
      showToast('Contractor added successfully')
    } else {
      setAddError(result.error)
    }
  }

  const topSkills = ['Networking', 'Windows Repair', 'Server Setup', 'CCTV Installation', 'Data Recovery', 'Mac Repair']

  return (
    <div className="space-y-4 max-w-7xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Contractors</h2>
          <p className="text-sm text-slate-500">{filtered.length} contractors</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add New Contractor</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              {addError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{addError}</p>
              )}
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Jane Smith' },
                { label: 'Email', key: 'email', placeholder: 'jane@example.com' },
                { label: 'Phone', key: 'phone', placeholder: '0412 345 678' },
                { label: 'ABN', key: 'abn', placeholder: '12 345 678 901' },
                { label: 'Hourly Rate ($)', key: 'hourlyRate', placeholder: '85' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-slate-700">{field.label}</label>
                  <Input className="mt-1" placeholder={field.placeholder}
                    value={(newContractor as any)[field.key]}
                    onChange={(e) => setNewContractor(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAdd} disabled={addSaving}>
                {addSaving ? 'Adding...' : 'Add Contractor'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search contractors..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="">All Skills</option>
            {topSkills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {['all', 'available', 'busy', 'offline'].map(s => (
            <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm"
              className={statusFilter === s ? 'bg-blue-600 text-white' : ''}
              onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((contractor) => (
          <Card key={contractor.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedContractor(contractor)}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-base font-bold">
                    {getInitials(contractor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-slate-800">{contractor.name}</p>
                    <StatusBadge status={contractor.status} />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-slate-600">{contractor.rating}</span>
                    <span className="text-xs text-slate-400">({contractor.completedJobs} jobs)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {contractor.skills.slice(0, 3).map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-0">
                    {skill}
                  </Badge>
                ))}
                {contractor.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-0">
                    +{contractor.skills.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div className="text-center">
                  <Briefcase className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-slate-800">{contractor.currentJobs}</p>
                  <p className="text-xs text-slate-400">Active</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-slate-800">${contractor.hourlyRate}</p>
                  <p className="text-xs text-slate-400">/hr</p>
                </div>
                <div className="text-center">
                  <MapPin className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-slate-800">{contractor.suburbs.length}</p>
                  <p className="text-xs text-slate-400">Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selectedContractor} onOpenChange={() => setSelectedContractor(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contractor Details</DialogTitle>
          </DialogHeader>
          {selectedContractor && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-xl font-bold">
                    {getInitials(selectedContractor.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedContractor.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{selectedContractor.rating} rating • {selectedContractor.completedJobs} jobs completed</span>
                  </div>
                  <StatusBadge status={selectedContractor.status} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-slate-700 flex items-center gap-1"><Mail className="h-3 w-3" />{selectedContractor.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-slate-700 flex items-center gap-1"><Phone className="h-3 w-3" />{selectedContractor.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Hourly Rate</p>
                  <p className="text-slate-700 font-semibold">{formatCurrency(selectedContractor.hourlyRate)}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">ABN</p>
                  <p className="text-slate-700">{selectedContractor.abn}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContractor.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-0">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Service Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContractor.suburbs.map(suburb => (
                    <Badge key={suburb} variant="outline" className="text-xs">{suburb}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
