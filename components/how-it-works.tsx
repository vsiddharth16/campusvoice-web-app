'use client'

import { FileText, Clock, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Submit Complaint',
    description: 'Fill out a simple form with your concern, select category and priority level.'
  },
  {
    icon: Clock,
    title: 'Track Progress',
    description: 'Monitor your complaint status in real-time. Get notified when there are updates.'
  },
  {
    icon: CheckCircle,
    title: 'Get Resolution',
    description: 'Receive admin responses and see your complaints resolved efficiently.'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simple three-step process to get your campus concerns addressed
          </p>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10 hidden sm:block last:hidden" 
                   style={{ display: index === 2 ? 'none' : undefined }} />
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
