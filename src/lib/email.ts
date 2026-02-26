'use server'
import { Resend } from 'resend'

const FROM = 'OnsiteIT <noreply@onsiteit.servicevision.io>'

function safe(fn: (resend: Resend) => Promise<unknown>) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — skipping email')
    return Promise.resolve()
  }
  const resend = new Resend(key)
  return fn(resend).catch((err: Error) => {
    console.error('[email]', err?.message ?? err)
  })
}

export async function sendJobAssignmentEmail({
  contractorEmail,
  contractorName,
  jobTitle,
  customerName,
  address,
  suburb,
  scheduledDate,
}: {
  contractorEmail: string
  contractorName: string
  jobTitle: string
  customerName: string
  address: string
  suburb: string
  scheduledDate: string | null
}) {
  return safe((resend) =>
    resend.emails.send({
      from: FROM,
      to: contractorEmail,
      subject: `New job assigned: ${jobTitle}`,
      html: `
        <p>Hi ${contractorName},</p>
        <p>You have been assigned a new job:</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Job</td><td style="font-size:14px;font-weight:600">${jobTitle}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Customer</td><td style="font-size:14px">${customerName}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Address</td><td style="font-size:14px">${address}, ${suburb}</td></tr>
          ${scheduledDate ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Scheduled</td><td style="font-size:14px">${new Date(scheduledDate).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}</td></tr>` : ''}
        </table>
        <p>Log in to view full details: <a href="https://onsiteit.servicevision.io/contractor">My Jobs</a></p>
        <p style="color:#94a3b8;font-size:12px;margin-top:32px">OnsiteIT · You received this because you are a registered contractor.</p>
      `,
    })
  )
}

export async function sendInvoiceSentEmail({
  customerEmail,
  customerName,
  invoiceNumber,
  total,
  dueDate,
}: {
  customerEmail: string
  customerName: string
  invoiceNumber: string
  total: number
  dueDate: string
}) {
  const aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(total)
  const due = new Date(dueDate).toLocaleDateString('en-AU', { dateStyle: 'medium' })

  return safe((resend) =>
    resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: `Invoice ${invoiceNumber} — ${aud} due ${due}`,
      html: `
        <p>Hi ${customerName},</p>
        <p>Please find your invoice details below:</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Invoice</td><td style="font-size:14px;font-weight:600">${invoiceNumber}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Amount</td><td style="font-size:14px;font-weight:600">${aud}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Due Date</td><td style="font-size:14px">${due}</td></tr>
        </table>
        <p>View and pay online: <a href="https://onsiteit.servicevision.io/customer/payment">My Invoices</a></p>
        <p style="color:#94a3b8;font-size:12px;margin-top:32px">OnsiteIT · ${invoiceNumber}</p>
      `,
    })
  )
}

export async function sendBookingConfirmationEmail({
  customerEmail,
  customerName,
  serviceType,
  suburb,
}: {
  customerEmail: string
  customerName: string
  serviceType: string
  suburb: string
}) {
  return safe((resend) =>
    resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Booking received — we'll be in touch shortly",
      html: `
        <p>Hi ${customerName},</p>
        <p>We've received your service request and will match you with an available contractor shortly.</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Service</td><td style="font-size:14px;font-weight:600">${serviceType}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:14px">Location</td><td style="font-size:14px">${suburb}</td></tr>
        </table>
        <p>Track your request: <a href="https://onsiteit.servicevision.io/customer">My Jobs</a></p>
        <p style="color:#94a3b8;font-size:12px;margin-top:32px">OnsiteIT · You received this because you submitted a service request.</p>
      `,
    })
  )
}
