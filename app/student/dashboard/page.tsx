'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { ComplaintForm } from '@/components/complaint-form'
import { StudentComplaintsTable } from '@/components/student-complaints-table'
import { useApp } from '@/lib/store'

export default function StudentDashboardPage() {
  const router = useRouter()
  const { currentStudent, fetchComplaints } = useApp()

  useEffect(() => {
    if (!currentStudent) {
      router.push('/student/login')
    } else {
      fetchComplaints()
    }
  }, [currentStudent, router, fetchComplaints])

  if (!currentStudent) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader type="student" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {currentStudent.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Submit and track your campus complaints
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <ComplaintForm />
          </div>
          <div className="lg:col-span-3">
            <StudentComplaintsTable />
          </div>
        </div>
      </main>
    </div>
  )
}
