"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronDown, LogOut, User, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService, type Usuario } from "../Servicios/auth"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

import logotecnologia from "../assets/icons8-laptop-100.png"
import logooperaciones from "../assets/icons8-pastillas-100.png"
import logoescudo from "../assets/icons8-escudo-100.png"
import logografico from "../assets/icons8-grafico-naranja-100.png"
import logo from "../assets/icons8-grafico-100.png"



import CrearUsuario from "../Componentes/CrearUsuario"



const COLORS = {
  primary: "#0f1419",
  accent: "#db6600",
  accentLight: "#f58634",
  secondary: "#242d36",
  cardBg: "#2c3842",
  green: "rgba(0, 128, 0, 0.17)",
  greenSolid: "rgb(0, 128, 0)",
  blue: "rgba(0, 66, 128, 0.17)",
  blueSolid: "rgb(0, 147, 184)",
}

// Estilos reutilizables
const styles = {
  logoContainer: {
    backgroundColor: COLORS.accent,
    borderRadius: "10px",
    padding: "8px",
    height: "45px",
    width: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  },
  logoImage: {
    height: "28px",
    width: "28px",
    objectFit: "contain" as const,
  },
  logoutButton: {
    borderRadius: "8px",
    borderWidth: "1.5px",
    transition: "all 0.3s ease",
  },
  featureIcon: {
    height: "20px",
    width: "20px",
  },
  card: {
    borderRadius: "10px",
    backgroundColor: COLORS.cardBg,
  },
  cardIcon: {
    height: "100px",
    width: "100px",
    padding: "20px",
    borderRadius: "50%",
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
  },
  actionCircle: {
    height: "50px",
    width: "50px",
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Estilos para el modal
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1050,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBody: {
    padding: "1rem 1.5rem",
  },
  modalFooter: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #dee2e6",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0",
    color: "#6c757d",
  },
}

const features = [
  {
    icon: logoescudo,
    text: "Acceso Seguro",
  },
  {
    icon: logografico,
    text: "Datos en Tiempo Real",
  },
]

