'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'
import type { QuoteStatus } from '@prisma/client'

export interface QuoteRow {
  id: string
  quoteNumber: string
  customerId: string
  customerName: string
  contractorId: string | null
  status: QuoteStatus
  lineItems: { description: string; qty: number; unitPrice: number }[]
  total: number
  notes: string
  expiryDate: string
  createdAt: string
}

function mapQuote(
  q: Awaited<ReturnType<typeof prisma.quote.findMany>>[number] & {
    customer: { user: { name: string } }
  }
): QuoteRow {
  return {
    id: q.id,
    quoteNumber: q.quoteNumber,
    customerId: q.customerId,
    customerName: q.customer.user.name,
    contractorId: q.contractorId,
    status: q.status,
    lineItems: q.lineItems as QuoteRow['lineItems'],
    total: q.total,
    notes: q.notes,
    expiryDate: q.expiryDate.toISOString(),
    createdAt: q.createdAt.toISOString(),
  }
}

export async function getQuotes(filter?: { customerId?: string }): Promise<ActionResult<QuoteRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const quotes = await prisma.quote.findMany({
      where: filter,
      include: { customer: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return ok(quotes.map(mapQuote))
  } catch {
    return err('Database error')
  }
}

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(['draft', 'sent', 'accepted', 'declined']),
})

export async function updateQuoteStatus(input: z.infer<typeof updateSchema>): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    await prisma.quote.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } })
    return ok({ id: parsed.data.id })
  } catch {
    return err('Database error')
  }
}
