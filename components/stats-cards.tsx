'use client'

import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Complaint } from '@/lib/types'

interface StatsCardsProps {
  complaints: Complaint[]
}

export function StatsCards({ complaints }: StatsCardsProps) {
  const total = complaints.length
  const pending = complaints.filter(c => c.status === 'Pending').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length
  const resolved = complaints.filter(c => c.status === 'Resolved').length

  const stats = [
    {
      label: 'Total Complaints',
      value: total,
      icon: FileText,
      color: 'bg-primary/10 text-primary',
      borderColor: 'border-primary/20'
    },
    {
      label: 'Pending',
      value: pending,
      icon: AlertTriangle,
      color: 'bg-yellow-500/10 text-yellow-600',
      borderColor: 'border-yellow-500/20'
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-600',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      color: 'bg-green-500/10 text-green-600',
      borderColor: 'border-green-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`border-l-4 ${stat.borderColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
