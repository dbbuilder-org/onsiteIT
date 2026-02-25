'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getMyContractorProfile } from '@/lib/actions/contractors'
import { getContractorPay, type PayRow } from '@/lib/actions/pay'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign, Clock, Briefcase, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContractorInvoicesPage() {
  const [myPay, setMyPay] = useState<PayRow[]>([])

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        getContractorPay(r.data.id).then(pr => pr.success && setMyPay(pr.data))
      }
    })
  }, [])

  const totalPaid = myPay.filter(p => p.status === 'paid').reduce((s, p) => s + p.grossAmount, 0)
  const totalPending = myPay.filter(p => p.status === 'pending').reduce((s, p) => s + p.grossAmount, 0)
  const totalHours = myPay.reduce((s, p) => s + p.hoursLogged, 0)
  const totalJobs = myPay.reduce((s, p) => s + p.jobsCompleted, 0)

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-xl font-bold text-slate-800">My Pay & Invoices</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid', value: formatCurrency(totalPaid), icon: DollarSign, color: 'text-green-600' },
          { label: 'Pending Payment', value: formatCurrency(totalPending), icon: Clock, color: 'text-yellow-600' },
          { label: 'Total Hours', value: `${totalHours}h`, icon: Clock, color: 'text-blue-600' },
          { label: 'Jobs Completed', value: totalJobs, icon: Briefcase, color: 'text-purple-600' },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pay periods */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Pay Periods</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />Download Statements
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Period', 'Hours', 'Jobs', 'Gross Pay', 'Status', 'Pay Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myPay.map(pay => (
                <tr key={pay.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{pay.period}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{pay.hoursLogged}h</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{pay.jobsCompleted}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(pay.grossAmount)}</td>
                  <td className="px-6 py-4"><StatusBadge status={pay.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{pay.payDate ? formatDate(pay.payDate) : '—'}</td>
                </tr>
              ))}
              {myPay.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">No pay periods yet</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Rate info */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">My Rate Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'Standard Rate', rate: '$95/hr' },
              { type: 'Urgent Rate', rate: '$140/hr' },
              { type: 'Weekend Rate', rate: '$120/hr' },
              { type: 'After Hours', rate: '$150/hr' },
            ].map(r => (
              <div key={r.type} className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-orange-500">{r.rate}</p>
                <p className="text-xs text-slate-500 mt-1">{r.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
