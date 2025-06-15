"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom" // ✅ Importar useNavigate

// Importa tus imágenes aquí
// import Fondo from "../assets/fondo.png"
// import LogoPharmaserv from "../assets/pharmaser.png"

interface LoginResponse {
  mensaje: string
  usuario: {
    id: number
    nombre: string
    usuario: string
    rol: string
    estado: string
    visualizacion: string
  }
}

const Login = () => {
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate() // ✅ Hook para navegación

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      })

      const data: LoginResponse = await res.json()

      if (!res.ok) {
        setError(data.mensaje || "Error en login")
        return
      }

      console.log("Login exitoso", data)

      // ✅ Guardar datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data.usuario))
      localStorage.setItem("token", "logged-in")

      // ✅ Redirigir a selección de área
      navigate("/seleccion-area")
    } catch (err) {
      console.error("Error de conexión:", err)
      setError("No se pudo conectar al servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center position-relative">
      <div
        className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
        style={{
          backgroundImage: `url(/placeholder.svg?height=1080&width=1920)`, // Reemplaza con tu imagen
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-dark bg-opacity-50 w-100 h-100 position-absolute"></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card bg-dark bg-opacity-85 border-primary border-opacity-75 shadow-lg rounded-4">
              {/* Header with logo */}
              <div className="card-header bg-transparent border-primary border-opacity-50 text-center py-4">
                <img
                  src="/placeholder.svg?height=80&width=200"
                  alt="Pharmaserv Logo"
                  className="img-fluid"
                  style={{ maxHeight: "80px", maxWidth: "200px" }}
                />
              </div>

              {/* Form body */}
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-light fw-medium mb-2" htmlFor="usuario">
                      Usuario
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-dark bg-opacity-75 border-primary border-opacity-75 text-primary">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="usuario"
                        className="form-control bg-dark bg-opacity-75 border-primary border-opacity-75 text-light"
                        placeholder="Ingresa tu usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-light fw-medium mb-2" htmlFor="password">
                      Contraseña
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-dark bg-opacity-75 border-primary border-opacity-75 text-primary">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                      <input
                        type="password"
                        id="password"
                        className="form-control bg-dark bg-opacity-75 border-primary border-opacity-75 text-light"
                        placeholder="Ingresa tu contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input className="form-check-input border-primary" type="checkbox" id="rememberMe" />
                      <label className="form-check-label text-light small" htmlFor="rememberMe">
                        Recordar sesión
                      </label>
                    </div>
                  </div>

                  {/* Mostrar errores */}
                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <small>{error}</small>
                    </div>
                  )}

                  <div className="d-grid gap-2 mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-semibold shadow-lg py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Iniciando...
                        </>
                      ) : (
                        <>
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="me-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          Iniciar Sesión
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-white-50">© 2025 Ing. Rafael Rojas, Orlando Bertel. All rights reserved.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
