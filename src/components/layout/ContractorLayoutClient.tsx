'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ContractorSidebar } from './ContractorSidebar'
import { Header } from './Header'

const pageTitles: Record<string, string> = {
  '/contractor': 'My Dashboard',
  '/contractor/jobs': 'My Jobs',
  '/contractor/schedule': 'Schedule',
  '/contractor/quotes': 'Quotes',
  '/contractor/invoices': 'My Invoices',
  '/contractor/skills': 'Skills & Areas',
  '/contractor/inventory': 'Parts Inventory',
  '/contractor/availability': 'My Availability',
}

export function ContractorLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const title = pageTitles[pathname] || 'Contractor'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <ContractorSidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <ContractorSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
