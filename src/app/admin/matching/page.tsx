'use client'
import { useState, useEffect } from 'react'
import { getJobRequests, confirmMatch as confirmMatchAction, type JobRequestRow } from '@/lib/actions/matching'
import { getContractors, type ContractorRow } from '@/lib/actions/contractors'
import { rankMatches } from '@/lib/matching'
import type { JobRequest, ContractorMatch, ContractorProfile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitMerge, CheckCircle, Zap, MapPin, Clock, Star, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

function MatchScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-slate-500">{label}</span>
        <span className={cn('font-semibold', score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-500' : 'text-red-500')}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-orange-400' : 'bg-red-400'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function JobMatchCard({
  job,
  matches,
  onAssign,
}: {
  job: JobRequestRow
  matches: ContractorMatch[]
  onAssign: (contractorId: string, contractorName: string) => void
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-bold text-slate-800 truncate">
              {job.customerName}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {job.serviceType} • {job.suburb}
            </p>
          </div>
          <Badge
            className={cn(
              'text-xs shrink-0',
              job.priority === 'emergency'
                ? 'bg-red-100 text-red-700 border-red-200'
                : job.priority === 'urgent'
                ? 'bg-orange-100 text-orange-700 border-orange-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            )}
          >
            {job.priority}
          </Badge>
        </div>
        <div className="flex gap-3 text-xs text-slate-500 mt-1 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {job.preferredTime === 'any' ? 'Any time' : job.preferredTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {job.preferredDates.length} preferred date
            {job.preferredDates.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.suburb}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {matches.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No available contractors</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Top Matches
            </p>
            {matches.slice(0, 3).map((m, i) => (
              <div key={m.contractorId} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{m.contractorName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {m.rating} • ${m.hourlyRate}/hr
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('text-xl font-bold', m.overallScore >= 70 ? 'text-orange-500' : 'text-slate-500')}>
                      {m.overallScore}%
                    </p>
                    <p className="text-xs text-slate-400">match</p>
                  </div>
                </div>
                <MatchScoreBar label="Skills" score={m.skillScore} />
                <MatchScoreBar label="Location" score={m.geoScore} />
                <MatchScoreBar label="Availability" score={m.availabilityScore} />
                {i === 0 && (
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs h-8"
                    onClick={() => onAssign(m.contractorId, m.contractorName)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Assign {m.contractorName.split(' ')[0]}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MatchingPage() {
  const [requests, setRequests] = useState<JobRequestRow[]>([])
  const [contractors, setContractors] = useState<ContractorRow[]>([])

  useEffect(() => {
    getJobRequests().then(r => r.success && setRequests(r.data))
    getContractors().then(r => r.success && setContractors(r.data))
  }, [])

  const pendingJobs = requests.filter(r => r.status === 'pending')
  const confirmedJobs = requests.filter(r => r.status === 'confirmed')

  const contractorProfiles = contractors as unknown as ContractorProfile[]

  const jobMatchData = pendingJobs.map(job => ({
    job,
    matches: rankMatches(job as unknown as JobRequest, contractorProfiles),
  }))

  const handleConfirm = async (jobRequestId: string, contractorId: string) => {
    const result = await confirmMatchAction({ jobRequestId, contractorId })
    if (result.success) {
      setRequests(prev => prev.map(r => r.id === jobRequestId ? result.data : r))
    }
  }

  const handleAutoMatchAll = async () => {
    for (const job of pendingJobs) {
      const matches = rankMatches(job as unknown as JobRequest, contractorProfiles)
      if (matches.length > 0) {
        const result = await confirmMatchAction({ jobRequestId: job.id, contractorId: matches[0].contractorId })
        if (result.success) {
          setRequests(prev => prev.map(r => r.id === job.id ? result.data : r))
        }
      }
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <GitMerge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Smart Matching</h2>
            <p className="text-sm text-slate-500">
              Score and assign contractors to incoming job requests
            </p>
          </div>
        </div>
        {pendingJobs.length > 0 && (
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            onClick={handleAutoMatchAll}
          >
            <Zap className="h-4 w-4" />
            Auto-match all ({pendingJobs.length})
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingJobs.length, color: 'text-orange-600 bg-orange-50' },
          { label: 'Confirmed', value: confirmedJobs.length, color: 'text-green-600 bg-green-50' },
          {
            label: 'Contractors Active',
            value: contractors.filter(c => c.status !== 'offline').length,
            color: 'text-blue-600 bg-blue-50',
          },
        ].map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={cn('text-2xl font-bold', stat.color.split(' ')[0])}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending jobs */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Pending Jobs ({pendingJobs.length})
          </h3>
          {pendingJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">All jobs matched!</p>
              <p className="text-sm text-slate-400 mt-1">
                New customer job requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobMatchData.map(({ job, matches }) => (
                <JobMatchCard
                  key={job.id}
                  job={job}
                  matches={matches}
                  onAssign={(contractorId, contractorName) =>
                    handleConfirm(job.id, contractorId)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Confirmed jobs */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Confirmed Matches ({confirmedJobs.length})
          </h3>
          {confirmedJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-slate-400 text-sm">Confirmed assignments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmedJobs.map(job => (
                <Card
                  key={job.id}
                  className="border-0 shadow-sm border-l-4 border-l-green-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {job.serviceType}
                        </p>
                        <p className="text-sm text-slate-500">
                          {job.customerName} • {job.suburb}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs shrink-0">
                        Confirmed
                      </Badge>
                    </div>
                    {job.matchedContractorName && (
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <p className="text-sm font-medium text-green-700">
                          {job.matchedContractorName}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1.5">
                      Submitted {new Date(job.createdAt).toLocaleDateString('en-AU')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
