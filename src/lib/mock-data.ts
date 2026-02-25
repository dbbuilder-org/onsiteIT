export type Role = 'admin' | 'contractor' | 'customer'

export type JobStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  suburb: string
  state: string
  postcode: string
  totalJobs: number
  totalSpend: number
  status: 'active' | 'inactive'
  joinedDate: string
  notes: string
  paymentMethod: string
}

export interface Contractor {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  suburbs: string[]
  hourlyRate: number
  rating: number
  status: 'available' | 'busy' | 'offline'
  currentJobs: number
  completedJobs: number
  joinedDate: string
  abn: string
  avatar?: string
}

export interface Job {
  id: string
  customerId: string
  customerName: string
  contractorId: string | null
  contractorName: string | null
  title: string
  description: string
  type: string
  status: JobStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledDate: string
  completedDate?: string
  address: string
  suburb: string
  laborHours: number
  laborRate: number
  partsUsed: { name: string; qty: number; cost: number }[]
  totalAmount: number
  notes: string[]
  createdAt: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  unitCost: number
  supplier: string
}

export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  customerName: string
  contractorId: string | null
  status: QuoteStatus
  lineItems: { description: string; qty: number; unitPrice: number }[]
  total: number
  createdAt: string
  expiryDate: string
  notes: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  jobId: string
  status: InvoiceStatus
  lineItems: { description: string; qty: number; unitPrice: number }[]
  subtotal: number
  gst: number
  total: number
  createdAt: string
  dueDate: string
  paidDate?: string
}

export interface ContractorPay {
  id: string
  contractorId: string
  contractorName: string
  period: string
  hoursLogged: number
  jobsCompleted: number
  grossAmount: number
  status: 'pending' | 'paid'
  payDate?: string
}

export const customers: Customer[] = [
  {
    id: 'c1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '0412 345 678',
    address: '42 Rosewood Drive',
    suburb: 'Chatswood',
    state: 'NSW',
    postcode: '2067',
    totalJobs: 5,
    totalSpend: 1840,
    status: 'active',
    joinedDate: '2024-03-15',
    notes: 'Prefers morning appointments. Has a home office setup.',
    paymentMethod: 'Visa ****4532'
  },
  {
    id: 'c2',
    name: 'David Chen',
    email: 'david.chen@techcorp.com.au',
    phone: '0423 567 890',
    address: '15 Harbor Street',
    suburb: 'Pyrmont',
    state: 'NSW',
    postcode: '2009',
    totalJobs: 12,
    totalSpend: 4920,
    status: 'active',
    joinedDate: '2023-11-20',
    notes: 'Business account. Multiple computers. Invoiced monthly.',
    paymentMethod: 'Mastercard ****8821'
  },
  {
    id: 'c3',
    name: 'Emma Rodriguez',
    email: 'emma.r@gmail.com',
    phone: '0434 789 012',
    address: '8 Sunset Boulevard',
    suburb: 'Manly',
    state: 'NSW',
    postcode: '2095',
    totalJobs: 2,
    totalSpend: 380,
    status: 'active',
    joinedDate: '2025-01-08',
    notes: 'First-time customer. MacBook user.',
    paymentMethod: 'PayID'
  },
  {
    id: 'c4',
    name: 'James Wilson',
    email: 'jwilson@bigpond.com',
    phone: '0445 901 234',
    address: '103 Oak Lane',
    suburb: 'Parramatta',
    state: 'NSW',
    postcode: '2150',
    totalJobs: 8,
    totalSpend: 2650,
    status: 'active',
    joinedDate: '2024-06-01',
    notes: 'Retired. Prefers clear explanations. Call before arrival.',
    paymentMethod: 'Visa ****1109'
  },
  {
    id: 'c5',
    name: 'Priya Patel',
    email: 'priya.patel@lawfirm.com.au',
    phone: '0456 012 345',
    address: '55 George Street',
    suburb: 'Sydney CBD',
    state: 'NSW',
    postcode: '2000',
    totalJobs: 3,
    totalSpend: 1250,
    status: 'active',
    joinedDate: '2024-09-12',
    notes: 'Law office. Security-conscious. Requires NDA.',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'c6',
    name: 'Tom Nguyen',
    email: 'tom.n@startup.io',
    phone: '0467 234 567',
    address: '22 Innovation Way',
    suburb: 'Alexandria',
    state: 'NSW',
    postcode: '2015',
    totalJobs: 6,
    totalSpend: 2180,
    status: 'active',
    joinedDate: '2024-02-28',
    notes: 'Tech startup. Flexible hours including evenings.',
    paymentMethod: 'Mastercard ****5533'
  },
  {
    id: 'c7',
    name: 'Linda Fraser',
    email: 'linda.fraser@school.edu.au',
    phone: '0478 456 789',
    address: '7 Education Road',
    suburb: 'Strathfield',
    state: 'NSW',
    postcode: '2135',
    totalJobs: 4,
    totalSpend: 960,
    status: 'inactive',
    joinedDate: '2023-08-15',
    notes: 'School IT coordinator. Bulk discounts negotiated.',
    paymentMethod: 'Purchase Order'
  },
  {
    id: 'c8',
    name: 'Michael Brown',
    email: 'michael.brown@realestate.com.au',
    phone: '0489 678 901',
    address: '31 Commerce Street',
    suburb: 'Bondi Junction',
    state: 'NSW',
    postcode: '2022',
    totalJobs: 9,
    totalSpend: 3400,
    status: 'active',
    joinedDate: '2023-12-05',
    notes: 'Real estate office. Urgent jobs common. Priority customer.',
    paymentMethod: 'Visa ****7744'
  }
]

