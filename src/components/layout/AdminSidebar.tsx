'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, UserCheck, Briefcase, Package,
  FileText, Receipt, BarChart3, Settings, LogOut, Wrench, X, GitMerge
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navItems: { href: string; label: string; icon: any; highlight?: boolean }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/contractors', label: 'Contractors', icon: UserCheck },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/matching', label: 'Smart Matching', icon: GitMerge, highlight: true },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/invoices', label: 'Invoices', icon: Receipt },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">OnsiteIT</p>
            <p className="text-xs text-slate-400">Management</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs border">
          Admin Portal
        </Badge>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600 text-white"
                  : item.highlight
                  ? "text-orange-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
              {item.highlight && !isActive && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white text-xs">AU</AvatarFallback>
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
