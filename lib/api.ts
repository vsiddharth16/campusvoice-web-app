import { Admin, Complaint, Student } from './types'

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://campusvoice-backend-production.up.railway.app/api'

const TOKEN_KEY = 'campusvoice-token'
const SESSION_KEY = 'campusvoice-session'

export type SessionRole = 'student' | 'admin'

export interface StoredSession {
  role: SessionRole
  student?: Student
  admin?: Admin
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

export function saveAuth(token: string, session: StoredSession) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(SESSION_KEY)
}

function formatDate(value: string | Date): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10)
  return d.toISOString().split('T')[0]
}

export function mapComplaint(raw: Record<string, unknown>): Complaint {
  return {
    id: String(raw.id),
    title: String(raw.title),
    category: raw.category as Complaint['category'],
    priority: raw.priority as Complaint['priority'],
    description: String(raw.description),
    photoUrl: raw.photoUrl as string | undefined,
    status: raw.status as Complaint['status'],
    createdAt: formatDate(raw.createdAt as string),
    studentId: String(raw.studentId),
    studentName: String(raw.studentName),
    collegeCode: String(raw.collegeCode),
    adminReply: raw.adminReply as string | undefined,
  }
}

function mapStudent(raw: {
  id: number | string
  name: string
  email: string
  collegeCode: string
}): Student {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    collegeCode: raw.collegeCode,
    password: '',
  }
}

function mapAdmin(raw: {
  id: number | string
  email: string
  collegeCode: string
  collegeName: string
}): Admin {
  return {
    id: String(raw.id),
    email: raw.email,
    collegeCode: raw.collegeCode,
    collegeName: raw.collegeName,
    password: '',
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (auth) {
    const token = getToken()
    if (token) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string }).message ?? `Request failed (${res.status})`,
      res.status
    )
  }

  return data as T
}

export async function loginStudent(
  email: string,
  password: string,
  collegeCode: string
) {
  const data = await apiFetch<{
    token: string
    student: { id: number; name: string; email: string; collegeCode: string }
  }>(
    '/auth/student/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, collegeCode }),
    },
    false
  )
  const student = mapStudent(data.student)
  saveAuth(data.token, { role: 'student', student })
  return student
}

export async function registerStudent(
  name: string,
  email: string,
  password: string,
  collegeCode: string
) {
  const data = await apiFetch<{
    token: string
    student: { id: number; name: string; email: string; collegeCode: string }
  }>(
    '/auth/student/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password, collegeCode }),
    },
    false
  )
  const student = mapStudent(data.student)
  saveAuth(data.token, { role: 'student', student })
  return student
}

export async function loginAdmin(email: string, password: string) {
  const data = await apiFetch<{
    token: string
    admin: {
      id: number
      email: string
      collegeCode: string
      collegeName: string
    }
  }>(
    '/auth/admin/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false
  )
  const admin = mapAdmin(data.admin)
  saveAuth(data.token, { role: 'admin', admin })
  return admin
}

export async function registerCollege(
  name: string,
  collegeCode: string,
  adminEmail: string,
  password: string
) {
  return apiFetch<{
    college: { id: number; name: string; collegeCode: string; adminEmail: string }
  }>(
    '/colleges/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, collegeCode, adminEmail, password }),
    },
    false
  )
}

export async function fetchComplaints(): Promise<Complaint[]> {
  const data = await apiFetch<{ complaints: Record<string, unknown>[] }>(
    '/complaints'
  )
  return data.complaints.map(mapComplaint)
}

export async function createComplaint(payload: {
  title: string
  category: Complaint['category']
  priority: Complaint['priority']
  description: string
}) {
  const data = await apiFetch<{ complaint: Record<string, unknown> }>(
    '/complaints',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
  return mapComplaint(data.complaint)
}

export async function patchComplaintStatus(
  complaintId: string,
  status: Complaint['status']
) {
  const data = await apiFetch<{ complaint: Record<string, unknown> }>(
    `/complaints/${encodeURIComponent(complaintId)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  )
  return mapComplaint(data.complaint)
}

export async function patchComplaintReply(complaintId: string, reply: string) {
  const data = await apiFetch<{ complaint: Record<string, unknown> }>(
    `/complaints/${encodeURIComponent(complaintId)}/reply`,
    {
      method: 'PATCH',
      body: JSON.stringify({ reply }),
    }
  )
  return mapComplaint(data.complaint)
}
