'use client'

import Link from 'next/link'
import { ArrowRight, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
          <Megaphone className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Multi-College Portal</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
          Your Voice Matters,{' '}
          <span className="text-primary">We Listen</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          A unified platform for students to raise campus concerns and for administrators 
          to respond efficiently. Make your campus better, one complaint at a time.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/student/login">
              Login as Student
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/admin/login">
              Login as Admin
            </Link>
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground">
          New college?{' '}
          <Link href="/college/register" className="text-primary hover:underline font-medium">
            Register your institution
          </Link>
        </p>
      </div>
    </section>
  )
}