export const contractors: Contractor[] = [
  {
    id: 'ct1',
    name: 'Alex Thompson',
    email: 'tech@onsiteit.com',
    phone: '0411 111 111',
    skills: ['Networking', 'Windows Repair', 'Server Setup', 'CCTV Installation', 'Data Recovery'],
    suburbs: ['Chatswood', 'North Sydney', 'Willoughby', 'Crows Nest', 'St Leonards'],
    hourlyRate: 95,
    rating: 4.9,
    status: 'available',
    currentJobs: 2,
    completedJobs: 87,
    joinedDate: '2023-06-01',
    abn: '12 345 678 901'
  },
  {
    id: 'ct2',
    name: 'Jessica Park',
    email: 'jessica.park@onsiteit.com',
    phone: '0422 222 222',
    skills: ['Mac Repair', 'iOS Support', 'Data Backup', 'Software Installation', 'Printer Setup'],
    suburbs: ['Manly', 'Dee Why', 'Brookvale', 'Freshwater', 'Curl Curl'],
    hourlyRate: 90,
    rating: 4.8,
    status: 'busy',
    currentJobs: 3,
    completedJobs: 64,
    joinedDate: '2023-09-15',
    abn: '23 456 789 012'
  },
  {
    id: 'ct3',
    name: 'Marcus Williams',
    email: 'marcus.w@onsiteit.com',
    phone: '0433 333 333',
    skills: ['Server Setup', 'Cloud Migration', 'Active Directory', 'VMware', 'Networking'],
    suburbs: ['Parramatta', 'Westmead', 'Merrylands', 'Granville', 'Harris Park'],
    hourlyRate: 110,
    rating: 4.7,
    status: 'available',
    currentJobs: 1,
    completedJobs: 52,
    joinedDate: '2024-01-10',
    abn: '34 567 890 123'
  },
  {
    id: 'ct4',
    name: 'Sophie Lee',
    email: 'sophie.lee@onsiteit.com',
    phone: '0444 444 444',
    skills: ['Hardware Repair', 'Laptop Screen Replacement', 'Data Recovery', 'Virus Removal', 'Windows Repair'],
    suburbs: ['Sydney CBD', 'Surry Hills', 'Pyrmont', 'Ultimo', 'Glebe'],
    hourlyRate: 85,
    rating: 4.6,
    status: 'available',
    currentJobs: 1,
    completedJobs: 43,
    joinedDate: '2024-03-20',
    abn: '45 678 901 234'
  },
  {
    id: 'ct5',
    name: 'Ryan Garcia',
    email: 'ryan.g@onsiteit.com',
    phone: '0455 555 555',
    skills: ['CCTV Installation', 'Smart Home', 'Networking', 'Security Systems', 'Cable Management'],
    suburbs: ['Alexandria', 'Newtown', 'Erskineville', 'St Peters', 'Marrickville'],
    hourlyRate: 95,
    rating: 4.8,
    status: 'busy',
    currentJobs: 2,
    completedJobs: 71,
    joinedDate: '2023-11-05',
    abn: '56 789 012 345'
  },
  {
    id: 'ct6',
    name: 'Natalie Kim',
    email: 'natalie.k@onsiteit.com',
    phone: '0466 666 666',
    skills: ['Printer Setup', 'WiFi Setup', 'Email Configuration', 'Office 365', 'Software Installation'],
    suburbs: ['Bondi', 'Bondi Junction', 'Randwick', 'Coogee', 'Kingsford'],
    hourlyRate: 80,
    rating: 4.5,
    status: 'offline',
    currentJobs: 0,
    completedJobs: 38,
    joinedDate: '2024-05-01',
    abn: '67 890 123 456'
  }
]

