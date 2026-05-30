'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Megaphone, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'

export function DashboardHeader({ type }: { type: 'student' | 'admin' }) {
  const router = useRouter()
  const { currentStudent, currentAdmin, logout } = useApp()
  
  const user = type === 'student' ? currentStudent : currentAdmin
  const displayName = type === 'student' 
    ? currentStudent?.name 
    : currentAdmin?.collegeName

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CampusVoice</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">{type}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
