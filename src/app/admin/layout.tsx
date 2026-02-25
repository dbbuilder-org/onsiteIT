import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from '@/components/layout/AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/')

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