export const jobs: Job[] = [
  {
    id: 'j1',
    customerId: 'c1',
    customerName: 'Sarah Mitchell',
    contractorId: 'ct1',
    contractorName: 'Alex Thompson',
    title: 'Home Network Setup & WiFi Extender',
    description: 'Customer needs full home network setup with mesh WiFi system. Current single router not covering back rooms.',
    type: 'Networking',
    status: 'in-progress',
    priority: 'medium',
    scheduledDate: '2026-02-24T09:00:00',
    address: '42 Rosewood Drive, Chatswood NSW 2067',
    suburb: 'Chatswood',
    laborHours: 3,
    laborRate: 95,
    partsUsed: [{ name: 'TP-Link Deco M5 (3-pack)', qty: 1, cost: 249 }],
    totalAmount: 534,
    notes: ['Customer prefers mesh system over extenders', 'Has 5 devices to reconnect after setup'],
    createdAt: '2026-02-20T10:00:00'
  },
  {
    id: 'j2',
    customerId: 'c2',
    customerName: 'David Chen',
    contractorId: 'ct3',
    contractorName: 'Marcus Williams',
    title: 'Server Migration to Cloud',
    description: 'Migrate on-premise server to Azure. Includes data migration, user account setup, and testing.',
    type: 'Server Setup',
    status: 'assigned',
    priority: 'high',
    scheduledDate: '2026-02-25T08:00:00',
    address: '15 Harbor Street, Pyrmont NSW 2009',
    suburb: 'Pyrmont',
    laborHours: 8,
    laborRate: 110,
    partsUsed: [],
    totalAmount: 880,
    notes: ['Azure subscription already active', 'Migration window: 8am-4pm Saturday'],
    createdAt: '2026-02-18T14:00:00'
  },
  {
    id: 'j3',
    customerId: 'c3',
    customerName: 'Emma Rodriguez',
    contractorId: 'ct2',
    contractorName: 'Jessica Park',
    title: 'MacBook Screen Replacement',
    description: 'MacBook Pro 13" 2021 screen cracked. Needs full display replacement.',
    type: 'Hardware Repair',
    status: 'completed',
    priority: 'medium',
    scheduledDate: '2026-02-21T11:00:00',
    completedDate: '2026-02-21T14:30:00',
    address: '8 Sunset Boulevard, Manly NSW 2095',
    suburb: 'Manly',
    laborHours: 2.5,
    laborRate: 90,
    partsUsed: [{ name: 'MacBook Pro 13" Display Assembly', qty: 1, cost: 320 }],
    totalAmount: 545,
    notes: ['Screen replacement successful', 'Tested display at all brightness levels', 'Customer very happy'],
    createdAt: '2026-02-19T09:00:00'
  },
  {
    id: 'j4',
    customerId: 'c4',
    customerName: 'James Wilson',
    contractorId: null,
    contractorName: null,
    title: 'Virus Removal & System Cleanup',
    description: 'Windows 11 PC running very slow. Multiple popups. Suspected malware infection.',
    type: 'Virus Removal',
    status: 'pending',
    priority: 'high',
    scheduledDate: '2026-02-26T10:00:00',
    address: '103 Oak Lane, Parramatta NSW 2150',
    suburb: 'Parramatta',
    laborHours: 2,
    laborRate: 95,
    partsUsed: [],
    totalAmount: 190,
    notes: ['Urgent - customer cannot use computer for work'],
    createdAt: '2026-02-23T08:00:00'
  },
  {
    id: 'j5',
    customerId: 'c5',
    customerName: 'Priya Patel',
    contractorId: 'ct4',
    contractorName: 'Sophie Lee',
    title: 'Office 365 Setup & Email Migration',
    description: 'Setup Office 365 Business for 5 users. Migrate emails from old G-Suite account.',
    type: 'Software Installation',
    status: 'in-progress',
    priority: 'high',
    scheduledDate: '2026-02-23T09:00:00',
    address: '55 George Street, Sydney CBD NSW 2000',
    suburb: 'Sydney CBD',
    laborHours: 4,
    laborRate: 85,
    partsUsed: [],
    totalAmount: 340,
    notes: ['5 user licenses purchased', 'Data migration in progress'],
    createdAt: '2026-02-17T11:00:00'
  },
  {
    id: 'j6',
    customerId: 'c6',
    customerName: 'Tom Nguyen',
    contractorId: 'ct5',
    contractorName: 'Ryan Garcia',
    title: 'CCTV System Installation',
    description: '8-camera CCTV system installation for startup office. Includes NVR setup and remote access.',
    type: 'CCTV Installation',
    status: 'completed',
    priority: 'medium',
    scheduledDate: '2026-02-20T08:00:00',
    completedDate: '2026-02-20T16:00:00',
    address: '22 Innovation Way, Alexandria NSW 2015',
    suburb: 'Alexandria',
    laborHours: 7,
    laborRate: 95,
    partsUsed: [
      { name: 'Hikvision 4K Camera (x8)', qty: 8, cost: 120 },
      { name: '8-Channel NVR', qty: 1, cost: 380 },
      { name: 'CAT6 Cable (50m)', qty: 2, cost: 45 }
    ],
    totalAmount: 1971,
    notes: ['All 8 cameras operational', 'Remote access configured', 'Customer trained on system'],
    createdAt: '2026-02-15T10:00:00'
  },
  {
    id: 'j7',
    customerId: 'c8',
    customerName: 'Michael Brown',
    contractorId: 'ct1',
    contractorName: 'Alex Thompson',
    title: 'Network Infrastructure Upgrade',
    description: 'Upgrade office network from 100Mbps to Gigabit. New managed switch and WAP installation.',
    type: 'Networking',
    status: 'assigned',
    priority: 'medium',
    scheduledDate: '2026-02-27T09:00:00',
    address: '31 Commerce Street, Bondi Junction NSW 2022',
    suburb: 'Bondi Junction',
    laborHours: 5,
    laborRate: 95,
    partsUsed: [
      { name: 'Ubiquiti UniFi 24-port Switch', qty: 1, cost: 420 },
      { name: 'Ubiquiti UAP-AC-PRO WAP', qty: 2, cost: 220 }
    ],
    totalAmount: 1335,
    notes: ['Parts ordered, ETA 26 Feb'],
    createdAt: '2026-02-22T14:00:00'
  },
  {
    id: 'j8',
    customerId: 'c7',
    customerName: 'Linda Fraser',
    contractorId: 'ct4',
    contractorName: 'Sophie Lee',
    title: 'Data Recovery from Failed HDD',
    description: 'School laptop HDD failed. Critical student data needs recovery before replacement.',
    type: 'Data Recovery',
    status: 'completed',
    priority: 'urgent',
    scheduledDate: '2026-02-19T10:00:00',
    completedDate: '2026-02-19T15:00:00',
    address: '7 Education Road, Strathfield NSW 2135',
    suburb: 'Strathfield',
    laborHours: 4,
    laborRate: 85,
    partsUsed: [{ name: '500GB SSD Replacement', qty: 1, cost: 95 }],
    totalAmount: 435,
    notes: ['95% data recovered', 'New SSD installed', 'Windows reinstalled'],
    createdAt: '2026-02-18T08:00:00'
  },
  {
    id: 'j9',
    customerId: 'c2',
    customerName: 'David Chen',
    contractorId: 'ct3',
    contractorName: 'Marcus Williams',
    title: 'Active Directory Setup',
    description: 'Setup Windows Server AD for 20 users. Group policies, shared drives, and print management.',
    type: 'Server Setup',
    status: 'completed',
    priority: 'high',
    scheduledDate: '2026-02-15T08:00:00',
    completedDate: '2026-02-15T17:00:00',
    address: '15 Harbor Street, Pyrmont NSW 2009',
    suburb: 'Pyrmont',
    laborHours: 8,
    laborRate: 110,
    partsUsed: [{ name: 'Windows Server 2022 CAL x20', qty: 1, cost: 480 }],
    totalAmount: 1360,
    notes: ['AD configured for 20 users', 'Group policies applied', 'All users tested'],
    createdAt: '2026-02-10T09:00:00'
  },
  {
    id: 'j10',
    customerId: 'c1',
    customerName: 'Sarah Mitchell',
    contractorId: 'ct2',
    contractorName: 'Jessica Park',
    title: 'Printer Network Setup',
    description: 'Configure HP LaserJet for network printing. Setup on all 3 home computers.',
    type: 'Printer Setup',
    status: 'completed',
    priority: 'low',
    scheduledDate: '2026-02-10T14:00:00',
    completedDate: '2026-02-10T16:00:00',
    address: '42 Rosewood Drive, Chatswood NSW 2067',
    suburb: 'Chatswood',
    laborHours: 1.5,
    laborRate: 90,
    partsUsed: [],
    totalAmount: 135,
    notes: ['Printer configured on all 3 PCs', 'Scan-to-email setup as bonus'],
    createdAt: '2026-02-09T10:00:00'
  },
  {
    id: 'j11',
    customerId: 'c8',
    customerName: 'Michael Brown',
    contractorId: null,
    contractorName: null,
    title: 'Emergency - Server Down',
    description: 'Office server unresponsive. Business cannot operate. Immediate assistance required.',
    type: 'Server Setup',
    status: 'pending',
    priority: 'urgent',
    scheduledDate: '2026-02-23T12:00:00',
    address: '31 Commerce Street, Bondi Junction NSW 2022',
    suburb: 'Bondi Junction',
    laborHours: 3,
    laborRate: 140,
    partsUsed: [],
    totalAmount: 420,
    notes: ['URGENT - Call immediately on arrival'],
    createdAt: '2026-02-23T11:00:00'
  },
  {
    id: 'j12',
    customerId: 'c6',
    customerName: 'Tom Nguyen',
    contractorId: 'ct5',
    contractorName: 'Ryan Garcia',
    title: 'Smart Home Integration',
    description: 'Connect Philips Hue, Nest thermostat, and Ring doorbell to central hub. Automate routines.',
    type: 'Smart Home',
    status: 'cancelled',
    priority: 'low',
    scheduledDate: '2026-02-22T13:00:00',
    address: '22 Innovation Way, Alexandria NSW 2015',
    suburb: 'Alexandria',
    laborHours: 0,
    laborRate: 95,
    partsUsed: [],
    totalAmount: 0,
    notes: ['Customer cancelled - moved offices'],
    createdAt: '2026-02-14T10:00:00'
  }
]

