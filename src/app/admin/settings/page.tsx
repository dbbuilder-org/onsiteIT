'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Mail, CreditCard, Bell, Users, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const [company, setCompany] = useState({
    name: 'OnsiteIT Pty Ltd',
    abn: '98 765 432 109',
    phone: '1300 123 456',
    email: 'hello@onsiteit.com',
    address: '123 Tech Street, Sydney NSW 2000',
    website: 'www.onsiteit.com.au',
  })

  return (
    <div className="space-y-4 max-w-4xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">{toast}</div>
      )}
      <h2 className="text-xl font-bold text-slate-800">Settings</h2>

      <Tabs defaultValue="company">
        <TabsList className="mb-4">
          <TabsTrigger value="company"><Building2 className="h-4 w-4 mr-1.5" />Company</TabsTrigger>
          <TabsTrigger value="integrations"><Mail className="h-4 w-4 mr-1.5" />Integrations</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-1.5" />Payments</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5" />Notifications</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" />Users</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Company Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', key: 'name' },
                  { label: 'ABN', key: 'abn' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Email', key: 'email' },
                  { label: 'Website', key: 'website' },
                  { label: 'Address', key: 'address' },
                ].map(field => (
                  <div key={field.key}>
                    <Label className="text-sm font-medium">{field.label}</Label>
                    <Input className="mt-1" value={(company as any)[field.key]}
                      onChange={(e) => setCompany(prev => ({ ...prev, [field.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => showToast('Company settings saved!')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-4">
            {[
              { name: 'SMS Notifications', desc: 'Send job updates via SMS to customers and contractors', provider: 'Twilio', connected: true },
              { name: 'Email Service', desc: 'Automated invoice and quote emails', provider: 'SendGrid', connected: true },
              { name: 'Calendar Sync', desc: 'Sync jobs to Google Calendar', provider: 'Google', connected: false },
              { name: 'Accounting', desc: 'Sync invoices to accounting software', provider: 'Xero', connected: false },
            ].map(integration => (
              <Card key={integration.name} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{integration.name}</p>
                    <p className="text-sm text-slate-500">{integration.desc}</p>
                    <span className="text-xs text-blue-600 font-medium">via {integration.provider}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${integration.connected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => showToast(`${integration.connected ? 'Disconnected from' : 'Connected to'} ${integration.provider}`)}>
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Payment Gateway</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Stripe Connected</p>
                  <p className="text-sm text-green-700">Account: acct_1234...5678 • Mode: Live</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Publishable Key</Label>
                  <Input className="mt-1 font-mono text-xs" value="pk_live_**********************" readOnly />
                </div>
                <div>
                  <Label className="text-sm">Secret Key</Label>
                  <Input className="mt-1 font-mono text-xs" value="sk_live_**********************" readOnly type="password" />
                </div>
                <div>
                  <Label className="text-sm">Platform Fee (%)</Label>
                  <Input className="mt-1" defaultValue="2.5" />
                </div>
                <div>
                  <Label className="text-sm">Default Due Days</Label>
                  <Input className="mt-1" defaultValue="14" />
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => showToast('Payment settings saved!')}>
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'New job booking', desc: 'Notify when a customer submits a new booking', sms: true, email: true },
                  { label: 'Job completed', desc: 'Notify when a contractor marks a job complete', sms: false, email: true },
                  { label: 'Invoice overdue', desc: 'Alert when an invoice passes due date', sms: true, email: true },
                  { label: 'Low stock alert', desc: 'Alert when inventory falls below minimum', sms: false, email: true },
                  { label: 'Quote accepted', desc: 'Notify when a customer accepts a quote', sms: true, email: true },
                  { label: 'Contractor offline', desc: 'Alert when a contractor goes offline', sms: false, email: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {['SMS', 'Email'].map((type) => (
                        <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" defaultChecked={type === 'SMS' ? item.sms : item.email}
                            className="rounded border-slate-300 text-blue-600" />
                          <span className="text-xs text-slate-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => showToast('Notification preferences saved!')}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">User Management</CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => showToast('Invite sent!')}>+ Invite User</Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Admin User', email: 'admin@onsiteit.com', role: 'Admin', status: 'active' },
                    { name: 'Alex Thompson', email: 'tech@onsiteit.com', role: 'Contractor', status: 'active' },
                    { name: 'Jessica Park', email: 'jessica.park@onsiteit.com', role: 'Contractor', status: 'active' },
                  ].map(user => (
                    <tr key={user.email} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-medium text-slate-800">{user.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{user.role}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{user.status}</span>
                      </td>
                      <td className="px-6 py-3">
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => showToast('User updated')}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
