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
  areas: {
    id: number
    name: string
    description: string
  }[]
  areaPrincipal?: {
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

import { API_BASE_URL, getAuthHeaders, getPublicHeaders } from "../config/api"

// Funciones de autenticación
export const authService = {
  // Login
  async login(usuario: string, contrasena: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: getPublicHeaders(),
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
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: getAuthHeaders(),
        })
      } catch (error) {

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
    if (!user || !user.areas) return false
    return user.areas.some(area => area.name.toLowerCase().includes(areaName.toLowerCase()))
  },

  // Request autenticado
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken()

    if (!token) {
      throw new Error("No hay token de autenticación")
    }

    // Determine if url is absolute or relative
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options.headers,
        ...getAuthHeaders()
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
