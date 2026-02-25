'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getCustomers, type CustomerRow } from '@/lib/actions/customers'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Plus, Search, Mail, Phone, MapPin, Briefcase, DollarSign, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<CustomerRow | null>(null)
  const [toast, setToast] = useState('')
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '', suburb: '', postcode: '', notes: '' })

  useEffect(() => {
    getCustomers().then(r => r.success && setCustomers(r.data))
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.suburb.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAdd = () => {
    const c: CustomerRow = {
      id: `c${Date.now()}`,
      userId: '',
      ...newCustomer,
      state: 'NSW',
      totalJobs: 0,
      totalSpend: 0,
      status: 'active',
      joinedDate: new Date().toISOString(),
      paymentMethod: 'Not set'
    }
    setCustomers(prev => [c, ...prev])
    setNewCustomer({ name: '', email: '', phone: '', address: '', suburb: '', postcode: '', notes: '' })
    setAddOpen(false)
    showToast('Customer added successfully')
  }

  const handleDelete = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
    showToast('Customer deleted')
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Customers</h2>
          <p className="text-sm text-slate-500">{filtered.length} of {customers.length} customers</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'John Smith' },
                { label: 'Email', key: 'email', placeholder: 'john@email.com' },
                { label: 'Phone', key: 'phone', placeholder: '0412 345 678' },
                { label: 'Address', key: 'address', placeholder: '42 Main Street' },
                { label: 'Suburb', key: 'suburb', placeholder: 'Sydney CBD' },
                { label: 'Postcode', key: 'postcode', placeholder: '2000' },
              ].map(field => (
                <div key={field.key}>
                  <Label className="text-xs font-medium">{field.label}</Label>
                  <Input
                    className="mt-1"
                    placeholder={field.placeholder}
                    value={(newCustomer as any)[field.key]}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <Label className="text-xs font-medium">Notes</Label>
                <textarea
                  className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm resize-none h-16"
                  placeholder="Any notes about this customer..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAdd}>
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search customers..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map(s => (
              <Button
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                size="sm"
                className={statusFilter === s ? 'bg-blue-600 text-white' : ''}
                onClick={() => setStatusFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-500 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-slate-500 py-3">Location</th>
                  <th className="text-center text-xs font-semibold text-slate-500 py-3">Jobs</th>
                  <th className="text-right text-xs font-semibold text-slate-500 py-3">Total Spend</th>
                  <th className="text-center text-xs font-semibold text-slate-500 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 pr-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <>
                    <tr
                      key={customer.id}
                      className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                            <p className="text-xs text-slate-400">Since {formatDate(customer.joinedDate)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-slate-700 flex items-center gap-1"><Mail className="h-3 w-3 text-slate-400" />{customer.email}</p>
                        <p className="text-sm text-slate-600 flex items-center gap-1 mt-1"><Phone className="h-3 w-3 text-slate-400" />{customer.phone}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-slate-700 flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" />{customer.suburb}, {customer.state}</p>
                      </td>
                      <td className="py-4 text-center">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                          {customer.totalJobs}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <p className="text-sm font-semibold text-slate-800">{formatCurrency(customer.totalSpend)}</p>
                      </td>
                      <td className="py-4 text-center">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="pr-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditCustomer(customer); }}>
                            <Edit className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          {expandedId === customer.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </td>
                    </tr>
                    {expandedId === customer.id && (
                      <tr key={`${customer.id}-expanded`} className="bg-blue-50/40 border-b border-slate-100">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-500 mb-2">Full Address</p>
                              <p className="text-sm text-slate-700">{customer.address}</p>
                              <p className="text-sm text-slate-700">{customer.suburb} {customer.state} {customer.postcode}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 mb-2">Payment Method</p>
                              <p className="text-sm text-slate-700">{customer.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 mb-2">Notes</p>
                              <p className="text-sm text-slate-700">{customer.notes}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer: {editCustomer?.name}</DialogTitle>
          </DialogHeader>
          {editCustomer && (
            <div className="space-y-3 mt-2">
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Suburb', key: 'suburb' },
              ].map(field => (
                <div key={field.key}>
                  <Label className="text-xs font-medium">{field.label}</Label>
                  <Input
                    className="mt-1"
                    value={(editCustomer as any)[field.key]}
                    onChange={(e) => setEditCustomer(prev => prev ? { ...prev, [field.key]: e.target.value } : null)}
                  />
                </div>
              ))}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                setCustomers(prev => prev.map(c => c.id === editCustomer!.id ? editCustomer! : c))
                setEditCustomer(null)
                showToast('Customer updated')
              }}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
