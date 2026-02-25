'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Briefcase, Calendar, FileText, Receipt,
  Star, Package, LogOut, Wrench, X, Clock
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/contractor', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/contractor/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/contractor/schedule', label: 'Schedule', icon: Calendar },
  { href: '/contractor/availability', label: 'Availability', icon: Clock },
  { href: '/contractor/quotes', label: 'Quotes', icon: FileText },
  { href: '/contractor/invoices', label: 'My Invoices', icon: Receipt },
  { href: '/contractor/skills', label: 'Skills & Areas', icon: Star },
  { href: '/contractor/inventory', label: 'Parts Inventory', icon: Package },
]

export function ContractorSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">OnsiteIT</p>
            <p className="text-xs text-slate-400">Contractor</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs border">
          Contractor Portal
        </Badge>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/contractor' ? pathname === '/contractor' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-orange-500 text-white text-xs">AT</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
