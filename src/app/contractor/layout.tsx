import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ContractorLayoutClient } from '@/components/layout/ContractorLayoutClient'

export default async function ContractorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'contractor') redirect('/')

  return <ContractorLayoutClient>{children}</ContractorLayoutClient>
}
