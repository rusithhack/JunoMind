export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  preferences: {
    darkMode: boolean
    ttsEnabled: boolean
    notifications: boolean
  }
}

export class UserService {
  private static readonly STORAGE_KEY = "juno-user"
  private static readonly USERS_KEY = "juno-users"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem(this.STORAGE_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  static signIn(email: string, password: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const users = this.getAllUsers()
      const user = users.find((u) => u.email === email)

      if (user && this.verifyPassword(password, user.email)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
        this.dispatchUserChange()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  static signUp(name: string, email: string, password: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const users = this.getAllUsers()

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        return false
      }

      const newUser: User = {
        id: this.generateId(),
        name,
        email,
        createdAt: new Date(),
        preferences: {
          darkMode: true,
          ttsEnabled: true,
          notifications: true,
        },
      }

      users.push(newUser)
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser))
      this.dispatchUserChange()
      return true
    } catch {
      return false
    }
  }

  static signOut(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(this.STORAGE_KEY)
    this.dispatchUserChange()
  }

  static updateUser(updates: Partial<User>): boolean {
    if (typeof window === "undefined") return false

    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) return false

      const updatedUser = { ...currentUser, ...updates }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser))

      // Update in users list
      const users = this.getAllUsers()
      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      }

      this.dispatchUserChange()
      return true
    } catch {
      return false
    }
  }

  private static getAllUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const usersData = localStorage.getItem(this.USERS_KEY)
      return usersData ? JSON.parse(usersData) : []
    } catch {
      return []
    }
  }

  private static verifyPassword(password: string, email: string): boolean {
    // Simple password verification (in production, use proper hashing)
    return password.length >= 6
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private static dispatchUserChange(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("userChanged"))
    }
  }
}
