'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'
import { sendInvoiceSentEmail } from '@/lib/email'
import type { InvoiceStatus } from '@prisma/client'

export interface InvoiceRow {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  jobId: string
  status: InvoiceStatus
  lineItems: { description: string; qty: number; unitPrice: number }[]
  subtotal: number
  gst: number
  total: number
  dueDate: string
  paidDate?: string
  createdAt: string
}

function mapInvoice(
  inv: Awaited<ReturnType<typeof prisma.invoice.findMany>>[number] & {
    customer: { user: { name: string } }
  }
): InvoiceRow {
  return {
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerId: inv.customerId,
    customerName: inv.customer.user.name,
    jobId: inv.jobId,
    status: inv.status,
    lineItems: inv.lineItems as InvoiceRow['lineItems'],
    subtotal: inv.subtotal,
    gst: inv.gst,
    total: inv.total,
    dueDate: inv.dueDate.toISOString(),
    paidDate: inv.paidDate?.toISOString(),
    createdAt: inv.createdAt.toISOString(),
  }
}

export async function getInvoices(filter?: { customerId?: string }): Promise<ActionResult<InvoiceRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const invoices = await prisma.invoice.findMany({
      where: filter,
      include: { customer: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return ok(invoices.map(mapInvoice))
  } catch {
    return err('Database error')
  }
}

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
})

export async function updateInvoiceStatus(input: z.infer<typeof updateSchema>): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    const invoice = await prisma.invoice.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        paidDate: parsed.data.status === 'paid' ? new Date() : undefined,
      },
      include: { customer: { include: { user: { select: { name: true, email: true } } } } },
    })
    if (parsed.data.status === 'sent') {
      await sendInvoiceSentEmail({
        customerEmail: invoice.customer.user.email,
        customerName: invoice.customer.user.name,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        dueDate: invoice.dueDate.toISOString(),
      })
    }
    return ok({ id: parsed.data.id })
  } catch {
    return err('Database error')
  }
}
