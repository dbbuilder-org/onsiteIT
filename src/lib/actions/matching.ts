'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'

export interface JobRequestRow {
  id: string
  customerId: string
  customerName: string
  serviceType: string
  description: string
  address: string
  suburb: string
  preferredDates: string[]
  preferredTime: string
  priority: string
  status: string
  matchedContractorId?: string
  matchedContractorName?: string
  createdAt: string
}

function mapRequest(
  r: Awaited<ReturnType<typeof prisma.jobRequest.findMany>>[number] & {
    customer: { user: { name: string } }
    matchedContractor: { user: { name: string } } | null
  }
): JobRequestRow {
  return {
    id: r.id,
    customerId: r.customerId,
    customerName: r.customer.user.name,
    serviceType: r.serviceType,
    description: r.description,
    address: r.address,
    suburb: r.suburb,
    preferredDates: r.preferredDates,
    preferredTime: r.preferredTime,
    priority: r.priority,
    status: r.status,
    matchedContractorId: r.matchedContractorId ?? undefined,
    matchedContractorName: r.matchedContractor?.user.name,
    createdAt: r.createdAt.toISOString(),
  }
}

const include = {
  customer: { include: { user: { select: { name: true } } } },
  matchedContractor: { include: { user: { select: { name: true } } } },
}

export async function getJobRequests(customerId?: string): Promise<ActionResult<JobRequestRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const requests = await prisma.jobRequest.findMany({
      where: customerId ? { customerId } : undefined,
      include,
      orderBy: { createdAt: 'desc' },
    })
    return ok(requests.map(r => mapRequest(r as Parameters<typeof mapRequest>[0])))
  } catch {
    return err('Database error')
  }
}

const submitSchema = z.object({
  customerId: z.string(),
  serviceType: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  suburb: z.string().min(1),
  preferredDates: z.array(z.string()).min(1),
  preferredTime: z.string(),
  priority: z.enum(['normal', 'urgent', 'emergency']),
})

export async function submitJobRequest(input: z.infer<typeof submitSchema>): Promise<ActionResult<JobRequestRow>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  const parsed = submitSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    const req = await prisma.jobRequest.create({
      data: parsed.data,
      include,
    })
    return ok(mapRequest(req as Parameters<typeof mapRequest>[0]))
  } catch {
    return err('Database error')
  }
}

const confirmSchema = z.object({
  jobRequestId: z.string(),
  contractorId: z.string(),
})

export async function confirmMatch(input: z.infer<typeof confirmSchema>): Promise<ActionResult<JobRequestRow>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = confirmSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    const req = await prisma.jobRequest.update({
      where: { id: parsed.data.jobRequestId },
      data: { status: 'confirmed', matchedContractorId: parsed.data.contractorId },
      include,
    })
    return ok(mapRequest(req as Parameters<typeof mapRequest>[0]))
  } catch {
    return err('Database error')
  }
}
