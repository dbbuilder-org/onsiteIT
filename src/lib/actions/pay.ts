'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'
import type { PayStatus } from '@prisma/client'

export interface PayRow {
  id: string
  contractorId: string
  contractorName: string
  period: string
  hoursLogged: number
  jobsCompleted: number
  grossAmount: number
  status: PayStatus
  payDate?: string
}

export async function getContractorPay(contractorId?: string): Promise<ActionResult<PayRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const rows = await prisma.contractorPay.findMany({
      where: contractorId ? { contractorId } : undefined,
      include: { contractor: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return ok(rows.map(r => ({
      id: r.id,
      contractorId: r.contractorId,
      contractorName: r.contractor.user.name,
      period: r.period,
      hoursLogged: r.hoursLogged,
      jobsCompleted: r.jobsCompleted,
      grossAmount: r.grossAmount,
      status: r.status,
      payDate: r.payDate ?? undefined,
    })))
  } catch {
    return err('Database error')
  }
}

const markPaidSchema = z.object({ id: z.string() })

export async function markPayPaid(input: z.infer<typeof markPaidSchema>): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = markPaidSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    await prisma.contractorPay.update({
      where: { id: parsed.data.id },
      data: { status: 'paid', payDate: new Date().toISOString().split('T')[0] },
    })
    return ok({ id: parsed.data.id })
  } catch {
    return err('Database error')
  }
}
