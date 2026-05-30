'use client'

import { Building2, UtensilsCrossed, Wifi, Wrench, HelpCircle } from 'lucide-react'

const categories = [
  {
    icon: Building2,
    title: 'Hostel',
    description: 'Room issues, maintenance, facilities',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    icon: UtensilsCrossed,
    title: 'Canteen',
    description: 'Food quality, hygiene, timings',
    color: 'bg-orange-500/10 text-orange-600'
  },
  {
    icon: Wifi,
    title: 'WiFi',
    description: 'Connectivity, speed, access issues',
    color: 'bg-green-500/10 text-green-600'
  },
  {
    icon: Wrench,
    title: 'Infrastructure',
    description: 'Buildings, classrooms, equipment',
    color: 'bg-purple-500/10 text-purple-600'
  },
  {
    icon: HelpCircle,
    title: 'Other',
    description: 'Any other campus concerns',
    color: 'bg-gray-500/10 text-gray-600'
  }
]

export function CategoriesGrid() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Complaint Categories
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Submit complaints across various campus departments and facilities
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