export const inventory: InventoryItem[] = [
  { id: 'i1', name: 'CAT6 Ethernet Cable 10m', sku: 'CBL-CAT6-10', category: 'Cables', stock: 24, minStock: 10, unitCost: 12.50, supplier: 'NetParts AU' },
  { id: 'i2', name: 'CAT6 Ethernet Cable 50m', sku: 'CBL-CAT6-50', category: 'Cables', stock: 8, minStock: 5, unitCost: 35.00, supplier: 'NetParts AU' },
  { id: 'i3', name: 'HDMI Cable 2m', sku: 'CBL-HDMI-2', category: 'Cables', stock: 15, minStock: 8, unitCost: 8.00, supplier: 'NetParts AU' },
  { id: 'i4', name: 'USB-C to USB-A Adapter', sku: 'ADP-USBC-A', category: 'Adapters', stock: 20, minStock: 10, unitCost: 6.50, supplier: 'Tech Supplies Direct' },
  { id: 'i5', name: 'TP-Link 8-Port Unmanaged Switch', sku: 'SWT-TPL-8U', category: 'Networking', stock: 5, minStock: 3, unitCost: 45.00, supplier: 'NetParts AU' },
  { id: 'i6', name: 'Ubiquiti UAP-AC-Lite WAP', sku: 'WAP-UBI-ACL', category: 'Networking', stock: 4, minStock: 2, unitCost: 135.00, supplier: 'Ubiquiti Distributor' },
  { id: 'i7', name: '500GB Samsung 870 EVO SSD', sku: 'SSD-SAM-500', category: 'Storage', stock: 7, minStock: 3, unitCost: 89.00, supplier: 'Samsung AU' },
  { id: 'i8', name: '1TB WD Blue HDD 3.5"', sku: 'HDD-WD-1T', category: 'Storage', stock: 6, minStock: 4, unitCost: 65.00, supplier: 'WD Distributor' },
  { id: 'i9', name: '8GB DDR4 RAM 3200MHz', sku: 'RAM-8G-3200', category: 'Memory', stock: 12, minStock: 6, unitCost: 38.00, supplier: 'Memory Express' },
  { id: 'i10', name: '16GB DDR4 RAM 3200MHz', sku: 'RAM-16G-3200', category: 'Memory', stock: 3, minStock: 4, unitCost: 72.00, supplier: 'Memory Express' },
  { id: 'i11', name: 'Thermal Paste Tube', sku: 'THM-PASTE-5G', category: 'Tools', stock: 18, minStock: 5, unitCost: 4.50, supplier: 'Tech Supplies Direct' },
  { id: 'i12', name: 'Anti-Static Wrist Strap', sku: 'TOL-ASW-01', category: 'Tools', stock: 9, minStock: 5, unitCost: 8.00, supplier: 'Tech Supplies Direct' },
  { id: 'i13', name: 'RJ45 Crimping Tool', sku: 'TOL-RJ45-CMP', category: 'Tools', stock: 4, minStock: 2, unitCost: 22.00, supplier: 'NetParts AU' },
  { id: 'i14', name: 'USB WiFi Adapter AC1300', sku: 'NET-USB-AC13', category: 'Networking', stock: 8, minStock: 4, unitCost: 28.00, supplier: 'Tech Supplies Direct' },
  { id: 'i15', name: 'Power Board 6-Outlet', sku: 'PWR-BRD-6PT', category: 'Power', stock: 2, minStock: 5, unitCost: 18.00, supplier: 'Electrical Wholesale' },
  { id: 'i16', name: 'Laptop Battery Universal', sku: 'BAT-LAP-UNI', category: 'Power', stock: 5, minStock: 3, unitCost: 65.00, supplier: 'Battery World Pro' },
  { id: 'i17', name: 'MacBook Pro 13" Display Asm.', sku: 'DSP-MBP-13', category: 'Screens', stock: 2, minStock: 2, unitCost: 290.00, supplier: 'Apple Parts AU' },
  { id: 'i18', name: '15.6" FHD Laptop Screen', sku: 'DSP-LAP-156', category: 'Screens', stock: 4, minStock: 3, unitCost: 85.00, supplier: 'Screen Warehouse' },
]

