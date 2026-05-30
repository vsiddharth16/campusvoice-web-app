'use client'

import { useState } from 'react'
import { Search, FileText, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge, PriorityBadge } from '@/components/badges'
import { useApp } from '@/lib/store'

export function StudentComplaintsTable() {
  const { getStudentComplaints } = useApp()
  const complaints = getStudentComplaints()
  const [search, setSearch] = useState('')

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Complaints
            </CardTitle>
            <CardDescription>
              Track the status of your submitted complaints
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No complaints found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Try a different search term' : 'Submit your first complaint above'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Admin Reply</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-primary">{complaint.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">{complaint.title}</span>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{complaint.category}</span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <PriorityBadge priority={complaint.priority} />
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{complaint.createdAt}</span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="py-4 px-4">
                      {complaint.adminReply ? (
                        <div className="flex items-start gap-2 max-w-xs">
                          <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground line-clamp-2">{complaint.adminReply}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50 italic">No reply yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
