import type { JobStatus as PrismaJobStatus } from '@prisma/client'

/** Convert UI hyphenated status to DB underscore enum */
export function toDbStatus(status: string): PrismaJobStatus {
  return status.replace('-', '_') as PrismaJobStatus
}

/** Convert DB underscore enum back to UI hyphenated display string */
export function fromDbStatus(status: PrismaJobStatus): string {
  return status.replace('_', '-')
}
