export type Role = "student" | "teacher" | "admin"

export interface User {
  firstName: string
  lastName: string
  email: string
  mobile: string
  role: Role
  isActive: boolean
  isVerified: boolean
  profileImage: string
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export interface AuthResult {
  success: boolean
  message: string
  user?: User
  token?: string
  redirectTo?: string
}

export const ROLE_DASHBOARD: Record<Role, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
}

export const ROLES: { value: Role; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" },
]