export const quotes: Quote[] = [
  {
    id: 'q1',
    quoteNumber: 'QT-2026-001',
    customerId: 'c4',
    customerName: 'James Wilson',
    contractorId: 'ct3',
    status: 'sent',
    lineItems: [
      { description: 'Server Installation & Configuration', qty: 1, unitPrice: 440 },
      { description: 'Dell PowerEdge T40 Server', qty: 1, unitPrice: 1200 },
      { description: 'Windows Server 2022 Standard', qty: 1, unitPrice: 520 },
      { description: 'CAT6 Cabling (20m)', qty: 2, unitPrice: 12.50 }
    ],
    total: 2185,
    createdAt: '2026-02-20T10:00:00',
    expiryDate: '2026-03-06T00:00:00',
    notes: 'Quote valid for 14 days. GST included in all prices.'
  },
  {
    id: 'q2',
    quoteNumber: 'QT-2026-002',
    customerId: 'c8',
    customerName: 'Michael Brown',
    contractorId: 'ct1',
    status: 'accepted',
    lineItems: [
      { description: 'Network Infrastructure Upgrade - Labor (5hrs)', qty: 5, unitPrice: 95 },
      { description: 'Ubiquiti UniFi 24-port Switch', qty: 1, unitPrice: 420 },
      { description: 'Ubiquiti UAP-AC-PRO WAP', qty: 2, unitPrice: 220 }
    ],
    total: 1335,
    createdAt: '2026-02-21T14:00:00',
    expiryDate: '2026-03-07T00:00:00',
    notes: 'Accepted by customer. Job scheduled for 27 Feb.'
  },
  {
    id: 'q3',
    quoteNumber: 'QT-2026-003',
    customerId: 'c5',
    customerName: 'Priya Patel',
    contractorId: null,
    status: 'draft',
    lineItems: [
      { description: 'Microsoft 365 Business Standard (5 users) - Setup', qty: 5, unitPrice: 45 },
      { description: 'Email Migration from G-Suite', qty: 1, unitPrice: 180 },
    ],
    total: 405,
    createdAt: '2026-02-22T09:00:00',
    expiryDate: '2026-03-08T00:00:00',
    notes: 'Draft pending review.'
  },
  {
    id: 'q4',
    quoteNumber: 'QT-2026-004',
    customerId: 'c7',
    customerName: 'Linda Fraser',
    contractorId: 'ct2',
    status: 'declined',
    lineItems: [
      { description: 'Bulk Laptop Refresh (10 units) - Labor', qty: 10, unitPrice: 85 },
      { description: 'Windows 11 Upgrade per unit', qty: 10, unitPrice: 35 }
    ],
    total: 1200,
    createdAt: '2026-02-15T10:00:00',
    expiryDate: '2026-03-01T00:00:00',
    notes: 'Customer declined - budget constraints.'
  },
  {
    id: 'q5',
    quoteNumber: 'QT-2026-005',
    customerId: 'c2',
    customerName: 'David Chen',
    contractorId: 'ct3',
    status: 'sent',
    lineItems: [
      { description: 'Azure Cloud Migration - Labor (8hrs)', qty: 8, unitPrice: 110 },
      { description: 'Azure Setup & Configuration', qty: 1, unitPrice: 350 },
    ],
    total: 1230,
    createdAt: '2026-02-22T15:00:00',
    expiryDate: '2026-03-08T00:00:00',
    notes: 'Awaiting customer approval.'
  }
]

