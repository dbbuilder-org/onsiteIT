'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInventory, type InventoryRow } from '@/lib/actions/inventory'
import { formatCurrency } from '@/lib/utils'
import { Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react'

export default function ContractorInventoryPage() {
  const [allInventory, setAllInventory] = useState<InventoryRow[]>([])
  const [vanStock, setVanStock] = useState<(InventoryRow & { qty: number })[]>([])
  const [requestItems, setRequestItems] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    getInventory().then(r => {
      if (r.success) {
        setAllInventory(r.data)
        const qtys = [4, 1, 2, 3, 5, 1]
        setVanStock(r.data.slice(0, 6).map((item, i) => ({ ...item, qty: qtys[i] ?? 1 })))
      }
    })
  }, [])

  const adjustQty = (id: string, delta: number) => {
    setVanStock(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
  }

  const toggleRequest = (id: string) => {
    setRequestItems(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  }

  const handleRequest = () => {
    showToast(`${requestItems.length} item(s) requested from main stock`)
    setRequestItems([])
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">My Parts Inventory</h2>
        {requestItems.length > 0 && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleRequest}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Request {requestItems.length} item(s)
          </Button>
        )}
      </div>

      {/* Van stock */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Van/Bag Stock</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Item', 'Category', 'Qty', 'Value', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vanStock.map(item => (
                <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50 ${item.qty === 0 ? 'bg-red-50/40' : ''}`}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {item.qty === 0 && <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                      <span className="text-sm font-medium text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => adjustQty(item.id, -1)} className="h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className={`text-sm font-bold w-6 text-center ${item.qty === 0 ? 'text-red-500' : item.qty <= 1 ? 'text-orange-500' : 'text-slate-800'}`}>
                        {item.qty}
                      </span>
                      <button onClick={() => adjustQty(item.id, 1)} className="h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-700">{formatCurrency(item.qty * item.unitCost)}</td>
                  <td className="px-6 py-3">
                    <Button
                      size="sm"
                      variant={requestItems.includes(item.id) ? 'default' : 'outline'}
                      className={`text-xs h-7 ${requestItems.includes(item.id) ? 'bg-blue-600 text-white' : ''}`}
                      onClick={() => toggleRequest(item.id)}
                    >
                      {requestItems.includes(item.id) ? 'Requested ✓' : 'Request More'}
                    </Button>
                  </td>
                </tr>
              ))}
              {vanStock.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">Loading inventory...</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Available from warehouse */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Available from Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allInventory.slice(0, 9).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.stock} in stock • {formatCurrency(item.unitCost)}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-7 ml-2 flex-shrink-0"
                  onClick={() => showToast(`${item.name} added to request`)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
