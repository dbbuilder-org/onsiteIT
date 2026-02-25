'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { getInventory, type InventoryRow } from '@/lib/actions/inventory'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, AlertTriangle, Edit, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryRow[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<InventoryRow | null>(null)
  const [toast, setToast] = useState('')
  const [newItem, setNewItem] = useState({ name: '', sku: '', category: 'Cables', stock: '0', minStock: '5', unitCost: '0', supplier: '' })

  useEffect(() => {
    getInventory().then(r => r.success && setInventory(r.data))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const categories = ['all', ...Array.from(new Set(inventory.map(i => i.category)))]

  const filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchSearch && matchCategory
  })

  const lowStock = inventory.filter(i => i.stock <= i.minStock)
  const totalValue = inventory.reduce((sum, i) => sum + i.stock * i.unitCost, 0)

  const handleAdd = () => {
    const item: InventoryRow = {
      id: `i${Date.now()}`,
      ...newItem,
      stock: Number(newItem.stock),
      minStock: Number(newItem.minStock),
      unitCost: Number(newItem.unitCost),
    }
    setInventory(prev => [item, ...prev])
    setAddOpen(false)
    setNewItem({ name: '', sku: '', category: 'Cables', stock: '0', minStock: '5', unitCost: '0', supplier: '' })
    showToast('Item added to inventory')
  }

  const handleDelete = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id))
    showToast('Item removed')
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Inventory</h2>
          <p className="text-sm text-slate-500">{inventory.length} items • Total value: {formatCurrency(totalValue)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                {[
                  { label: 'Item Name', key: 'name', placeholder: 'e.g. CAT6 Cable 10m' },
                  { label: 'SKU', key: 'sku', placeholder: 'e.g. CBL-CAT6-10' },
                  { label: 'Supplier', key: 'supplier', placeholder: 'e.g. NetParts AU' },
                  { label: 'Current Stock', key: 'stock', placeholder: '0' },
                  { label: 'Min Stock', key: 'minStock', placeholder: '5' },
                  { label: 'Unit Cost ($)', key: 'unitCost', placeholder: '12.50' },
                ].map(field => (
                  <div key={field.key}>
                    <Label className="text-xs font-medium">{field.label}</Label>
                    <Input className="mt-1" placeholder={field.placeholder}
                      value={(newItem as any)[field.key]}
                      onChange={(e) => setNewItem(prev => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div>
                  <Label className="text-xs font-medium">Category</Label>
                  <select className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}>
                    {['Cables', 'Adapters', 'Networking', 'Storage', 'Memory', 'Tools', 'Power', 'Screens'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAdd}>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Low Stock Alert ({lowStock.length} items)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(item => (
              <Badge key={item.id} className="bg-amber-100 text-amber-800 border border-amber-200 text-xs">
                {item.name}: {item.stock} left
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search items..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button key={cat} variant={categoryFilter === cat ? 'default' : 'outline'} size="sm"
                className={categoryFilter === cat ? 'bg-blue-600 text-white' : ''}
                onClick={() => setCategoryFilter(cat)}>
                {cat === 'all' ? 'All' : cat}
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
                  {['Item Name', 'SKU', 'Category', 'Stock', 'Min Stock', 'Unit Cost', 'Total Value', 'Supplier', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 first:pl-6 last:pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isLow = item.stock <= item.minStock
                  return (
                    <tr key={item.id} className={cn("border-b border-slate-50 hover:bg-slate-50 transition-colors", isLow && "bg-amber-50/40 hover:bg-amber-50")}>
                      <td className="pl-6 py-3">
                        <div className="flex items-center gap-2">
                          {isLow && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                          <span className="text-sm font-medium text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{item.sku}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-sm font-bold", isLow ? "text-amber-600" : "text-green-600")}>{item.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{item.minStock}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatCurrency(item.unitCost)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{formatCurrency(item.stock * item.unitCost)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{item.supplier}</td>
                      <td className="pr-6 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditItem(item)}>
                            <Edit className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Item: {editItem?.name}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-3 mt-2">
              {[
                { label: 'Item Name', key: 'name' },
                { label: 'Stock', key: 'stock' },
                { label: 'Min Stock', key: 'minStock' },
                { label: 'Unit Cost', key: 'unitCost' },
              ].map(field => (
                <div key={field.key}>
                  <Label className="text-xs font-medium">{field.label}</Label>
                  <Input className="mt-1"
                    value={(editItem as any)[field.key]}
                    onChange={(e) => setEditItem(prev => prev ? { ...prev, [field.key]: field.key === 'name' ? e.target.value : Number(e.target.value) } : null)}
                  />
                </div>
              ))}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                setInventory(prev => prev.map(i => i.id === editItem!.id ? editItem! : i))
                setEditItem(null)
                showToast('Item updated')
              }}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
