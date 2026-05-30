'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Megaphone, ArrowLeft, Loader2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/lib/store'

export default function CollegeRegisterPage() {
  const router = useRouter()
  const { registerCollege } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    collegeName: '',
    adminEmail: '',
    collegeCode: '',
    adminPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (formData.collegeCode.length < 4) {
      setError('College code must be at least 4 characters.')
      setLoading(false)
      return
    }

    try {
      const result = await registerCollege(
        formData.collegeName,
        formData.adminEmail,
        formData.collegeCode.toUpperCase(),
        formData.adminPassword
      )
      
      if (result) {
        setSuccess(true)
      } else {
        setError('Registration failed. College code may already exist.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Registration Successful!</CardTitle>
            <CardDescription>
              Your college has been registered successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground mb-2">College Details:</p>
              <p className="font-medium">{formData.collegeName}</p>
              <p className="text-sm text-muted-foreground">Code: {formData.collegeCode.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">Admin: {formData.adminEmail}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Share the college code <strong>{formData.collegeCode.toUpperCase()}</strong> with your students 
              so they can register and submit complaints.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/login">Go to Admin Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
      
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">CampusVoice</span>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Register Your College</CardTitle>
          <CardDescription>
            Set up CampusVoice for your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                placeholder="e.g., MIT Institute of Technology"
                value={formData.collegeName}
                onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collegeCode">College Code (Unique ID)</Label>
              <Input
                id="collegeCode"
                placeholder="e.g., MIT001"
                value={formData.collegeCode}
                onChange={(e) => setFormData(prev => ({ ...prev, collegeCode: e.target.value.toUpperCase() }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                This code will be used by students to register. Make it memorable!
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@college.edu"
                value={formData.adminEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="Create a strong password"
                value={formData.adminPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </p>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register College
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already registered? </span>
            <Link href="/admin/login" className="text-primary hover:underline font-medium">
              Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
