import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CustomerLayoutClient } from '@/components/layout/CustomerLayoutClient'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'customer') redirect('/')

  return <CustomerLayoutClient>{children}</CustomerLayoutClient>
}
