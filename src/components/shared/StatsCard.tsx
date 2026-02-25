import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  className?: string
  iconClassName?: string
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, className, iconClassName }: StatsCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs mt-1 font-medium", trend.positive ? "text-green-600" : "text-red-500")}>
                {trend.positive ? "+" : ""}{trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", iconClassName || "bg-blue-50")}>
            <Icon className={cn("h-5 w-5", iconClassName ? "text-white" : "text-blue-600")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
