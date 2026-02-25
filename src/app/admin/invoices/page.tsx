'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getInvoices, updateInvoiceStatus, type InvoiceRow } from '@/lib/actions/invoices'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, Eye, Send, CreditCard, AlertCircle } from 'lucide-react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    getInvoices().then(r => r.success && setInvoices(r.data))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNumber.includes(search)
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => {
    const result = await updateInvoiceStatus({ id, status })
    if (result.success) {
      const now = new Date().toISOString()
      setInvoices(prev => prev.map(i => i.id === id ? {
        ...i, status,
        paidDate: status === 'paid' ? now : i.paidDate
      } : i))
      setSelectedInvoice(prev => prev?.id === id ? { ...prev, status } : prev)
      showToast(status === 'paid' ? 'Payment recorded!' : 'Invoice status updated')
    }
  }

  const totals = {
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0),
    outstanding: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0),
  }

  const statusBgColors: Record<string, string> = {
    draft: 'bg-slate-50',
    sent: 'bg-blue-50/30',
    paid: 'bg-green-50/30',
    overdue: 'bg-red-50/40',
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Invoices</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ New Invoice</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Revenue Collected', value: totals.paid, color: 'text-green-600', icon: CreditCard },
          { label: 'Outstanding', value: totals.outstanding, color: 'text-blue-600', icon: Send },
          { label: 'Overdue', value: totals.overdue, color: 'text-red-500', icon: AlertCircle },
        ].map(c => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <c.icon className={`h-8 w-8 ${c.color}`} />
              <div>
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className={`text-xl font-bold ${c.color}`}>{formatCurrency(c.value)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search invoices..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
            <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm"
              className={statusFilter === s ? 'bg-blue-600 text-white' : ''}
              onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Invoice #', 'Customer', 'Created', 'Due Date', 'Amount', 'GST', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${statusBgColors[inv.status] || ''}`}>
                  <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{inv.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(inv.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(inv.gst)}</td>
                  <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedInvoice(inv)}>
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                      {inv.status === 'draft' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-2"
                          onClick={() => handleStatusChange(inv.id, 'sent')}>
                          Send
                        </Button>
                      )}
                      {(inv.status === 'sent' || inv.status === 'overdue') && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2"
                          onClick={() => handleStatusChange(inv.id, 'paid')}>
                          Mark Paid
                        </Button>
                      )}
                      {inv.status === 'overdue' && (
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2"
                          onClick={() => showToast('Reminder sent!')}>
                          Remind
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invoice detail dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500">Bill To</p>
                  <p className="font-bold text-slate-800">{selectedInvoice.customerName}</p>
                </div>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-slate-500">Issue Date</p><p className="font-medium">{formatDate(selectedInvoice.createdAt)}</p></div>
                <div><p className="text-xs text-slate-500">Due Date</p><p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p></div>
                {selectedInvoice.paidDate && (
                  <div><p className="text-xs text-slate-500">Paid Date</p><p className="font-medium text-green-600">{formatDate(selectedInvoice.paidDate)}</p></div>
                )}
              </div>
              <div className="space-y-2">
                {selectedInvoice.lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
                    <span>{item.description} x{item.qty}</span>
                    <span className="font-medium">{formatCurrency(item.qty * item.unitPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span>{formatCurrency(selectedInvoice.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">GST (10%)</span><span>{formatCurrency(selectedInvoice.gst)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span className="text-xl text-blue-600">{formatCurrency(selectedInvoice.total)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
