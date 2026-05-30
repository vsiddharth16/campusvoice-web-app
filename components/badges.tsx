'use client'

import { ComplaintStatus, ComplaintPriority } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'Pending' && 'bg-yellow-100 text-yellow-800',
        status === 'In Progress' && 'bg-blue-100 text-blue-800',
        status === 'Resolved' && 'bg-green-100 text-green-800'
      )}
    >
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        priority === 'Low' && 'bg-gray-100 text-gray-800',
        priority === 'Medium' && 'bg-blue-100 text-blue-800',
        priority === 'High' && 'bg-orange-100 text-orange-800',
        priority === 'Urgent' && 'bg-red-100 text-red-50'
      )}
    >
      {priority}
    </span>
  )
}