export const invoices: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2026-001',
    customerId: 'c3',
    customerName: 'Emma Rodriguez',
    jobId: 'j3',
    status: 'paid',
    lineItems: [
      { description: 'MacBook Screen Replacement - Labor (2.5hrs)', qty: 2.5, unitPrice: 90 },
      { description: 'MacBook Pro 13" Display Assembly', qty: 1, unitPrice: 320 }
    ],
    subtotal: 545,
    gst: 54.50,
    total: 545,
    createdAt: '2026-02-21T15:00:00',
    dueDate: '2026-03-07T00:00:00',
    paidDate: '2026-02-22T10:30:00'
  },
  {
    id: 'inv2',
    invoiceNumber: 'INV-2026-002',
    customerId: 'c6',
    customerName: 'Tom Nguyen',
    jobId: 'j6',
    status: 'paid',
    lineItems: [
      { description: 'CCTV Installation - Labor (7hrs)', qty: 7, unitPrice: 95 },
      { description: 'Hikvision 4K Camera (x8)', qty: 8, unitPrice: 120 },
      { description: '8-Channel NVR', qty: 1, unitPrice: 380 },
      { description: 'CAT6 Cable 50m (x2)', qty: 2, unitPrice: 45 }
    ],
    subtotal: 1971,
    gst: 197.10,
    total: 1971,
    createdAt: '2026-02-20T17:00:00',
    dueDate: '2026-03-06T00:00:00',
    paidDate: '2026-02-21T09:00:00'
  },
  {
    id: 'inv3',
    invoiceNumber: 'INV-2026-003',
    customerId: 'c7',
    customerName: 'Linda Fraser',
    jobId: 'j8',
    status: 'sent',
    lineItems: [
      { description: 'Data Recovery Service - Labor (4hrs)', qty: 4, unitPrice: 85 },
      { description: '500GB SSD Replacement', qty: 1, unitPrice: 95 }
    ],
    subtotal: 435,
    gst: 43.50,
    total: 435,
    createdAt: '2026-02-19T16:00:00',
    dueDate: '2026-03-05T00:00:00'
  },
  {
    id: 'inv4',
    invoiceNumber: 'INV-2026-004',
    customerId: 'c2',
    customerName: 'David Chen',
    jobId: 'j9',
    status: 'overdue',
    lineItems: [
      { description: 'Active Directory Setup - Labor (8hrs)', qty: 8, unitPrice: 110 },
      { description: 'Windows Server 2022 CAL x20', qty: 1, unitPrice: 480 }
    ],
    subtotal: 1360,
    gst: 136.00,
    total: 1360,
    createdAt: '2026-02-15T18:00:00',
    dueDate: '2026-03-01T00:00:00'
  },
  {
    id: 'inv5',
    invoiceNumber: 'INV-2026-005',
    customerId: 'c1',
    customerName: 'Sarah Mitchell',
    jobId: 'j10',
    status: 'paid',
    lineItems: [
      { description: 'Printer Network Setup - Labor (1.5hrs)', qty: 1.5, unitPrice: 90 }
    ],
    subtotal: 135,
    gst: 13.50,
    total: 135,
    createdAt: '2026-02-10T17:00:00',
    dueDate: '2026-02-24T00:00:00',
    paidDate: '2026-02-15T11:00:00'
  },
  {
    id: 'inv6',
    invoiceNumber: 'INV-2026-006',
    customerId: 'c1',
    customerName: 'Sarah Mitchell',
    jobId: 'j1',
    status: 'draft',
    lineItems: [
      { description: 'Home Network Setup - Labor (3hrs)', qty: 3, unitPrice: 95 },
      { description: 'TP-Link Deco M5 Mesh System', qty: 1, unitPrice: 249 }
    ],
    subtotal: 534,
    gst: 53.40,
    total: 534,
    createdAt: '2026-02-23T09:00:00',
    dueDate: '2026-03-09T00:00:00'
  }
]

