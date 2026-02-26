'use server'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'

export interface CustomerRow {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  address: string
  suburb: string
  state: string
  postcode: string
  notes: string
  paymentMethod: string
  joinedDate: string
  totalJobs: number
  totalSpend: number
  status: 'active' | 'inactive'
}

function mapCustomer(
  c: Awaited<ReturnType<typeof prisma.customerProfile.findMany>>[number] & {
    user: { name: string; email: string }
    _count: { jobs: number }
    _sum?: { totalAmount: number | null } | null
  }
): CustomerRow {
  return {
    id: c.id,
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    phone: c.phone,
    address: c.address,
    suburb: c.suburb,
    state: c.state,
    postcode: c.postcode,
    notes: c.notes,
    paymentMethod: c.paymentMethod,
    joinedDate: c.joinedDate,
    totalJobs: c._count.jobs,
    totalSpend: (c as { jobs?: { totalAmount: number }[] }).jobs?.reduce((s, j) => s + j.totalAmount, 0) ?? 0,
    status: 'active' as const,
  }
}

export async function getCustomers(): Promise<ActionResult<CustomerRow[]>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  try {
    const customers = await prisma.customerProfile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { jobs: true } },
        jobs: { select: { totalAmount: true } },
      },
      orderBy: { joinedDate: 'desc' },
    })
    return ok(customers.map(c => mapCustomer(c as Parameters<typeof mapCustomer>[0])))
  } catch {
    return err('Database error')
  }
}

export async function getCustomerById(id: string): Promise<ActionResult<CustomerRow>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const c = await prisma.customerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { jobs: true } },
        jobs: { select: { totalAmount: true } },
      },
    })
    if (!c) return err('Not found')
    return ok(mapCustomer(c as Parameters<typeof mapCustomer>[0]))
  } catch {
    return err('Database error')
  }
}

export async function getMyCustomerProfile(): Promise<ActionResult<CustomerRow>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const c = await prisma.customerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { jobs: true } },
        jobs: { select: { totalAmount: true } },
      },
    })
    if (!c) return err('Not found')
    return ok(mapCustomer(c as Parameters<typeof mapCustomer>[0]))
  } catch {
    return err('Database error')
  }
}

const updateSchema = z.object({
  id: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
})

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  suburb: z.string().min(1),
  postcode: z.string().min(1),
  notes: z.string().optional(),
})

export async function createCustomer(input: z.infer<typeof createCustomerSchema>): Promise<ActionResult<CustomerRow>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = createCustomerSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { name, email, phone, address, suburb, postcode, notes } = parsed.data

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return err('A user with that email already exists')

    const passwordHash = await hash('password123', 12)
    const today = new Date().toISOString().slice(0, 10)

    const profile = await prisma.customerProfile.create({
      data: {
        phone, address, suburb, postcode,
        notes: notes ?? '',
        state: 'NSW',
        paymentMethod: 'Not set',
        joinedDate: today,
        user: {
          create: { name, email, passwordHash, role: 'customer' },
        },
      },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { jobs: true } },
      },
    })
    return ok(mapCustomer({ ...profile, jobs: [] } as Parameters<typeof mapCustomer>[0]))
  } catch {
    return err('Database error')
  }
}

export async function updateCustomerProfile(input: z.infer<typeof updateSchema>): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { id, ...data } = parsed.data

  try {
    await prisma.customerProfile.update({ where: { id }, data })
    return ok({ id })
  } catch {
    return err('Database error')
  }
}
