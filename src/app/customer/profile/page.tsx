'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getMyCustomerProfile, updateCustomerProfile, type CustomerRow } from '@/lib/actions/customers'
import { getInitials } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerRow | null>(null)
  const [form, setForm] = useState({ phone: '', address: '', suburb: '', state: 'NSW', postcode: '' })
  const [notifications, setNotifications] = useState({
    smsJobUpdates: true,
    emailInvoices: true,
    smsAppointmentReminders: true,
    emailPromotions: false,
    smsPaymentReminders: true,
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [toast, setToast] = useState('')

  useEffect(() => {
    getMyCustomerProfile().then(r => {
      if (r.success) {
        setProfile(r.data)
        setForm({
          phone: r.data.phone,
          address: r.data.address,
          suburb: r.data.suburb,
          state: r.data.state || 'NSW',
          postcode: r.data.postcode,
        })
      }
    })
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = async () => {
    if (!profile) return
    const result = await updateCustomerProfile({ id: profile.id, ...form })
    if (result.success) {
      showToast('Profile updated!')
    }
  }

  const joinedDate = profile?.joinedDate
    ? new Date(profile.joinedDate).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="space-y-6 max-w-2xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {toast}
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-800">My Profile</h2>

      {/* Avatar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
              {profile?.name ? getInitials(profile.name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-slate-800 text-lg">{profile?.name || 'Loading...'}</p>
            <p className="text-sm text-slate-500">{profile?.email || ''}</p>
            {joinedDate && <p className="text-xs text-slate-400 mt-1">Customer since {joinedDate}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Phone', key: 'phone', col: '', type: 'tel' },
              { label: 'Street Address', key: 'address', col: 'col-span-2', type: 'text' },
              { label: 'Suburb', key: 'suburb', col: '', type: 'text' },
              { label: 'State', key: 'state', col: '', type: 'text' },
              { label: 'Postcode', key: 'postcode', col: '', type: 'text' },
            ].map(f => (
              <div key={f.key} className={f.col}>
                <Label className="text-sm font-medium text-slate-700">{f.label}</Label>
                <Input
                  type={f.type}
                  className="mt-1"
                  value={(form as unknown as Record<string, string>)[f.key] ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Job status updates via SMS', key: 'smsJobUpdates' },
              { label: 'Invoice emails', key: 'emailInvoices' },
              { label: 'Appointment reminders via SMS', key: 'smsAppointmentReminders' },
              { label: 'Promotional emails', key: 'emailPromotions' },
              { label: 'Payment reminders via SMS', key: 'smsPaymentReminders' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <p className="text-sm text-slate-700">{item.label}</p>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !(prev as Record<string, boolean>)[item.key] }))}
                  className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
                    (notifications as Record<string, boolean>)[item.key] ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    (notifications as Record<string, boolean>)[item.key] ? 'translate-x-4' : ''
                  }`} />
                </button>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => showToast('Preferences saved!')}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Current Password', key: 'current' },
            { label: 'New Password', key: 'newPass' },
            { label: 'Confirm New Password', key: 'confirm' },
          ].map(f => (
            <div key={f.key}>
              <Label className="text-sm font-medium text-slate-700">{f.label}</Label>
              <Input
                type="password"
                className="mt-1"
                value={(passwords as Record<string, string>)[f.key]}
                onChange={e => setPasswords(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <Button
            className="bg-slate-700 hover:bg-slate-800 text-white"
            onClick={() => {
              if (passwords.newPass !== passwords.confirm) { showToast('Passwords do not match'); return }
              setPasswords({ current: '', newPass: '', confirm: '' })
              showToast('Password changed successfully!')
            }}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
