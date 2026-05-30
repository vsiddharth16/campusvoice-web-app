'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Complaint, Student, Admin } from './types'
import {
  ApiError,
  clearAuth,
  fetchComplaints as apiFetchComplaints,
  getStoredSession,
  loginStudent as apiLoginStudent,
  registerStudent as apiRegisterStudent,
  loginAdmin as apiLoginAdmin,
  registerCollege as apiRegisterCollege,
  createComplaint,
  patchComplaintStatus,
  patchComplaintReply,
} from './api'

interface AppState {
  complaints: Complaint[]
  currentStudent: Student | null
  currentAdmin: Admin | null
}

interface AppContextType extends AppState {
  isHydrated: boolean
  loginStudent: (email: string, password: string, collegeCode: string) => Promise<boolean>
  registerStudent: (name: string, email: string, password: string, collegeCode: string) => Promise<boolean>
  loginAdmin: (email: string, password: string) => Promise<boolean>
  registerCollege: (name: string, adminEmail: string, code: string, adminPassword: string) => Promise<boolean>
  logout: () => void
  fetchComplaints: () => Promise<void>
  addComplaint: (
    complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'studentId' | 'studentName' | 'collegeCode'>
  ) => Promise<string>
  updateComplaintStatus: (id: string, status: Complaint['status']) => Promise<void>
  addAdminReply: (id: string, reply: string) => Promise<void>
  getStudentComplaints: () => Complaint[]
  getCollegeComplaints: () => Complaint[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const emptyState: AppState = {
  complaints: [],
  currentStudent: null,
  currentAdmin: null,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState)
  const [isHydrated, setIsHydrated] = useState(false)

  const loadComplaints = useCallback(async () => {
    try {
      const complaints = await apiFetchComplaints()
      setState(prev => ({ ...prev, complaints }))
    } catch {
      setState(prev => ({ ...prev, complaints: [] }))
    }
  }, [])

  useEffect(() => {
    const session = getStoredSession()
    if (session?.role === 'student' && session.student) {
      setState(prev => ({
        ...prev,
        currentStudent: session.student!,
        currentAdmin: null,
      }))
      apiFetchComplaints()
        .then(complaints => setState(prev => ({ ...prev, complaints })))
        .catch(() => {})
    } else if (session?.role === 'admin' && session.admin) {
      setState(prev => ({
        ...prev,
        currentAdmin: session.admin!,
        currentStudent: null,
      }))
      apiFetchComplaints()
        .then(complaints => setState(prev => ({ ...prev, complaints })))
        .catch(() => {})
    }
    setIsHydrated(true)
  }, [])

  const loginStudent = async (
    email: string,
    password: string,
    collegeCode: string
  ): Promise<boolean> => {
    try {
      const student = await apiLoginStudent(email, password, collegeCode)
      setState(prev => ({
        ...prev,
        currentStudent: student,
        currentAdmin: null,
        complaints: [],
      }))
      await loadComplaints()
      return true
    } catch {
      return false
    }
  }

  const registerStudent = async (
    name: string,
    email: string,
    password: string,
    collegeCode: string
  ): Promise<boolean> => {
    try {
      const student = await apiRegisterStudent(name, email, password, collegeCode)
      setState(prev => ({
        ...prev,
        currentStudent: student,
        currentAdmin: null,
        complaints: [],
      }))
      await loadComplaints()
      return true
    } catch {
      return false
    }
  }

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const admin = await apiLoginAdmin(email, password)
      setState(prev => ({
        ...prev,
        currentAdmin: admin,
        currentStudent: null,
        complaints: [],
      }))
      await loadComplaints()
      return true
    } catch {
      return false
    }
  }

  const registerCollege = async (
    name: string,
    adminEmail: string,
    code: string,
    adminPassword: string
  ): Promise<boolean> => {
    try {
      await apiRegisterCollege(name, code, adminEmail, adminPassword)
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) return false
      return false
    }
  }

  const logout = () => {
    clearAuth()
    setState(emptyState)
  }

  const addComplaint = async (
    complaint: Omit<
      Complaint,
      'id' | 'createdAt' | 'status' | 'studentId' | 'studentName' | 'collegeCode'
    >
  ): Promise<string> => {
    const created = await createComplaint({
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
      description: complaint.description,
    })
    setState(prev => ({
      ...prev,
      complaints: [created, ...prev.complaints.filter(c => c.id !== created.id)],
    }))
    return created.id
  }

  const updateComplaintStatus = async (id: string, status: Complaint['status']) => {
    const updated = await patchComplaintStatus(id, status)
    setState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => (c.id === id ? updated : c)),
    }))
  }

  const addAdminReply = async (id: string, reply: string) => {
    const updated = await patchComplaintReply(id, reply)
    setState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => (c.id === id ? updated : c)),
    }))
  }

  const getStudentComplaints = (): Complaint[] => {
    if (!state.currentStudent) return []
    return state.complaints
  }

  const getCollegeComplaints = (): Complaint[] => {
    if (!state.currentAdmin) return []
    return state.complaints
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        isHydrated,
        loginStudent,
        registerStudent,
        loginAdmin,
        registerCollege,
        logout,
        fetchComplaints: loadComplaints,
        addComplaint,
        updateComplaintStatus,
        addAdminReply,
        getStudentComplaints,
        getCollegeComplaints,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
