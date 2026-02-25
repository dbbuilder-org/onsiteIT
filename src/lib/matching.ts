import type { JobRequest, ContractorProfile, ContractorMatch, DayKey, TimeWindow } from './types'

const SERVICE_TO_SKILLS: Record<string, string[]> = {
  'Computer Repair':       ['Windows Repair', 'Hardware Repair'],
  'Laptop Repair':         ['Hardware Repair', 'Windows Repair'],
  'Network Setup':         ['Networking', 'WiFi Setup'],
  'WiFi Installation':     ['WiFi Setup', 'Networking'],
  'Server Setup':          ['Server Setup', 'Active Directory'],
  'Cloud Migration':       ['Cloud Migration', 'VMware'],
  'CCTV Installation':     ['CCTV Installation', 'Security Systems'],
  'Smart Home Setup':      ['Smart Home', 'Networking'],
  'Virus/Malware Removal': ['Virus Removal', 'Windows Repair'],
  'Data Recovery':         ['Data Recovery'],
  'Screen Replacement':    ['Hardware Repair', 'Laptop Screen Replacement'],
  'Mac Repair':            ['Mac Repair', 'iOS Support'],
  'Office 365 Setup':      ['Office 365', 'Email Configuration'],
  'Email Configuration':   ['Email Configuration', 'Office 365'],
  'Printer Setup':         ['Printer Setup', 'WiFi Setup'],
  'Software Installation': ['Software Installation'],
  'Hardware Upgrade':      ['Hardware Repair'],
  'System Tune-up':        ['Windows Repair', 'Virus Removal'],
  'Emergency Call-out':    [],
}

// Maps Date.getDay() (0=Sun … 6=Sat) to DayKey
const DAY_MAP: Record<number, DayKey> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
}

// Parse "YYYY-MM-DD" in local time to avoid UTC offset shifting the day
function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function scoreMatch(job: JobRequest, c: ContractorProfile): ContractorMatch {
  const requiredSkills = SERVICE_TO_SKILLS[job.serviceType] ?? []

  // Skill score (40%)
  let skillScore: number
  if (requiredSkills.length === 0) {
    skillScore = 50 // neutral when no mapping exists
  } else {
    const matching = requiredSkills.filter(s => c.skills.includes(s)).length
    skillScore = Math.round((matching / requiredSkills.length) * 100)
  }

  // Geo score (35%) — binary: contractor serves the suburb or not
  const geoScore = c.serviceSuburbs.includes(job.suburb) ? 100 : 0

  // Availability score (25%)
  const availableOn: string[] = []
  let availabilityScore: number

  if (job.preferredDates.length > 0) {
    for (const dateStr of job.preferredDates) {
      const dayKey = DAY_MAP[parseLocalDate(dateStr).getDay()]
      const dayWindows = c.availability[dayKey] ?? []
      const matches =
        job.preferredTime === 'any'
          ? dayWindows.length > 0
          : dayWindows.includes(job.preferredTime as TimeWindow)
      if (matches) availableOn.push(dateStr)
    }
    availabilityScore = Math.round((availableOn.length / job.preferredDates.length) * 100)
  } else {
    availabilityScore = 50
  }

  const overallScore = Math.round(
    skillScore * 0.4 + geoScore * 0.35 + availabilityScore * 0.25
  )

  return {
    contractorId: c.id,
    contractorName: c.name,
    rating: c.rating,
    hourlyRate: c.hourlyRate,
    currentStatus: c.status,
    skillScore,
    geoScore,
    availabilityScore,
    overallScore,
    availableOn,
  }
}

export function rankMatches(
  job: JobRequest,
  contractors: ContractorProfile[]
): ContractorMatch[] {
  return contractors
    .filter(c => c.status !== 'offline')
    .map(c => scoreMatch(job, c))
    .sort((a, b) => b.overallScore - a.overallScore)
}
