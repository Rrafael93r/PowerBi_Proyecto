// Utilidades de autenticación
export interface Usuario {
  id: number
  nombre: string
  segundo_nombre: string
  apellido_1: string
  apellido_2: string
  correo: string
  usuario: string
  role: {
    id: number
    name: string
    description: string
  }
  area: {
    id: number
    name: string
    description: string
  }
  estado: {
    id: number
    name: string
    description: string
  }
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

// Funciones de autenticación
export const authService = {
  // Login
  async login(usuario: string, contrasena: string): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3333/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error en login")
    }

    const data: LoginResponse = await response.json()

    // Guardar token y usuario en localStorage
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.usuario))

    return data
  },

  // Logout
  async logout(): Promise<void> {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        await fetch("http://localhost:3333/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Error al cerrar sesión en el servidor:", error)
      }
    }

    // Limpiar localStorage siempre
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.clear()
  },

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem("token")
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  // Verificar rol
  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser()
    return user?.role?.name?.toLowerCase() === roleName.toLowerCase()
  },

  // Verificar área
  hasArea(areaName: string): boolean {
    const user = this.getCurrentUser()
    return !!(user && user.area && user.area.name && user.area.name.toLowerCase().includes(areaName.toLowerCase()))
  },

  // Request autenticado
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken()

    if (!token) {
      throw new Error("No hay token de autenticación")
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) {
      // Token inválido, hacer logout
      this.logout()
      window.location.href = "/login"
      throw new Error("Sesión expirada")
    }

    return response
  },
}
