'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wrench, UserPlus, CheckCircle, ArrowLeft } from 'lucide-react'
import { signUpCustomerAction } from '@/lib/actions/auth'

const benefits = [
  'Book IT support from local technicians',
  'Track your jobs in real time',
  'Receive invoices and pay securely online',
  'Manage your service history in one place',
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    suburb: '',
    postcode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const result = await signUpCustomerAction({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      suburb: form.suburb,
      postcode: form.postcode,
    })

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Auto sign-in after successful registration
    const signInResult = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)
    if (signInResult?.error) {
      setError('Account created but sign-in failed. Please go back and log in.')
    } else {
      router.push('/customer')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Wrench className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">OnsiteIT</h1>
              <p className="text-slate-400 text-sm">Field Service Management</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            IT Support,
            <br />
            <span className="text-teal-400">On Your Doorstep</span>
          </h2>
          <p className="text-slate-400 text-base mb-10">
            Create a free customer account to book local IT technicians, track your jobs, and manage
            invoices — all in one place.
          </p>
          <div className="space-y-4">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="bg-teal-600/20 p-1.5 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-teal-400" />
                </div>
                <span className="text-slate-300 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-slate-500 text-xs">© 2026 OnsiteIT Pty Ltd. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">OnsiteIT</h1>
          </div>

          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h2>
            <p className="text-slate-500 text-sm">Book local IT support in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  className="mt-1"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  className="mt-1"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  className="mt-1"
                  placeholder="Min. 8 characters"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  className="mt-1"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                className="mt-1"
                placeholder="04xx xxx xxx"
                required
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                Street Address
              </Label>
              <Input
                id="address"
                type="text"
                value={form.address}
                onChange={set('address')}
                className="mt-1"
                placeholder="12 Example Street"
                required
              />
            </div>

            {/* Suburb + Postcode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb" className="text-sm font-medium text-slate-700">
                  Suburb
                </Label>
                <Input
                  id="suburb"
                  type="text"
                  value={form.suburb}
                  onChange={set('suburb')}
                  className="mt-1"
                  placeholder="Surry Hills"
                  required
                />
              </div>
              <div>
                <Label htmlFor="postcode" className="text-sm font-medium text-slate-700">
                  Postcode
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  value={form.postcode}
                  onChange={set('postcode')}
                  className="mt-1"
                  placeholder="2010"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