export const contractorPay: ContractorPay[] = [
  { id: 'cp1', contractorId: 'ct1', contractorName: 'Alex Thompson', period: 'Feb 1-15 2026', hoursLogged: 32, jobsCompleted: 8, grossAmount: 3040, status: 'paid', payDate: '2026-02-16' },
  { id: 'cp2', contractorId: 'ct2', contractorName: 'Jessica Park', period: 'Feb 1-15 2026', hoursLogged: 28, jobsCompleted: 7, grossAmount: 2520, status: 'paid', payDate: '2026-02-16' },
  { id: 'cp3', contractorId: 'ct3', contractorName: 'Marcus Williams', period: 'Feb 1-15 2026', hoursLogged: 24, jobsCompleted: 4, grossAmount: 2640, status: 'paid', payDate: '2026-02-16' },
  { id: 'cp4', contractorId: 'ct4', contractorName: 'Sophie Lee', period: 'Feb 1-15 2026', hoursLogged: 20, jobsCompleted: 6, grossAmount: 1700, status: 'paid', payDate: '2026-02-16' },
  { id: 'cp5', contractorId: 'ct5', contractorName: 'Ryan Garcia', period: 'Feb 1-15 2026', hoursLogged: 35, jobsCompleted: 9, grossAmount: 3325, status: 'paid', payDate: '2026-02-16' },
  { id: 'cp6', contractorId: 'ct1', contractorName: 'Alex Thompson', period: 'Feb 16-28 2026', hoursLogged: 18, jobsCompleted: 4, grossAmount: 1710, status: 'pending' },
  { id: 'cp7', contractorId: 'ct2', contractorName: 'Jessica Park', period: 'Feb 16-28 2026', hoursLogged: 22, jobsCompleted: 5, grossAmount: 1980, status: 'pending' },
  { id: 'cp8', contractorId: 'ct3', contractorName: 'Marcus Williams', period: 'Feb 16-28 2026', hoursLogged: 16, jobsCompleted: 3, grossAmount: 1760, status: 'pending' },
]

