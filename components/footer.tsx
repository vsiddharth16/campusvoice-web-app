'use client'

import { Megaphone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">CampusVoice</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/student/login" className="hover:text-primary transition-colors">
              Student Portal
            </Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
            <Link href="/college/register" className="hover:text-primary transition-colors">
              Register College
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CampusVoice. Making campuses better, one complaint at a time.</p>
        </div>
      </div>
    </footer>
  )
}
