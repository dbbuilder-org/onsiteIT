'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'
import type { ContractorStatus } from '@prisma/client'

export interface ContractorRow {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  abn: string
  skills: string[]
  serviceSuburbs: string[]
  /** Alias for serviceSuburbs — used by legacy page components */
  suburbs: string[]
  hourlyRate: number
  rating: number
  status: ContractorStatus
  availability: Record<string, string[]>
  joinedDate: string
  currentJobs: number
  completedJobs: number
}

function mapContractor(
  c: Awaited<ReturnType<typeof prisma.contractorProfile.findMany>>[number] & {
    user: { name: string; email: string }
    _count: { jobs: number }
  }
): ContractorRow {
  return {
    id: c.id,
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    phone: c.phone,
    abn: c.abn,
    skills: c.skills,
    serviceSuburbs: c.serviceSuburbs,
    suburbs: c.serviceSuburbs,
    hourlyRate: c.hourlyRate,
    rating: c.rating,
    status: c.status,
    availability: c.availability as Record<string, string[]>,
    joinedDate: c.joinedDate,
    currentJobs: c._count.jobs,
    completedJobs: 0, // computed separately if needed
  }
}

const include = {
  user: { select: { name: true, email: true } },
  _count: { select: { jobs: true } },
}

export async function getContractors(): Promise<ActionResult<ContractorRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const contractors = await prisma.contractorProfile.findMany({
      include,
      orderBy: { rating: 'desc' },
    })
    return ok(contractors.map(c => mapContractor(c as Parameters<typeof mapContractor>[0])))
  } catch {
    return err('Database error')
  }
}

export async function getContractorProfile(id: string): Promise<ActionResult<ContractorRow>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const c = await prisma.contractorProfile.findUnique({ where: { id }, include })
    if (!c) return err('Not found')
    return ok(mapContractor(c as Parameters<typeof mapContractor>[0]))
  } catch {
    return err('Database error')
  }
}

export async function getMyContractorProfile(): Promise<ActionResult<ContractorRow>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const c = await prisma.contractorProfile.findUnique({ where: { userId: session.user.id }, include })
    if (!c) return err('Not found')
    return ok(mapContractor(c as Parameters<typeof mapContractor>[0]))
  } catch {
    return err('Database error')
  }
}

const updateSchema = z.object({
  id: z.string(),
  skills: z.array(z.string()).optional(),
  serviceSuburbs: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  status: z.enum(['available', 'busy', 'offline']).optional(),
  availability: z.record(z.string(), z.array(z.string())).optional(),
  phone: z.string().optional(),
})

export async function updateContractorProfile(input: z.infer<typeof updateSchema>): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { id, ...data } = parsed.data

  try {
    await prisma.contractorProfile.update({ where: { id }, data })
    return ok({ id })
  } catch {
    return err('Database error')
  }
}
