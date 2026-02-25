'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wrench, Shield, Zap, Users, BarChart3, CheckCircle, UserPlus } from 'lucide-react'

const features = [
  { icon: Zap, text: 'Real-time job tracking & dispatching' },
  { icon: Users, text: 'Multi-contractor management' },
  { icon: BarChart3, text: 'Revenue & performance reports' },
  { icon: Shield, text: 'Secure customer portal' },
]

const demoAccounts = [
  {
    label: 'Login as Admin',
    email: 'admin@onsiteit.com',
    role: 'admin',
    color: 'bg-blue-600 hover:bg-blue-700',
    desc: 'Full system access',
  },
  {
    label: 'Login as Contractor',
    email: 'tech@onsiteit.com',
    role: 'contractor',
    color: 'bg-orange-500 hover:bg-orange-600',
    desc: 'Field technician view',
  },
  {
    label: 'Login as Customer',
    email: 'customer@email.com',
    role: 'customer',
    color: 'bg-green-600 hover:bg-green-700',
    desc: 'Customer self-service',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@onsiteit.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doSignIn = async (signinEmail: string, role: string) => {
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: signinEmail,
      password: 'password123',
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Login failed. Please check credentials.')
    } else {
      router.push(`/${role}`)
    }
  }

  const handleDemoLogin = (demoEmail: string, role: string) => {
    doSignIn(demoEmail, role)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid credentials.')
      return
    }
    // Fetch session to get role
    const res = await fetch('/api/auth/session')
    const session = await res.json()
    if (session?.user?.role) {
      router.push(`/${session.user.role}`)
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
            Manage Your IT
            <br />
            <span className="text-blue-400">Field Operations</span>
            <br />
            with Confidence
          </h2>
          <p className="text-slate-400 text-base mb-10">
            Field Service Management for IT Professionals. Dispatch contractors, track jobs, and
            delight customers — all from one place.
          </p>
          <div className="space-y-4">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-1.5 rounded-lg">
                  <f.icon className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{f.text}</span>
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

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Demo login buttons */}
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Quick Demo Access
            </p>
            {demoAccounts.map(acc => (
              <button
                key={acc.role}
                onClick={() => handleDemoLogin(acc.email, acc.role)}
                disabled={loading}
                className={`w-full text-left px-4 py-3 rounded-lg text-white text-sm font-medium transition-all ${acc.color} flex items-center justify-between group disabled:opacity-60`}
              >
                <div>
                  <span className="block font-semibold">{acc.label}</span>
                  <span className="text-xs opacity-75">
                    {acc.email} • {acc.desc}
                  </span>
                </div>
                <CheckCircle className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}

            {/* New Customer Sign-Up */}
            <button
              onClick={() => router.push('/register')}
              disabled={loading}
              className="w-full text-left px-4 py-3 rounded-lg text-white text-sm font-medium transition-all bg-teal-600 hover:bg-teal-700 flex items-center justify-between group disabled:opacity-60"
            >
              <div>
                <span className="block font-semibold">New Customer Sign-Up</span>
                <span className="text-xs opacity-75">
                  Create a new customer account • Book your first service
                </span>
              </div>
              <UserPlus className="h-4 w-4 opacity-75 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50 px-3 text-slate-400">or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo credentials: password123 for all accounts
          </p>
        </div>
      </div>
    </div>
  )
}
