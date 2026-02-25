'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getQuotes, updateQuoteStatus, type QuoteRow } from '@/lib/actions/quotes'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, Eye, Send, FileCheck, XCircle } from 'lucide-react'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedQuote, setSelectedQuote] = useState<QuoteRow | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    getQuotes().then(r => r.success && setQuotes(r.data))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = quotes.filter(q => {
    const matchSearch = q.customerName.toLowerCase().includes(search.toLowerCase()) || q.quoteNumber.includes(search)
    const matchStatus = statusFilter === 'all' || q.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (id: string, status: 'draft' | 'sent' | 'accepted' | 'declined') => {
    const result = await updateQuoteStatus({ id, status })
    if (result.success) {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q))
      setSelectedQuote(prev => prev?.id === id ? { ...prev, status } : prev)
      showToast('Quote status updated')
    }
  }

  const totals = {
    all: quotes.reduce((s, q) => s + q.total, 0),
    accepted: quotes.filter(q => q.status === 'accepted').reduce((s, q) => s + q.total, 0),
    pending: quotes.filter(q => q.status === 'sent' || q.status === 'draft').reduce((s, q) => s + q.total, 0),
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Quotes</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ New Quote</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Quoted', value: totals.all, color: 'text-slate-800' },
          { label: 'Accepted Value', value: totals.accepted, color: 'text-green-600' },
          { label: 'Pending Value', value: totals.pending, color: 'text-yellow-600' },
        ].map(c => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">{c.label}</p>
              <p className={`text-xl font-bold ${c.color}`}>{formatCurrency(c.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search quotes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {['all', 'draft', 'sent', 'accepted', 'declined'].map(s => (
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
                {['Quote #', 'Customer', 'Created', 'Expires', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote) => (
                <tr key={quote.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">{quote.quoteNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{quote.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(quote.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(quote.expiryDate)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(quote.total)}</td>
                  <td className="px-6 py-4"><StatusBadge status={quote.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedQuote(quote)}>
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                      {quote.status === 'draft' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => handleStatusChange(quote.id, 'sent')}>
                          <Send className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {quote.status === 'sent' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => handleStatusChange(quote.id, 'accepted')}>
                            <FileCheck className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => handleStatusChange(quote.id, 'declined')}>
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {quote.status === 'accepted' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2"
                          onClick={() => showToast('Invoice created from quote!')}>
                          Convert to Invoice
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

      {/* Quote detail dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedQuote?.quoteNumber}</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-semibold text-slate-800">{selectedQuote.customerName}</p>
                </div>
                <StatusBadge status={selectedQuote.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-medium">{formatDate(selectedQuote.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Expires</p>
                  <p className="font-medium">{formatDate(selectedQuote.expiryDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2 text-slate-700">Line Items</p>
                <div className="space-y-2">
                  {selectedQuote.lineItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
                      <span className="text-slate-700">{item.description} x{item.qty}</span>
                      <span className="font-medium">{formatCurrency(item.qty * item.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700">Total</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(selectedQuote.total)}</span>
              </div>
              {selectedQuote.notes && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">{selectedQuote.notes}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
