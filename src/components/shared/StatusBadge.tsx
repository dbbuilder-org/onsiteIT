import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  assigned: { label: 'Assigned', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  'in-progress': { label: 'In Progress', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  sent: { label: 'Sent', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800 border-green-200' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-800 border-red-200' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 border-green-200' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800 border-red-200' },
  active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  available: { label: 'Available', className: 'bg-green-100 text-green-800 border-green-200' },
  busy: { label: 'Busy', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  offline: { label: 'Offline', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  low: { label: 'Low', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800 border-red-200' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border", config.className, className)}>
      {config.label}
    </Badge>
  )
}
