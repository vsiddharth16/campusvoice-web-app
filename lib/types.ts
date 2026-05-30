export type ComplaintCategory = 'Hostel' | 'Canteen' | 'WiFi' | 'Infrastructure' | 'Other'
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved'

export interface Complaint {
  id: string
  title: string
  category: ComplaintCategory
  priority: ComplaintPriority
  description: string
  photoUrl?: string
  status: ComplaintStatus
  createdAt: string
  studentId: string
  studentName: string
  collegeCode: string
  adminReply?: string
}

export interface Student {
  id: string
  name: string
  email: string
  password: string
  collegeCode: string
}

export interface Admin {
  id: string
  email: string
  password: string
  collegeCode: string
  collegeName: string
}

export interface College {
  code: string
  name: string
  adminEmail: string
}
