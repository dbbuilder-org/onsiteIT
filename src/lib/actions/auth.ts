'use server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(1),
  address: z.string().min(1),
  suburb: z.string().min(1),
  postcode: z.string().min(4),
})

export async function signUpCustomerAction(
  input: z.infer<typeof signUpSchema>
): Promise<ActionResult<{ email: string }>> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { name, email, password, phone, address, suburb, postcode } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return err('An account with this email already exists.')

  try {
    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'customer',
        customerProfile: {
          create: {
            phone,
            address,
            suburb,
            state: 'NSW',
            postcode,
            joinedDate: new Date().toISOString().split('T')[0],
          },
        },
      },
    })
    return ok({ email: user.email })
  } catch {
    return err('Failed to create account.')
  }
}