const Header = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [availableAreas, setAvailableAreas] = useState<any[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)



    if (user) {
      const areas = []


      if (authService.hasRole("administrador")) {
        areas.push(
          {
            id: "tecnologia",
            title: "TECNOLOGÍA",
            description: "Dashboards de incidencias, mesa de ayuda y análisis técnico",
            icon: logotecnologia,
            iconBg: COLORS.green,
            iconColor: COLORS.greenSolid,
            route: "/dashboard-Tic",
          },
          {
            id: "operaciones",
            title: "OPERACIONES",
            description: "Control de farmacias del consorcio y análisis de novedades",
            icon: logooperaciones,
            iconBg: COLORS.blue,
            iconColor: COLORS.blueSolid,
            route: "/dashboard-operaciones",
          },
        )
      } else {
        if (authService.hasArea("tecnologia")) {
          areas.push({
            id: "tecnologia",
            title: "TECNOLOGÍA",
            description: "Dashboards de incidencias, mesa de ayuda y análisis técnico",
            icon: logotecnologia,
            iconBg: COLORS.green,
            iconColor: COLORS.greenSolid,
            route: "/dashboard-Tic",
          })
        }

        if (authService.hasArea("operaciones")) {
          areas.push({
            id: "operaciones",
            title: "OPERACIONES",
            description: "Control de farmacias del consorcio y análisis de novedades",
            icon: logooperaciones,
            iconBg: COLORS.blue,
            iconColor: COLORS.blueSolid,
            route: "/dashboard-operaciones",
          })
        }
      }

      setAvailableAreas(areas)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".dropdown")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await authService.logout()
      navigate("/login", { replace: true })
    } catch (error) {
      // Aún así, redirigir al login
      navigate("/login", { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    const target = e.target as HTMLElement
    target.style.transform = isEntering ? "scale(1.05)" : "scale(1)"
  }

  const navigateToArea = (route: string) => {
    navigate(route)
  }

  // Función para obtener el nombre completo del usuario
  const getUserDisplayName = () => {
    if (!currentUser) return "Usuario"

    const { nombre, segundo_nombre, apellido_1 } = currentUser
    return `${nombre} ${segundo_nombre || ""} ${apellido_1 || ""}`.trim()
  }

  const openModal = () => {
    setIsModalOpen(true)
    setIsDropdownOpen(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Modal Component
  const Modal = () => {
    if (!isModalOpen) return null

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050,
        }}
        onClick={closeModal}
      >
        <div
          style={{
            backgroundColor: COLORS.cardBg,
            color: "white",
            borderRadius: "12px",
            width: "700px",
            maxWidth: "95%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Modal */}
          <div
            style={{
              backgroundColor: COLORS.primary,
              padding: "1.5rem",
              borderRadius: "12px 12px 0 0",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 className="modal-title mb-0 d-flex align-items-center gap-2 text-white" style={{ fontSize: "1.25rem", textAlign: "center" }}>
              <User size={20} />
              Crear Nuevo Usuario
            </h5>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                e.currentTarget.style.color = "white"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body del Modal */}
          <div style={{ padding: "1.5rem" }}>
            <CrearUsuario onClose={closeModal} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="shadow-sm" style={{ backgroundColor: COLORS.primary }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between py-2 px-3">
            {/* Logo y título */}
            <div className="d-flex align-items-center gap-3">
              <div
                style={styles.logoContainer}
                onMouseEnter={(e) => handleLogoHover(e, true)}
                onMouseLeave={(e) => handleLogoHover(e, false)}
              >
                <img src={logo || "/placeholder.svg"} alt="Sistema Power BI Logo" style={styles.logoImage} />
              </div>
              <h4 className="text-white mb-0 fw-bold">Sistema Power BI</h4>
            </div>

            {/* Usuario y logout */}
            <div className="d-flex align-items-center gap-3">
              <div className="dropdown position-relative">
                <button
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                  type="button"
                  onClick={toggleDropdown}
                  style={{
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontSize: "13px",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 text-white">
                    <User size={18} />
                    <div className="d-flex flex-column">
                      <strong className="mb-0">{getUserDisplayName()}</strong>
                      <small className="text-white-50">
                        {currentUser?.role?.name} - {currentUser?.area?.name}
                      </small>
                    </div>
                  </div>
                  <ChevronDown size={16} />
                </button>

                {isDropdownOpen && (
                  <ul
                    className="dropdown-menu dropdown-menu-end show position-absolute"
                    style={{
                      backgroundColor: COLORS.cardBg,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      top: "100%",
                      right: 0,
                      zIndex: 1000,
                    }}
                  >
                    <li className="dropdown-item">
                      <button type="button" className="btn w-100 text-white" onClick={openModal}>
                        Crear Usuario
                      </button>
                    </li>
                    <li className="dropdown-item">
                      <button type="button" className="btn w-100 text-white">
                        Crear Dashboard
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-white d-flex align-items-center gap-2"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        style={{ fontSize: "14px" }}
                      >
                        {isLoggingOut ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                              style={{ width: "14px", height: "14px" }}
                            ></div>
                            <span>Cerrando...</span>
                          </>
                        ) : (
                          <>
                            <LogOut size={14} />
                            <span>Cerrar Sesión</span>
                          </>
                        )}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container-fluid py-5" style={{ backgroundColor: COLORS.primary }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4 text-white">
                Selecciona el <span style={{ color: COLORS.accentLight }}>Área</span> de Análisis
              </h1>
              <p className="lead mb-4 text-white">
                Accede a los dashboards especializados de cada departamento. Cada área contiene reportes y métricas
                específicas para tu análisis.
              </p>

              {/* Features */}
              <div className="d-flex justify-content-center gap-4 flex-wrap mt-4">
                {features.map((feature, index) => (
                  <div key={index} className="d-flex gap-2 text-white" style={{ cursor: "pointer" }}>
                    <img src={feature.icon || "/placeholder.svg"} alt="" style={styles.featureIcon} />
                    <p className="mb-0">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container-fluid py-5" style={{ backgroundColor: COLORS.secondary, minHeight: "100vh" }}>
        <div className="container">
          {availableAreas.length > 0 ? (
            <div className="row justify-content-center gap-4">
              {availableAreas.map((area) => (
                <div key={area.id} className="col-lg-5 col-md-6">
                  <div className="card text-white p-4 d-flex flex-column align-items-center h-100" style={styles.card}>
                    <img
                      src={area.icon || "/placeholder.svg"}
                      alt={`Ícono de ${area.title.toLowerCase()}`}
                      style={{
                        ...styles.cardIcon,
                        backgroundColor: area.iconBg,
                      }}
                    />
                    <h4 className="mt-3 text-center">{area.title}</h4>
                    <p className="text-center flex-grow-1">{area.description}</p>
                    <hr className="w-100 border-light" />
                    <button
                      onClick={() => navigateToArea(area.route)}
                      style={styles.actionButton}
                      aria-label={`Ir a ${area.title}`}
                    >
                      <div
                        style={{
                          ...styles.actionCircle,
                          backgroundColor: area.iconBg,
                          color: area.iconColor,
                        }}
                      >
                        <i className="bi bi-arrow-right fs-5"></i>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white">
              <h3>No tienes acceso a ningún área</h3>
              <p>Contacta al administrador para obtener permisos</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: COLORS.primary }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0 text-white">© 2025 Ing. Rafael Rojas, Orlando Bertel. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal />
    </>
  )
}

export default Header
