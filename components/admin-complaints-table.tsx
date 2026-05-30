'use client'

import { useState } from 'react'
import { Search, Filter, Send, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { StatusBadge, PriorityBadge } from '@/components/badges'
import { useApp } from '@/lib/store'
import { Complaint, ComplaintStatus, ComplaintCategory } from '@/lib/types'

interface AdminComplaintsTableProps {
  complaints: Complaint[]
}

export function AdminComplaintsTable({ complaints }: AdminComplaintsTableProps) {
  const { updateComplaintStatus, addAdminReply } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all')
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [loadingReply, setLoadingReply] = useState<string | null>(null)

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleStatusChange = async (id: string, status: ComplaintStatus) => {
    try {
      await updateComplaintStatus(id, status)
    } catch {
      // Status reverts via server state on next fetch
    }
  }

  const handleSendReply = async (id: string) => {
    const reply = replyInputs[id]?.trim()
    if (!reply) return
    
    setLoadingReply(id)
    try {
      await addAdminReply(id, reply)
      setReplyInputs(prev => ({ ...prev, [id]: '' }))
    } finally {
      setLoadingReply(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Complaints</CardTitle>
        <CardDescription>
          Manage and respond to student complaints
        </CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ComplaintStatus | 'all')}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ComplaintCategory | 'all')}>
              <SelectTrigger className="w-36">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hostel">Hostel</SelectItem>
                <SelectItem value="Canteen">Canteen</SelectItem>
                <SelectItem value="WiFi">WiFi</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No complaints found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Complaint Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm text-primary font-medium">
                        {complaint.id}
                      </span>
                      <PriorityBadge priority={complaint.priority} />
                      <StatusBadge status={complaint.status} />
                    </div>
                    
                    <h3 className="font-semibold text-foreground">{complaint.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By: {complaint.studentName}</span>
                      <span>Category: {complaint.category}</span>
                      <span>Date: {complaint.createdAt}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    
                    {complaint.photoUrl && (
                      <img 
                        src={complaint.photoUrl} 
                        alt="Complaint" 
                        className="max-h-32 rounded-lg mt-2" 
                      />
                    )}
                    
                    {complaint.adminReply && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Your Reply:</p>
                        <p className="text-sm">{complaint.adminReply}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="lg:w-72 space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status</label>
                      <Select 
                        value={complaint.status} 
                        onValueChange={(v) => handleStatusChange(complaint.id, v as ComplaintStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reply / Comment</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your reply..."
                          value={replyInputs[complaint.id] || ''}
                          onChange={(e) => setReplyInputs(prev => ({ 
                            ...prev, 
                            [complaint.id]: e.target.value 
                          }))}
                        />
                        <Button 
                          size="icon"
                          onClick={() => handleSendReply(complaint.id)}
                          disabled={!replyInputs[complaint.id]?.trim() || loadingReply === complaint.id}
                        >
                          {loadingReply === complaint.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