export const revenueData = [
  { month: 'Sep', revenue: 8200, jobs: 22 },
  { month: 'Oct', revenue: 11400, jobs: 31 },
  { month: 'Nov', revenue: 9800, jobs: 27 },
  { month: 'Dec', revenue: 7200, jobs: 20 },
  { month: 'Jan', revenue: 13600, jobs: 38 },
  { month: 'Feb', revenue: 10890, jobs: 29 },
]

export const jobsByCategory = [
  { name: 'Networking', value: 28, color: '#2563EB' },
  { name: 'Hardware Repair', value: 22, color: '#F97316' },
  { name: 'Server Setup', value: 18, color: '#10B981' },
  { name: 'CCTV/Security', value: 12, color: '#8B5CF6' },
  { name: 'Virus Removal', value: 10, color: '#EF4444' },
  { name: 'Other', value: 10, color: '#6B7280' },
]

export const serviceTypes = [
  'Computer Repair',
  'Laptop Repair',
  'Screen Replacement',
  'Virus/Malware Removal',
  'Data Recovery',
  'Network Setup',
  'WiFi Installation',
  'Server Setup',
  'Cloud Migration',
  'CCTV Installation',
  'Smart Home Setup',
  'Printer Setup',
  'Software Installation',
  'Office 365 Setup',
  'Email Configuration',
  'Hardware Upgrade',
  'System Tune-up',
  'Emergency Call-out',
]

export const skills = [
  'Networking',
  'Windows Repair',
  'Mac Repair',
  'iOS Support',
  'Android Support',
  'Server Setup',
  'Cloud Migration',
  'Active Directory',
  'CCTV Installation',
  'Smart Home',
  'Data Recovery',
  'Virus Removal',
  'Hardware Repair',
  'Laptop Screen Replacement',
  'Printer Setup',
  'WiFi Setup',
  'Office 365',
  'VMware',
  'Email Configuration',
  'Cable Management',
  'Software Installation',
  'Security Systems',
]

export const nswSuburbs = [
  'Alexandria', 'Artarmon', 'Ashfield', 'Balmain', 'Bondi', 'Bondi Junction',
  'Brookvale', 'Chatswood', 'Chippendale', 'Coogee', 'Crows Nest', 'Darlinghurst',
  'Dee Why', 'Double Bay', 'Drummoyne', 'Erskineville', 'Fairfield', 'Freshwater',
  'Glebe', 'Gordon', 'Granville', 'Harris Park', 'Haymarket', 'Hornsby',
  'Hurstville', 'Kingsford', 'Kogarah', 'Lane Cove', 'Leichhardt', 'Liverpool',
  'Manly', 'Marrickville', 'Merrylands', 'Mosman', 'Neutral Bay', 'Newtown',
  'North Sydney', 'Parramatta', 'Penrith', 'Pyrmont', 'Randwick', 'Redfern',
  'Ryde', 'St Leonards', 'St Peters', 'Strathfield', 'Surry Hills', 'Sydney CBD',
  'Ultimo', 'Westmead', 'Willoughby',
]
