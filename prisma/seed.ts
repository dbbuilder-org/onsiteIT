import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const defaultAvailability = {
  mon: ['morning', 'afternoon'],
  tue: ['morning', 'afternoon'],
  wed: ['morning', 'afternoon'],
  thu: ['morning', 'afternoon'],
  fri: ['morning', 'afternoon'],
  sat: [],
  sun: [],
}

async function main() {
  console.log('Seeding database...')

  const pw = await hash('password123', 12)

  // ── 1. Users ────────────────────────────────────────────────────────────────

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@onsiteit.com' },
    update: {},
    create: { email: 'admin@onsiteit.com', passwordHash: pw, role: 'admin', name: 'Admin User' },
  })

  // Contractors
  const ct1User = await prisma.user.upsert({
    where: { email: 'tech@onsiteit.com' },
    update: {},
    create: { email: 'tech@onsiteit.com', passwordHash: pw, role: 'contractor', name: 'Alex Thompson' },
  })
  const ct2User = await prisma.user.upsert({
    where: { email: 'jessica.park@onsiteit.com' },
    update: {},
    create: { email: 'jessica.park@onsiteit.com', passwordHash: pw, role: 'contractor', name: 'Jessica Park' },
  })
  const ct3User = await prisma.user.upsert({
    where: { email: 'marcus.w@onsiteit.com' },
    update: {},
    create: { email: 'marcus.w@onsiteit.com', passwordHash: pw, role: 'contractor', name: 'Marcus Williams' },
  })
  const ct4User = await prisma.user.upsert({
    where: { email: 'sophie.lee@onsiteit.com' },
    update: {},
    create: { email: 'sophie.lee@onsiteit.com', passwordHash: pw, role: 'contractor', name: 'Sophie Lee' },
  })
  const ct5User = await prisma.user.upsert({
    where: { email: 'ryan.g@onsiteit.com' },
    update: {},
    create: { email: 'ryan.g@onsiteit.com', passwordHash: pw, role: 'contractor', name: 'Ryan Garcia' },
  })
  const ct6User = await prisma.user.upsert({
    where: { email: 'natalie.k@onsiteit.com' },
    update: {},
    create: { email: 'natalie.k@onsiteit.com', passwordHash: pw, role: 'contractor', name: 'Natalie Kim' },
  })

  // Customers
  const cu1User = await prisma.user.upsert({
    where: { email: 'customer@email.com' },
    update: {},
    create: { email: 'customer@email.com', passwordHash: pw, role: 'customer', name: 'Sarah Mitchell' },
  })
  const cu2User = await prisma.user.upsert({
    where: { email: 'david.chen@techcorp.com.au' },
    update: {},
    create: { email: 'david.chen@techcorp.com.au', passwordHash: pw, role: 'customer', name: 'David Chen' },
  })
  const cu3User = await prisma.user.upsert({
    where: { email: 'emma.r@gmail.com' },
    update: {},
    create: { email: 'emma.r@gmail.com', passwordHash: pw, role: 'customer', name: 'Emma Rodriguez' },
  })
  const cu4User = await prisma.user.upsert({
    where: { email: 'jwilson@bigpond.com' },
    update: {},
    create: { email: 'jwilson@bigpond.com', passwordHash: pw, role: 'customer', name: 'James Wilson' },
  })
  const cu5User = await prisma.user.upsert({
    where: { email: 'priya.patel@lawfirm.com.au' },
    update: {},
    create: { email: 'priya.patel@lawfirm.com.au', passwordHash: pw, role: 'customer', name: 'Priya Patel' },
  })
  const cu6User = await prisma.user.upsert({
    where: { email: 'tom.n@startup.io' },
    update: {},
    create: { email: 'tom.n@startup.io', passwordHash: pw, role: 'customer', name: 'Tom Nguyen' },
  })
  const cu7User = await prisma.user.upsert({
    where: { email: 'linda.fraser@school.edu.au' },
    update: {},
    create: { email: 'linda.fraser@school.edu.au', passwordHash: pw, role: 'customer', name: 'Linda Fraser' },
  })
  const cu8User = await prisma.user.upsert({
    where: { email: 'michael.brown@realestate.com.au' },
    update: {},
    create: { email: 'michael.brown@realestate.com.au', passwordHash: pw, role: 'customer', name: 'Michael Brown' },
  })

  console.log('Users created. Admin:', adminUser.id)

  // ── 2. Contractor Profiles ──────────────────────────────────────────────────

  const ct1 = await prisma.contractorProfile.upsert({
    where: { userId: ct1User.id },
    update: {},
    create: {
      userId: ct1User.id,
      phone: '0411 111 111',
      abn: '12 345 678 901',
      skills: ['Networking', 'Windows Repair', 'Server Setup', 'CCTV Installation', 'Data Recovery'],
      serviceSuburbs: ['Chatswood', 'North Sydney', 'Willoughby', 'Crows Nest', 'St Leonards'],
      hourlyRate: 95,
      rating: 4.9,
      status: 'available',
      availability: defaultAvailability,
      joinedDate: '2023-06-01',
    },
  })

  const ct2 = await prisma.contractorProfile.upsert({
    where: { userId: ct2User.id },
    update: {},
    create: {
      userId: ct2User.id,
      phone: '0422 222 222',
      abn: '23 456 789 012',
      skills: ['Mac Repair', 'iOS Support', 'Data Backup', 'Software Installation', 'Printer Setup'],
      serviceSuburbs: ['Manly', 'Dee Why', 'Brookvale', 'Freshwater', 'Curl Curl'],
      hourlyRate: 90,
      rating: 4.8,
      status: 'busy',
      availability: defaultAvailability,
      joinedDate: '2023-09-15',
    },
  })

  const ct3 = await prisma.contractorProfile.upsert({
    where: { userId: ct3User.id },
    update: {},
    create: {
      userId: ct3User.id,
      phone: '0433 333 333',
      abn: '34 567 890 123',
      skills: ['Server Setup', 'Cloud Migration', 'Active Directory', 'VMware', 'Networking'],
      serviceSuburbs: ['Parramatta', 'Westmead', 'Merrylands', 'Granville', 'Harris Park'],
      hourlyRate: 110,
      rating: 4.7,
      status: 'available',
      availability: defaultAvailability,
      joinedDate: '2024-01-10',
    },
  })

  const ct4 = await prisma.contractorProfile.upsert({
    where: { userId: ct4User.id },
    update: {},
    create: {
      userId: ct4User.id,
      phone: '0444 444 444',
      abn: '45 678 901 234',
      skills: ['Hardware Repair', 'Laptop Screen Replacement', 'Data Recovery', 'Virus Removal', 'Windows Repair'],
      serviceSuburbs: ['Sydney CBD', 'Surry Hills', 'Pyrmont', 'Ultimo', 'Glebe'],
      hourlyRate: 85,
      rating: 4.6,
      status: 'available',
      availability: defaultAvailability,
      joinedDate: '2024-03-20',
    },
  })

  const ct5 = await prisma.contractorProfile.upsert({
    where: { userId: ct5User.id },
    update: {},
    create: {
      userId: ct5User.id,
      phone: '0455 555 555',
      abn: '56 789 012 345',
      skills: ['CCTV Installation', 'Smart Home', 'Networking', 'Security Systems', 'Cable Management'],
      serviceSuburbs: ['Alexandria', 'Newtown', 'Erskineville', 'St Peters', 'Marrickville'],
      hourlyRate: 95,
      rating: 4.8,
      status: 'busy',
      availability: defaultAvailability,
      joinedDate: '2023-11-05',
    },
  })

  await prisma.contractorProfile.upsert({
    where: { userId: ct6User.id },
    update: {},
    create: {
      userId: ct6User.id,
      phone: '0466 666 666',
      abn: '67 890 123 456',
      skills: ['Printer Setup', 'WiFi Setup', 'Email Configuration', 'Office 365', 'Software Installation'],
      serviceSuburbs: ['Bondi', 'Bondi Junction', 'Randwick', 'Coogee', 'Kingsford'],
      hourlyRate: 80,
      rating: 4.5,
      status: 'offline',
      availability: defaultAvailability,
      joinedDate: '2024-05-01',
    },
  })

  console.log('Contractor profiles created.')

  // ── 3. Customer Profiles ────────────────────────────────────────────────────

  const cu1 = await prisma.customerProfile.upsert({
    where: { userId: cu1User.id },
    update: {},
    create: {
      userId: cu1User.id,
      phone: '0412 345 678',
      address: '42 Rosewood Drive',
      suburb: 'Chatswood',
      state: 'NSW',
      postcode: '2067',
      notes: 'Prefers morning appointments. Has a home office setup.',
      paymentMethod: 'Visa ****4532',
      joinedDate: '2024-03-15',
    },
  })

  const cu2 = await prisma.customerProfile.upsert({
    where: { userId: cu2User.id },
    update: {},
    create: {
      userId: cu2User.id,
      phone: '0423 567 890',
      address: '15 Harbor Street',
      suburb: 'Pyrmont',
      state: 'NSW',
      postcode: '2009',
      notes: 'Business account. Multiple computers. Invoiced monthly.',
      paymentMethod: 'Mastercard ****8821',
      joinedDate: '2023-11-20',
    },
  })

  const cu3 = await prisma.customerProfile.upsert({
    where: { userId: cu3User.id },
    update: {},
    create: {
      userId: cu3User.id,
      phone: '0434 789 012',
      address: '8 Sunset Boulevard',
      suburb: 'Manly',
      state: 'NSW',
      postcode: '2095',
      notes: 'First-time customer. MacBook user.',
      paymentMethod: 'PayID',
      joinedDate: '2025-01-08',
    },
  })

  const cu4 = await prisma.customerProfile.upsert({
    where: { userId: cu4User.id },
    update: {},
    create: {
      userId: cu4User.id,
      phone: '0445 901 234',
      address: '103 Oak Lane',
      suburb: 'Parramatta',
      state: 'NSW',
      postcode: '2150',
      notes: 'Retired. Prefers clear explanations. Call before arrival.',
      paymentMethod: 'Visa ****1109',
      joinedDate: '2024-06-01',
    },
  })

  const cu5 = await prisma.customerProfile.upsert({
    where: { userId: cu5User.id },
    update: {},
    create: {
      userId: cu5User.id,
      phone: '0456 012 345',
      address: '55 George Street',
      suburb: 'Sydney CBD',
      state: 'NSW',
      postcode: '2000',
      notes: 'Law office. Security-conscious. Requires NDA.',
      paymentMethod: 'Bank Transfer',
      joinedDate: '2024-09-12',
    },
  })

  const cu6 = await prisma.customerProfile.upsert({
    where: { userId: cu6User.id },
    update: {},
    create: {
      userId: cu6User.id,
      phone: '0467 234 567',
      address: '22 Innovation Way',
      suburb: 'Alexandria',
      state: 'NSW',
      postcode: '2015',
      notes: 'Tech startup. Flexible hours including evenings.',
      paymentMethod: 'Mastercard ****5533',
      joinedDate: '2024-02-28',
    },
  })

  const cu7 = await prisma.customerProfile.upsert({
    where: { userId: cu7User.id },
    update: {},
    create: {
      userId: cu7User.id,
      phone: '0478 456 789',
      address: '7 Education Road',
      suburb: 'Strathfield',
      state: 'NSW',
      postcode: '2135',
      notes: 'School IT coordinator. Bulk discounts negotiated.',
      paymentMethod: 'Purchase Order',
      joinedDate: '2023-08-15',
    },
  })

  const cu8 = await prisma.customerProfile.upsert({
    where: { userId: cu8User.id },
    update: {},
    create: {
      userId: cu8User.id,
      phone: '0489 678 901',
      address: '31 Commerce Street',
      suburb: 'Bondi Junction',
      state: 'NSW',
      postcode: '2022',
      notes: 'Real estate office. Urgent jobs common. Priority customer.',
      paymentMethod: 'Visa ****7744',
      joinedDate: '2023-12-05',
    },
  })

  console.log('Customer profiles created.')

  // ── 4. Inventory ────────────────────────────────────────────────────────────

  const inventoryData = [
    { sku: 'CBL-CAT6-10', name: 'CAT6 Ethernet Cable 10m', category: 'Cables', stock: 24, minStock: 10, unitCost: 12.50, supplier: 'NetParts AU' },
    { sku: 'CBL-CAT6-50', name: 'CAT6 Ethernet Cable 50m', category: 'Cables', stock: 8, minStock: 5, unitCost: 35.00, supplier: 'NetParts AU' },
    { sku: 'CBL-HDMI-2', name: 'HDMI Cable 2m', category: 'Cables', stock: 15, minStock: 8, unitCost: 8.00, supplier: 'NetParts AU' },
    { sku: 'ADP-USBC-A', name: 'USB-C to USB-A Adapter', category: 'Adapters', stock: 20, minStock: 10, unitCost: 6.50, supplier: 'Tech Supplies Direct' },
    { sku: 'SWT-TPL-8U', name: 'TP-Link 8-Port Unmanaged Switch', category: 'Networking', stock: 5, minStock: 3, unitCost: 45.00, supplier: 'NetParts AU' },
    { sku: 'WAP-UBI-ACL', name: 'Ubiquiti UAP-AC-Lite WAP', category: 'Networking', stock: 4, minStock: 2, unitCost: 135.00, supplier: 'Ubiquiti Distributor' },
    { sku: 'SSD-SAM-500', name: '500GB Samsung 870 EVO SSD', category: 'Storage', stock: 7, minStock: 3, unitCost: 89.00, supplier: 'Samsung AU' },
    { sku: 'HDD-WD-1T', name: '1TB WD Blue HDD 3.5"', category: 'Storage', stock: 6, minStock: 4, unitCost: 65.00, supplier: 'WD Distributor' },
    { sku: 'RAM-8G-3200', name: '8GB DDR4 RAM 3200MHz', category: 'Memory', stock: 12, minStock: 6, unitCost: 38.00, supplier: 'Memory Express' },
    { sku: 'RAM-16G-3200', name: '16GB DDR4 RAM 3200MHz', category: 'Memory', stock: 3, minStock: 4, unitCost: 72.00, supplier: 'Memory Express' },
    { sku: 'THM-PASTE-5G', name: 'Thermal Paste Tube', category: 'Tools', stock: 18, minStock: 5, unitCost: 4.50, supplier: 'Tech Supplies Direct' },
    { sku: 'TOL-ASW-01', name: 'Anti-Static Wrist Strap', category: 'Tools', stock: 9, minStock: 5, unitCost: 8.00, supplier: 'Tech Supplies Direct' },
    { sku: 'TOL-RJ45-CMP', name: 'RJ45 Crimping Tool', category: 'Tools', stock: 4, minStock: 2, unitCost: 22.00, supplier: 'NetParts AU' },
    { sku: 'NET-USB-AC13', name: 'USB WiFi Adapter AC1300', category: 'Networking', stock: 8, minStock: 4, unitCost: 28.00, supplier: 'Tech Supplies Direct' },
    { sku: 'PWR-BRD-6PT', name: 'Power Board 6-Outlet', category: 'Power', stock: 2, minStock: 5, unitCost: 18.00, supplier: 'Electrical Wholesale' },
    { sku: 'BAT-LAP-UNI', name: 'Laptop Battery Universal', category: 'Power', stock: 5, minStock: 3, unitCost: 65.00, supplier: 'Battery World Pro' },
    { sku: 'DSP-MBP-13', name: 'MacBook Pro 13" Display Asm.', category: 'Screens', stock: 2, minStock: 2, unitCost: 290.00, supplier: 'Apple Parts AU' },
    { sku: 'DSP-LAP-156', name: '15.6" FHD Laptop Screen', category: 'Screens', stock: 4, minStock: 3, unitCost: 85.00, supplier: 'Screen Warehouse' },
  ]

  for (const item of inventoryData) {
    await prisma.inventoryItem.upsert({ where: { sku: item.sku }, update: {}, create: item })
  }

  console.log('Inventory created.')

  // ── 5. Jobs ─────────────────────────────────────────────────────────────────

  const j1 = await prisma.job.create({
    data: {
      customerId: cu1.id,
      contractorId: ct1.id,
      title: 'Home Network Setup & WiFi Extender',
      description: 'Customer needs full home network setup with mesh WiFi system. Current single router not covering back rooms.',
      type: 'Networking',
      status: 'in_progress',
      priority: 'medium',
      scheduledDate: new Date('2026-02-24T09:00:00'),
      address: '42 Rosewood Drive, Chatswood NSW 2067',
      suburb: 'Chatswood',
      laborHours: 3,
      laborRate: 95,
      partsUsed: [{ name: 'TP-Link Deco M5 (3-pack)', qty: 1, cost: 249 }],
      totalAmount: 534,
      notes: ['Customer prefers mesh system over extenders', 'Has 5 devices to reconnect after setup'],
    },
  })

  await prisma.job.create({
    data: {
      customerId: cu2.id,
      contractorId: ct3.id,
      title: 'Server Migration to Cloud',
      description: 'Migrate on-premise server to Azure.',
      type: 'Server Setup',
      status: 'assigned',
      priority: 'high',
      scheduledDate: new Date('2026-02-25T08:00:00'),
      address: '15 Harbor Street, Pyrmont NSW 2009',
      suburb: 'Pyrmont',
      laborHours: 8,
      laborRate: 110,
      partsUsed: [],
      totalAmount: 880,
      notes: ['Azure subscription already active', 'Migration window: 8am-4pm Saturday'],
    },
  })

  const j3 = await prisma.job.create({
    data: {
      customerId: cu3.id,
      contractorId: ct2.id,
      title: 'MacBook Screen Replacement',
      description: 'MacBook Pro 13" 2021 screen cracked.',
      type: 'Hardware Repair',
      status: 'completed',
      priority: 'medium',
      scheduledDate: new Date('2026-02-21T11:00:00'),
      completedDate: new Date('2026-02-21T14:30:00'),
      address: '8 Sunset Boulevard, Manly NSW 2095',
      suburb: 'Manly',
      laborHours: 2.5,
      laborRate: 90,
      partsUsed: [{ name: 'MacBook Pro 13" Display Assembly', qty: 1, cost: 320 }],
      totalAmount: 545,
      notes: ['Screen replacement successful', 'Customer very happy'],
    },
  })

  await prisma.job.create({
    data: {
      customerId: cu4.id,
      title: 'Virus Removal & System Cleanup',
      description: 'Windows 11 PC running very slow. Suspected malware infection.',
      type: 'Virus Removal',
      status: 'pending',
      priority: 'high',
      scheduledDate: new Date('2026-02-26T10:00:00'),
      address: '103 Oak Lane, Parramatta NSW 2150',
      suburb: 'Parramatta',
      laborHours: 2,
      laborRate: 95,
      partsUsed: [],
      totalAmount: 190,
      notes: ['Urgent - customer cannot use computer for work'],
    },
  })

  await prisma.job.create({
    data: {
      customerId: cu5.id,
      contractorId: ct4.id,
      title: 'Office 365 Setup & Email Migration',
      description: 'Setup Office 365 Business for 5 users.',
      type: 'Software Installation',
      status: 'in_progress',
      priority: 'high',
      scheduledDate: new Date('2026-02-23T09:00:00'),
      address: '55 George Street, Sydney CBD NSW 2000',
      suburb: 'Sydney CBD',
      laborHours: 4,
      laborRate: 85,
      partsUsed: [],
      totalAmount: 340,
      notes: ['5 user licenses purchased', 'Data migration in progress'],
    },
  })

  const j6 = await prisma.job.create({
    data: {
      customerId: cu6.id,
      contractorId: ct5.id,
      title: 'CCTV System Installation',
      description: '8-camera CCTV system installation for startup office.',
      type: 'CCTV Installation',
      status: 'completed',
      priority: 'medium',
      scheduledDate: new Date('2026-02-20T08:00:00'),
      completedDate: new Date('2026-02-20T16:00:00'),
      address: '22 Innovation Way, Alexandria NSW 2015',
      suburb: 'Alexandria',
      laborHours: 7,
      laborRate: 95,
      partsUsed: [
        { name: 'Hikvision 4K Camera (x8)', qty: 8, cost: 120 },
        { name: '8-Channel NVR', qty: 1, cost: 380 },
        { name: 'CAT6 Cable (50m)', qty: 2, cost: 45 },
      ],
      totalAmount: 1971,
      notes: ['All 8 cameras operational', 'Remote access configured'],
    },
  })

  await prisma.job.create({
    data: {
      customerId: cu8.id,
      contractorId: ct1.id,
      title: 'Network Infrastructure Upgrade',
      description: 'Upgrade office network to Gigabit.',
      type: 'Networking',
      status: 'assigned',
      priority: 'medium',
      scheduledDate: new Date('2026-02-27T09:00:00'),
      address: '31 Commerce Street, Bondi Junction NSW 2022',
      suburb: 'Bondi Junction',
      laborHours: 5,
      laborRate: 95,
      partsUsed: [
        { name: 'Ubiquiti UniFi 24-port Switch', qty: 1, cost: 420 },
        { name: 'Ubiquiti UAP-AC-PRO WAP', qty: 2, cost: 220 },
      ],
      totalAmount: 1335,
      notes: ['Parts ordered, ETA 26 Feb'],
    },
  })

  const j8 = await prisma.job.create({
    data: {
      customerId: cu7.id,
      contractorId: ct4.id,
      title: 'Data Recovery from Failed HDD',
      description: 'School laptop HDD failed.',
      type: 'Data Recovery',
      status: 'completed',
      priority: 'urgent',
      scheduledDate: new Date('2026-02-19T10:00:00'),
      completedDate: new Date('2026-02-19T15:00:00'),
      address: '7 Education Road, Strathfield NSW 2135',
      suburb: 'Strathfield',
      laborHours: 4,
      laborRate: 85,
      partsUsed: [{ name: '500GB SSD Replacement', qty: 1, cost: 95 }],
      totalAmount: 435,
      notes: ['95% data recovered', 'New SSD installed'],
    },
  })

  const j9 = await prisma.job.create({
    data: {
      customerId: cu2.id,
      contractorId: ct3.id,
      title: 'Active Directory Setup',
      description: 'Setup Windows Server AD for 20 users.',
      type: 'Server Setup',
      status: 'completed',
      priority: 'high',
      scheduledDate: new Date('2026-02-15T08:00:00'),
      completedDate: new Date('2026-02-15T17:00:00'),
      address: '15 Harbor Street, Pyrmont NSW 2009',
      suburb: 'Pyrmont',
      laborHours: 8,
      laborRate: 110,
      partsUsed: [{ name: 'Windows Server 2022 CAL x20', qty: 1, cost: 480 }],
      totalAmount: 1360,
      notes: ['AD configured for 20 users', 'All users tested'],
    },
  })

  const j10 = await prisma.job.create({
    data: {
      customerId: cu1.id,
      contractorId: ct2.id,
      title: 'Printer Network Setup',
      description: 'Configure HP LaserJet for network printing.',
      type: 'Printer Setup',
      status: 'completed',
      priority: 'low',
      scheduledDate: new Date('2026-02-10T14:00:00'),
      completedDate: new Date('2026-02-10T16:00:00'),
      address: '42 Rosewood Drive, Chatswood NSW 2067',
      suburb: 'Chatswood',
      laborHours: 1.5,
      laborRate: 90,
      partsUsed: [],
      totalAmount: 135,
      notes: ['Printer configured on all 3 PCs'],
    },
  })

  await prisma.job.create({
    data: {
      customerId: cu8.id,
      title: 'Emergency - Server Down',
      description: 'Office server unresponsive.',
      type: 'Server Setup',
      status: 'pending',
      priority: 'urgent',
      scheduledDate: new Date('2026-02-23T12:00:00'),
      address: '31 Commerce Street, Bondi Junction NSW 2022',
      suburb: 'Bondi Junction',
      laborHours: 3,
      laborRate: 140,
      partsUsed: [],
      totalAmount: 420,
      notes: ['URGENT - Call immediately on arrival'],
    },
  })

  await prisma.job.create({
    data: {
      customerId: cu6.id,
      contractorId: ct5.id,
      title: 'Smart Home Integration',
      description: 'Connect Philips Hue, Nest thermostat, and Ring doorbell.',
      type: 'Smart Home',
      status: 'cancelled',
      priority: 'low',
      scheduledDate: new Date('2026-02-22T13:00:00'),
      address: '22 Innovation Way, Alexandria NSW 2015',
      suburb: 'Alexandria',
      laborHours: 0,
      laborRate: 95,
      partsUsed: [],
      totalAmount: 0,
      notes: ['Customer cancelled - moved offices'],
    },
  })

  console.log('Jobs created.')

  // ── 6. Quotes ────────────────────────────────────────────────────────────────

  await prisma.quote.create({
    data: {
      quoteNumber: 'QT-2026-001',
      customerId: cu4.id,
      contractorId: ct3.id,
      status: 'sent',
      lineItems: [
        { description: 'Server Installation & Configuration', qty: 1, unitPrice: 440 },
        { description: 'Dell PowerEdge T40 Server', qty: 1, unitPrice: 1200 },
        { description: 'Windows Server 2022 Standard', qty: 1, unitPrice: 520 },
        { description: 'CAT6 Cabling (20m)', qty: 2, unitPrice: 12.50 },
      ],
      total: 2185,
      expiryDate: new Date('2026-03-06'),
      notes: 'Quote valid for 14 days. GST included.',
    },
  })

  await prisma.quote.create({
    data: {
      quoteNumber: 'QT-2026-002',
      customerId: cu8.id,
      contractorId: ct1.id,
      status: 'accepted',
      lineItems: [
        { description: 'Network Infrastructure Upgrade - Labor (5hrs)', qty: 5, unitPrice: 95 },
        { description: 'Ubiquiti UniFi 24-port Switch', qty: 1, unitPrice: 420 },
        { description: 'Ubiquiti UAP-AC-PRO WAP', qty: 2, unitPrice: 220 },
      ],
      total: 1335,
      expiryDate: new Date('2026-03-07'),
      notes: 'Accepted by customer. Job scheduled for 27 Feb.',
    },
  })

  await prisma.quote.create({
    data: {
      quoteNumber: 'QT-2026-003',
      customerId: cu5.id,
      status: 'draft',
      lineItems: [
        { description: 'Microsoft 365 Business Standard (5 users) - Setup', qty: 5, unitPrice: 45 },
        { description: 'Email Migration from G-Suite', qty: 1, unitPrice: 180 },
      ],
      total: 405,
      expiryDate: new Date('2026-03-08'),
      notes: 'Draft pending review.',
    },
  })

  await prisma.quote.create({
    data: {
      quoteNumber: 'QT-2026-004',
      customerId: cu7.id,
      contractorId: ct2.id,
      status: 'declined',
      lineItems: [
        { description: 'Bulk Laptop Refresh (10 units) - Labor', qty: 10, unitPrice: 85 },
        { description: 'Windows 11 Upgrade per unit', qty: 10, unitPrice: 35 },
      ],
      total: 1200,
      expiryDate: new Date('2026-03-01'),
      notes: 'Customer declined - budget constraints.',
    },
  })

  await prisma.quote.create({
    data: {
      quoteNumber: 'QT-2026-005',
      customerId: cu2.id,
      contractorId: ct3.id,
      status: 'sent',
      lineItems: [
        { description: 'Azure Cloud Migration - Labor (8hrs)', qty: 8, unitPrice: 110 },
        { description: 'Azure Setup & Configuration', qty: 1, unitPrice: 350 },
      ],
      total: 1230,
      expiryDate: new Date('2026-03-08'),
      notes: 'Awaiting customer approval.',
    },
  })

  console.log('Quotes created.')

  // ── 7. Invoices ──────────────────────────────────────────────────────────────

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      customerId: cu3.id,
      jobId: j3.id,
      status: 'paid',
      lineItems: [
        { description: 'MacBook Screen Replacement - Labor (2.5hrs)', qty: 2.5, unitPrice: 90 },
        { description: 'MacBook Pro 13" Display Assembly', qty: 1, unitPrice: 320 },
      ],
      subtotal: 545,
      gst: 54.50,
      total: 545,
      dueDate: new Date('2026-03-07'),
      paidDate: new Date('2026-02-22T10:30:00'),
    },
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-002',
      customerId: cu6.id,
      jobId: j6.id,
      status: 'paid',
      lineItems: [
        { description: 'CCTV Installation - Labor (7hrs)', qty: 7, unitPrice: 95 },
        { description: 'Hikvision 4K Camera (x8)', qty: 8, unitPrice: 120 },
        { description: '8-Channel NVR', qty: 1, unitPrice: 380 },
        { description: 'CAT6 Cable 50m (x2)', qty: 2, unitPrice: 45 },
      ],
      subtotal: 1971,
      gst: 197.10,
      total: 1971,
      dueDate: new Date('2026-03-06'),
      paidDate: new Date('2026-02-21T09:00:00'),
    },
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-003',
      customerId: cu7.id,
      jobId: j8.id,
      status: 'sent',
      lineItems: [
        { description: 'Data Recovery Service - Labor (4hrs)', qty: 4, unitPrice: 85 },
        { description: '500GB SSD Replacement', qty: 1, unitPrice: 95 },
      ],
      subtotal: 435,
      gst: 43.50,
      total: 435,
      dueDate: new Date('2026-03-05'),
    },
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-004',
      customerId: cu2.id,
      jobId: j9.id,
      status: 'overdue',
      lineItems: [
        { description: 'Active Directory Setup - Labor (8hrs)', qty: 8, unitPrice: 110 },
        { description: 'Windows Server 2022 CAL x20', qty: 1, unitPrice: 480 },
      ],
      subtotal: 1360,
      gst: 136.00,
      total: 1360,
      dueDate: new Date('2026-03-01'),
    },
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-005',
      customerId: cu1.id,
      jobId: j10.id,
      status: 'paid',
      lineItems: [
        { description: 'Printer Network Setup - Labor (1.5hrs)', qty: 1.5, unitPrice: 90 },
      ],
      subtotal: 135,
      gst: 13.50,
      total: 135,
      dueDate: new Date('2026-02-24'),
      paidDate: new Date('2026-02-15T11:00:00'),
    },
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-006',
      customerId: cu1.id,
      jobId: j1.id,
      status: 'draft',
      lineItems: [
        { description: 'Home Network Setup - Labor (3hrs)', qty: 3, unitPrice: 95 },
        { description: 'TP-Link Deco M5 Mesh System', qty: 1, unitPrice: 249 },
      ],
      subtotal: 534,
      gst: 53.40,
      total: 534,
      dueDate: new Date('2026-03-09'),
    },
  })

  console.log('Invoices created.')

  // ── 8. Contractor Pay ────────────────────────────────────────────────────────

  const payData = [
    { contractorId: ct1.id, period: 'Feb 1-15 2026', hoursLogged: 32, jobsCompleted: 8, grossAmount: 3040, status: 'paid' as const, payDate: '2026-02-16' },
    { contractorId: ct2.id, period: 'Feb 1-15 2026', hoursLogged: 28, jobsCompleted: 7, grossAmount: 2520, status: 'paid' as const, payDate: '2026-02-16' },
    { contractorId: ct3.id, period: 'Feb 1-15 2026', hoursLogged: 24, jobsCompleted: 4, grossAmount: 2640, status: 'paid' as const, payDate: '2026-02-16' },
    { contractorId: ct4.id, period: 'Feb 1-15 2026', hoursLogged: 20, jobsCompleted: 6, grossAmount: 1700, status: 'paid' as const, payDate: '2026-02-16' },
    { contractorId: ct5.id, period: 'Feb 1-15 2026', hoursLogged: 35, jobsCompleted: 9, grossAmount: 3325, status: 'paid' as const, payDate: '2026-02-16' },
    { contractorId: ct1.id, period: 'Feb 16-28 2026', hoursLogged: 18, jobsCompleted: 4, grossAmount: 1710, status: 'pending' as const },
    { contractorId: ct2.id, period: 'Feb 16-28 2026', hoursLogged: 22, jobsCompleted: 5, grossAmount: 1980, status: 'pending' as const },
    { contractorId: ct3.id, period: 'Feb 16-28 2026', hoursLogged: 16, jobsCompleted: 3, grossAmount: 1760, status: 'pending' as const },
  ]

  for (const p of payData) {
    await prisma.contractorPay.create({ data: p })
  }

  console.log('Contractor pay created.')
  console.log('Seed complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
