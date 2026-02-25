'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyCustomerProfile } from '@/lib/actions/customers'
import { getInvoices, type InvoiceRow } from '@/lib/actions/invoices'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CreditCard, Plus, X, Lock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const savedCards = [
  { id: 'card1', brand: 'Visa', last4: '4532', expiry: '09/28', isDefault: true },
  { id: 'card2', brand: 'Mastercard', last4: '8821', expiry: '03/27', isDefault: false },
]

const cardBrandColors: Record<string, string> = {
  Visa: 'bg-blue-600',
  Mastercard: 'bg-orange-500',
}

export default function CustomerPaymentPage() {
  const [myInvoices, setMyInvoices] = useState<InvoiceRow[]>([])
  const [cards, setCards] = useState(savedCards)
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [toast, setToast] = useState('')
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    getMyCustomerProfile().then(r => {
      if (r.success) {
        getInvoices({ customerId: r.data.id }).then(ir => ir.success && setMyInvoices(ir.data))
      }
    })
  }, [])

  const handleAddCard = () => {
    if (!newCard.number || !newCard.name) return
    setCards(prev => [...prev, {
      id: `card${Date.now()}`,
      brand: 'Visa',
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry,
      isDefault: false,
    }])
    setShowAddCard(false)
    setNewCard({ number: '', name: '', expiry: '', cvv: '' })
    showToast('Card added successfully!')
  }

  const handlePay = (invoiceId: string) => {
    setPayingInvoice(invoiceId)
    setTimeout(() => {
      setPayingInvoice(null)
      showToast('Payment successful!')
    }, 2000)
  }

  const setDefault = (id: string) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })))
    showToast('Default payment method updated')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>}

      <h2 className="text-xl font-bold text-slate-800">Payment</h2>

      {/* Saved payment methods */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            Payment Methods
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddCard(!showAddCard)}>
            <Plus className="h-4 w-4 mr-1" />Add Card
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cards.map(card => (
              <div key={card.id} className={cn("flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                card.isDefault ? "border-blue-600 bg-blue-50/30" : "border-slate-200 bg-white")}>
                <div className={`h-10 w-14 rounded-lg ${cardBrandColors[card.brand] || 'bg-slate-500'} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{card.brand}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{card.brand} •••• {card.last4}</p>
                  <p className="text-sm text-slate-500">Expires {card.expiry}</p>
                </div>
                <div className="flex items-center gap-2">
                  {card.isDefault ? (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Default</span>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDefault(card.id)}>Set Default</Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8"
                    onClick={() => { setCards(prev => prev.filter(c => c.id !== card.id)); showToast('Card removed') }}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {showAddCard && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-green-600" />
                <p className="text-sm font-semibold text-slate-700">Add New Card</p>
                <span className="text-xs text-slate-400 ml-auto">Secured by SSL</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs font-medium">Card Number</Label>
                  <Input className="mt-1" placeholder="1234 5678 9012 3456" maxLength={19}
                    value={newCard.number} onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-medium">Cardholder Name</Label>
                  <Input className="mt-1" placeholder="Your Name"
                    value={newCard.name} onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs font-medium">Expiry Date</Label>
                  <Input className="mt-1" placeholder="MM/YY"
                    value={newCard.expiry} onChange={(e) => setNewCard(prev => ({ ...prev, expiry: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs font-medium">CVV</Label>
                  <Input className="mt-1" placeholder="123" type="password" maxLength={4}
                    value={newCard.cvv} onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddCard}>Add Card</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddCard(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outstanding invoices */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Outstanding Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {myInvoices.filter(i => i.status !== 'paid').length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-400" />
              <p className="text-sm font-medium">All invoices paid</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myInvoices.filter(i => i.status !== 'paid').map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-800">{inv.invoiceNumber}</p>
                    <p className="text-sm text-slate-500">Due {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-slate-800">{formatCurrency(inv.total)}</span>
                    <StatusBadge status={inv.status} />
                    <Button
                      size="sm"
                      className={cn("bg-blue-600 hover:bg-blue-700 text-white", payingInvoice === inv.id && "opacity-75")}
                      onClick={() => handlePay(inv.id)}
                      disabled={payingInvoice === inv.id}
                    >
                      {payingInvoice === inv.id ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Invoice', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myInvoices.filter(i => i.status === 'paid').map(inv => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm font-mono text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{inv.paidDate ? formatDate(inv.paidDate) : '—'}</td>
                  <td className="px-6 py-3 text-sm font-bold text-green-600">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-3"><StatusBadge status="paid" /></td>
                </tr>
              ))}
              {myInvoices.filter(i => i.status === 'paid').length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">No payment history</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
