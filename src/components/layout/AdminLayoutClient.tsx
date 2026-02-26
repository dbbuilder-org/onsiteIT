'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'
import { Header } from './Header'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/customers': 'Customers',
  '/admin/contractors': 'Contractors',
  '/admin/jobs': 'Jobs',
  '/admin/inventory': 'Inventory',
  '/admin/quotes': 'Quotes',
  '/admin/invoices': 'Invoices',
  '/admin/reports': 'Reports',
  '/admin/matching': 'Job Matching',
  '/admin/settings': 'Settings',
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const title = pageTitles[pathname] || 'Admin'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
