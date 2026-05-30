'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatsCards } from '@/components/stats-cards'
import { AdminCharts } from '@/components/admin-charts'
import { AdminComplaintsTable } from '@/components/admin-complaints-table'
import { useApp } from '@/lib/store'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { currentAdmin, getCollegeComplaints, fetchComplaints } = useApp()
  const complaints = getCollegeComplaints()

  useEffect(() => {
    if (!currentAdmin) {
      router.push('/admin/login')
    } else {
      fetchComplaints()
    }
  }, [currentAdmin, router, fetchComplaints])

  if (!currentAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader type="admin" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentAdmin.collegeName} - Manage campus complaints
          </p>
        </div>
        
        <div className="space-y-8">
          <StatsCards complaints={complaints} />
          <AdminCharts complaints={complaints} />
          <AdminComplaintsTable complaints={complaints} />
        </div>
      </main>
    </div>
  )
}
