export type TimeWindow = 'morning' | 'afternoon' | 'evening'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type WeeklyAvailability = {
  [K in DayKey]: TimeWindow[]
}

export interface ContractorProfile {
  id: string
  name: string
  email: string
  phone: string
  abn: string
  skills: string[]
  serviceSuburbs: string[]
  hourlyRate: number
  rating: number
  status: 'available' | 'busy' | 'offline'
  currentJobs: number
  completedJobs: number
  availability: WeeklyAvailability
}

export interface JobRequest {
  id: string
  customerId: string
  customerName: string
  serviceType: string
  description: string
  address: string
  suburb: string
  preferredDates: string[]
  preferredTime: TimeWindow | 'any'
  priority: 'normal' | 'urgent' | 'emergency'
  status: 'pending' | 'matched' | 'confirmed'
  matchedContractorId?: string
  matchedContractorName?: string
  createdAt: string
}

export interface ContractorMatch {
  contractorId: string
  contractorName: string
  rating: number
  hourlyRate: number
  currentStatus: string
  skillScore: number        // 0–100
  geoScore: number          // 0–100
  availabilityScore: number // 0–100
  overallScore: number      // weighted: skill 40%, geo 35%, avail 25%
  availableOn: string[]
}

export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  suburb: string
  state: string
  postcode: string
  joinedDate?: string
}
