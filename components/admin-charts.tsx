'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Complaint } from '@/lib/types'

interface AdminChartsProps {
  complaints: Complaint[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Hostel: '#3b82f6',
  Canteen: '#f97316',
  WiFi: '#22c55e',
  Infrastructure: '#a855f7',
  Other: '#6b7280'
}

const STATUS_COLORS: Record<string, string> = {
  Pending: '#eab308',
  'In Progress': '#3b82f6',
  Resolved: '#22c55e'
}

export function AdminCharts({ complaints }: AdminChartsProps) {
  // Category data for bar chart
  const categoryData = ['Hostel', 'Canteen', 'WiFi', 'Infrastructure', 'Other'].map(category => ({
    name: category,
    count: complaints.filter(c => c.category === category).length,
    fill: CATEGORY_COLORS[category]
  }))

  // Status data for pie chart
  const statusData = ['Pending', 'In Progress', 'Resolved'].map(status => ({
    name: status,
    value: complaints.filter(c => c.status === status).length,
    fill: STATUS_COLORS[status]
  }))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complaints by Category</CardTitle>
          <CardDescription>Distribution across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Distribution</CardTitle>
          <CardDescription>Current status of all complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
