'use server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ok, err, type ActionResult } from './result'

export interface InventoryRow {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  unitCost: number
  supplier: string
}

export async function getInventory(): Promise<ActionResult<InventoryRow[]>> {
  const session = await auth()
  if (!session) return err('Unauthorized')

  try {
    const items = await prisma.inventoryItem.findMany({ orderBy: { category: 'asc' } })
    return ok(items)
  } catch {
    return err('Database error')
  }
}

const updateStockSchema = z.object({
  id: z.string(),
  stock: z.number().int().min(0),
})

export async function updateStock(input: z.infer<typeof updateStockSchema>): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return err('Forbidden')

  const parsed = updateStockSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  try {
    await prisma.inventoryItem.update({ where: { id: parsed.data.id }, data: { stock: parsed.data.stock } })
    return ok({ id: parsed.data.id })
  } catch {
    return err('Database error')
  }
}
