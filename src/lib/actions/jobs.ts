'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { toDbStatus, fromDbStatus } from '@/lib/job-status'
import { ok, err, type ActionResult } from './result'
import { sendJobAssignmentEmail } from '@/lib/email'
import type { JobPriority, JobStatus } from '@prisma/client'

export interface JobRow {
  id: string
  customerId: string
  customerName: string
  contractorId: string | null
  contractorName: string | null
  title: string
  description: string
  type: string
  status: string
  priority: JobPriority
  scheduledDate: string
  completedDate?: string
  address: string
  suburb: string
  laborHours: number
  laborRate: number
  partsUsed: { name: string; qty: number; cost: number }[]
  totalAmount: number
  notes: string[]
  createdAt: string
}

function mapJob(job: Awaited<ReturnType<typeof prisma.job.findMany>>[number] & {
  customer: { user: { name: string } }
  contractor: { user: { name: string } } | null
}): JobRow {
  return {
    id: job.id,
    customerId: job.customerId,
    customerName: job.customer.user.name,
    contractorId: job.contractorId,
    contractorName: job.contractor?.user.name ?? null,
    title: job.title,
    description: job.description,
    type: job.type,
    status: fromDbStatus(job.status),
    priority: job.priority,
    scheduledDate: job.scheduledDate.toISOString(),
    completedDate: job.completedDate?.toISOString(),
    address: job.address,
    suburb: job.suburb,
    laborHours: job.laborHours,
    laborRate: job.laborRate,
    partsUsed: job.partsUsed as { name: string; qty: number; cost: number }[],
    totalAmount: job.totalAmount,
    notes: job.notes,
    createdAt: job.createdAt.toISOString(),
  }
}

const include = {
  customer: { include: { user: { select: { name: true, email: true } } } },
  contractor: { include: { user: { select: { name: true, email: true } } } },
}

export async function getJobs(filter?: { contractorId?: string; customerId?: string }): Promise<ActionResult<JobRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const jobs = await prisma.job.findMany({
      where: filter,
      include,
      orderBy: { scheduledDate: 'desc' },
    })
    return ok(jobs.map(mapJob))
  } catch {
    return err('Database error')
  }
}

const updateStatusSchema = z.object({
  jobId: z.string(),
  status: z.enum(['pending', 'assigned', 'in-progress', 'completed', 'cancelled']),
})

export async function updateJobStatus(input: z.infer<typeof updateStatusSchema>): Promise<ActionResult<JobRow>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  const parsed = updateStatusSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    const job = await prisma.job.update({
      where: { id: parsed.data.jobId },
      data: {
        status: toDbStatus(parsed.data.status),
        completedDate: parsed.data.status === 'completed' ? new Date() : undefined,
      },
      include,
    })
    return ok(mapJob(job))
  } catch {
    return err('Database error')
  }
}

// --- assign contractor ---

const assignSchema = z.object({
  jobId: z.string(),
  contractorId: z.string(),
})

export async function assignContractor(input: z.infer<typeof assignSchema>): Promise<ActionResult<JobRow>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = assignSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    const job = await prisma.job.update({
      where: { id: parsed.data.jobId },
      data: { contractorId: parsed.data.contractorId, status: 'assigned' },
      include,
    })
    if (job.contractor) {
      await sendJobAssignmentEmail({
        contractorEmail: job.contractor.user.email,
        contractorName: job.contractor.user.name,
        jobTitle: job.title,
        customerName: job.customer.user.name,
        address: job.address,
        suburb: job.suburb,
        scheduledDate: job.scheduledDate.toISOString(),
      })
    }
    return ok(mapJob(job))
  } catch {
    return err('Database error')
  }
}

// --- create job ---

const createJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  customerId: z.string().min(1),
  contractorId: z.string().optional(),
  address: z.string().min(1),
  suburb: z.string().min(1),
  scheduledDate: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  laborRate: z.number().min(0),
})

export async function createJob(input: z.infer<typeof createJobSchema>): Promise<ActionResult<JobRow>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = createJobSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { contractorId, scheduledDate, ...rest } = parsed.data
  const status: JobStatus = contractorId ? 'assigned' : 'pending'

  try {
    const job = await prisma.job.create({
      data: {
        ...rest,
        contractorId: contractorId ?? null,
        scheduledDate: new Date(scheduledDate),
        status,
        priority: rest.priority as JobPriority,
        laborHours: 0,
        totalAmount: 0,
        partsUsed: [],
        notes: [],
      },
      include,
    })
    if (contractorId && job.contractor) {
      await sendJobAssignmentEmail({
        contractorEmail: job.contractor.user.email,
        contractorName: job.contractor.user.name,
        jobTitle: job.title,
        customerName: job.customer.user.name,
        address: job.address,
        suburb: job.suburb,
        scheduledDate: job.scheduledDate.toISOString(),
      })
    }
    return ok(mapJob(job))
  } catch {
    return err('Database error')
  }
}
