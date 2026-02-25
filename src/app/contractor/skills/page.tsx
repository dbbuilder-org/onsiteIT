'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { skills as allSkills, nswSuburbs } from '@/lib/constants'
import { getMyContractorProfile, updateContractorProfile } from '@/lib/actions/contractors'
import { cn } from '@/lib/utils'
import { X, Plus } from 'lucide-react'

export default function ContractorSkillsPage() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [mySkills, setMySkills] = useState<string[]>([])
  const [mySuburbs, setMySuburbs] = useState<string[]>([])
  const [hourlyRate, setHourlyRate] = useState(95)
  const [suburbSearch, setSuburbSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    getMyContractorProfile().then(r => {
      if (r.success) {
        setProfileId(r.data.id)
        setMySkills(r.data.skills)
        setMySuburbs(r.data.serviceSuburbs)
        setHourlyRate(r.data.hourlyRate)
      }
    })
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleSkill = (skill: string) => {
    setMySkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const addSuburb = (suburb: string) => {
    if (!mySuburbs.includes(suburb)) {
      setMySuburbs(prev => [...prev, suburb])
    }
    setSuburbSearch('')
  }

  const removeSuburb = (suburb: string) => {
    setMySuburbs(prev => prev.filter(s => s !== suburb))
  }

  const filteredSuburbs = nswSuburbs
    .filter(s => s.toLowerCase().includes(suburbSearch.toLowerCase()) && !mySuburbs.includes(s))
    .slice(0, 8)

  const handleSave = async () => {
    if (!profileId) return
    const result = await updateContractorProfile({ id: profileId, skills: mySkills, serviceSuburbs: mySuburbs, hourlyRate })
    if (result.success) {
      showToast('Skills & areas saved!')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-800">Skills & Service Areas</h2>

      {/* Skills */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-700">My Skills</CardTitle>
            <span className="text-sm text-slate-500">{mySkills.length} selected</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                  mySkills.includes(skill)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                )}
              >
                {skill}
                {mySkills.includes(skill) && <span className="ml-1.5">✓</span>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service areas */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-700">Service Areas</CardTitle>
            <span className="text-sm text-slate-500">{mySuburbs.length} areas</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {mySuburbs.map(suburb => (
              <Badge key={suburb} className="bg-blue-100 text-blue-700 border-blue-200 text-sm py-1 px-3">
                {suburb}
                <button onClick={() => removeSuburb(suburb)} className="ml-2 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="relative">
            <Input
              placeholder="Search and add suburbs..."
              value={suburbSearch}
              onChange={e => setSuburbSearch(e.target.value)}
              className="mb-2"
            />
            {suburbSearch && filteredSuburbs.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-200 z-10 py-1 max-h-48 overflow-y-auto">
                {filteredSuburbs.map(suburb => (
                  <button
                    key={suburb}
                    onClick={() => addSuburb(suburb)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Plus className="h-3.5 w-3.5 text-blue-600" />
                    {suburb}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hourly rate */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">Hourly Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 max-w-xs">
            <span className="text-slate-500 font-medium">AUD $</span>
            <Input
              type="number"
              min={50}
              max={300}
              value={hourlyRate}
              onChange={e => setHourlyRate(Number(e.target.value))}
              className="w-28"
            />
            <Label className="text-sm text-slate-500">per hour (excl. GST)</Label>
          </div>
        </CardContent>
      </Card>

      <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
        Save Skills & Areas
      </Button>
    </div>
  )
}
