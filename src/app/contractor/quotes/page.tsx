'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyContractorProfile } from '@/lib/actions/contractors'
import { getQuotes, type QuoteRow } from '@/lib/actions/quotes'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

export default function ContractorQuotesPage() {
  const [myQuotes, setMyQuotes] = useState<QuoteRow[]>([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState('')
  const [lineItems, setLineItems] = useState([{ description: '', qty: 1, unitPrice: 0 }])
  const [customerName, setCustomerName] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        getQuotes().then(qr => {
          if (qr.success) {
            setMyQuotes(qr.data.filter(q => q.contractorId === r.data.id))
          }
        })
      }
    })
  }, [])

  const total = lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0)

  const addLineItem = () => setLineItems(prev => [...prev, { description: '', qty: 1, unitPrice: 0 }])
  const removeLineItem = (i: number) => setLineItems(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = () => {
    showToast('Quote submitted for admin review!')
    setShowForm(false)
    setLineItems([{ description: '', qty: 1, unitPrice: 0 }])
    setCustomerName('')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Quotes</h2>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />{showForm ? 'Cancel' : 'Create Quote'}
        </Button>
      </div>

      {/* Create quote form */}
      {showForm && (
        <Card className="border-0 shadow-sm border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-base">New Quote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Customer Name</Label>
              <Input
                className="mt-1"
                placeholder="Enter customer name..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Line Items</Label>
                <Button variant="outline" size="sm" onClick={addLineItem}><Plus className="h-3.5 w-3.5 mr-1" />Add Item</Button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-1">
                  <span className="col-span-6">Description</span>
                  <span className="col-span-2">Qty</span>
                  <span className="col-span-3">Unit Price</span>
                  <span className="col-span-1"></span>
                </div>
                {lineItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <Input className="col-span-6 text-sm" placeholder="e.g. Labor - 2hrs"
                      value={item.description}
                      onChange={(e) => setLineItems(prev => prev.map((li, idx) => idx === i ? { ...li, description: e.target.value } : li))}
                    />
                    <Input className="col-span-2 text-sm" type="number" min="1" value={item.qty}
                      onChange={(e) => setLineItems(prev => prev.map((li, idx) => idx === i ? { ...li, qty: Number(e.target.value) } : li))}
                    />
                    <Input className="col-span-3 text-sm" type="number" min="0" step="0.01" value={item.unitPrice}
                      onChange={(e) => setLineItems(prev => prev.map((li, idx) => idx === i ? { ...li, unitPrice: Number(e.target.value) } : li))}
                    />
                    <Button variant="ghost" size="icon" className="col-span-1 h-8 w-8" onClick={() => removeLineItem(i)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="font-bold text-slate-700">Total</span>
              <span className="text-xl font-bold text-orange-500">{formatCurrency(total)}</span>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSubmit}>
                Submit for Approval
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => showToast('Quote saved as draft')}>
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing quotes */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">My Quotes ({myQuotes.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Quote #', 'Customer', 'Created', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myQuotes.map(q => (
                <tr key={q.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm font-mono font-medium text-blue-600">{q.quoteNumber}</td>
                  <td className="px-6 py-3 text-sm text-slate-800">{q.customerName}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(q.createdAt)}</td>
                  <td className="px-6 py-3 text-sm font-bold text-slate-800">{formatCurrency(q.total)}</td>
                  <td className="px-6 py-3"><StatusBadge status={q.status} /></td>
                </tr>
              ))}
              {myQuotes.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">No quotes yet</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
