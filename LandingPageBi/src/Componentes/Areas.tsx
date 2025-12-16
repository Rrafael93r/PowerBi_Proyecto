"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronDown, LogOut, User, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService, type Usuario } from "../Servicios/auth"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

import CrearUsuario from "../Componentes/CrearUsuario"
import AdministrarUsuarios from "../Componentes/AdministrarUsuarios"
import CrearDashboard from "../Componentes/CrearDashboard"

const COLORS = {
  primary: "#0f1419",
  accent: "#ff6b00",
  accentLight: "#ff8534",
  secondary: "#1a1f26",
  cardBg: "#242b33",
  cardHover: "#2d3542",
  green: "rgba(0, 200, 83, 0.12)",
  greenSolid: "#00c853",
  blue: "rgba(0, 149, 246, 0.12)",
  blueSolid: "#0095f6",
  purple: "rgba(138, 43, 226, 0.12)",
  purpleSolid: "#8a2be2",
}

const styles = {
  logoContainer: {
    backgroundColor: COLORS.accent,
    borderRadius: "12px",
    padding: "10px",
    height: "50px",
    width: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
  },
  card: {
    borderRadius: "16px",
    backgroundColor: COLORS.cardBg,
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  iconCircle: {
    height: "120px",
    width: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3.5rem",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: 0,
  },
  actionCircle: {
    height: "56px",
    width: "56px",
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontSize: "1.5rem",
  },
}

const features = [
  {
    icon: "bi-shield-check",
    text: "Acceso Seguro",
  },
  {
    icon: "bi-graph-up-arrow",
    text: "Datos en Tiempo Real",
  },
]

const Header = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [availableAreas, setAvailableAreas] = useState<any[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false)
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)

    if (!user) return

    const fetchAreas = async () => {
      try {
        const response = await authService.authenticatedRequest("/areas")
        if (response.ok) {
          const allAreas: any[] = await response.json()

          const isAllAreas =
            authService.hasArea("todas") ||
            user?.areas?.some(a => a.id === 3 || a.name.toLowerCase() === "todas")

          let filteredAreas = []

          if (isAllAreas) {
            filteredAreas = allAreas
          } else {
            filteredAreas = allAreas.filter((area) => authService.hasArea(area.name))
          }

          const mappedAreas = filteredAreas.map(area => ({
            ...area,
            title: area.name.toUpperCase(),
            icon: area.icon || "bi-grid-fill",
            iconColor: area.color || COLORS.accent,
            iconBg: area.color ? `${area.color}20` : COLORS.green,
            route: area.route || `/dashboards/${area.id}`
          }))

          setAvailableAreas(mappedAreas)
        }
      } catch (error) {
        console.error("Error fetching areas:", error)
      }
    }

    fetchAreas()
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
      navigate("/login", { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    const target = e.currentTarget
    if (isEntering) {
      target.style.transform = "scale(1.08) rotate(5deg)"
      target.style.boxShadow = "0 6px 20px rgba(255, 107, 0, 0.5)"
    } else {
      target.style.transform = "scale(1) rotate(0deg)"
      target.style.boxShadow = "0 4px 12px rgba(255, 107, 0, 0.3)"
    }
  }

  const navigateToArea = (route: string) => {
    // Check if route is already a path or needs construction
    // Assuming backend sends null route usually, so we constructed "/dashboard-default"
    // We want to force it to /dashboards/:id if not explicitly set.
    // However, existing mapping in useEffect sends `area.route`.
    // Let's rely on the mapping in useEffect mainly.
    // Implemented logic: If route starts with /, navigate.
    navigate(route)
  }

  const getUserDisplayName = () => {
    if (!currentUser) return "Usuario"

    const { nombre, segundo_nombre, apellido_1 } = currentUser
    return `${nombre} ${segundo_nombre || ""} ${apellido_1 || ""}`.trim()
  }



  const closeModal = () => {
    setIsModalOpen(false)
    setIsUserMgmtOpen(false)
    setIsCreateDashboardOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

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
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050,
          backdropFilter: "blur(4px)",
        }}
        onClick={closeModal}
      >
        <div
          style={{
            backgroundColor: COLORS.cardBg,
            color: "white",
            borderRadius: "16px",
            width: "700px",
            maxWidth: "95%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255, 107, 0, 0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: COLORS.primary,
              padding: "1.5rem",
              borderRadius: "16px 16px 0 0",
              borderBottom: `2px solid ${COLORS.accent}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5
              className="modal-title mb-0 d-flex align-items-center gap-2 text-white"
              style={{ fontSize: "1.25rem", fontWeight: "600" }}
            >
              <User size={22} />
              Crear Nuevo Usuario
            </h5>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.accent
                e.currentTarget.style.color = "white"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ padding: "1.5rem" }}>
            <CrearUsuario onClose={closeModal} />
          </div>
        </div>
      </div>
    )
  }

  const CreateDashboardModal = () => {
    if (!isCreateDashboardOpen) return null

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050,
          backdropFilter: "blur(4px)",
        }}
        onClick={closeModal}
      >
        <div
          style={{
            backgroundColor: COLORS.cardBg,
            color: "white",
            borderRadius: "16px",
            width: "600px",
            maxWidth: "95%",
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255, 107, 0, 0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CrearDashboard onClose={closeModal} currentUser={currentUser} />
        </div>
      </div>
    )
  }
  const UserMgmtModal = () => {
    if (!isUserMgmtOpen) return null

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050,
          backdropFilter: "blur(4px)",
        }}
        onClick={closeModal}
      >
        <div
          style={{
            backgroundColor: COLORS.cardBg,
            color: "white",
            borderRadius: "16px",
            width: "900px",
            maxWidth: "95%",
            height: "85vh",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255, 107, 0, 0.2)",
            overflow: "hidden"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: COLORS.primary,
              padding: "1.5rem",
              borderRadius: "16px 16px 0 0",
              borderBottom: `2px solid ${COLORS.accent}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0
            }}
          >
            <h5
              className="modal-title mb-0 d-flex align-items-center gap-2 text-white"
              style={{ fontSize: "1.25rem", fontWeight: "600" }}
            >
              <User size={22} />
              Administración de Usuarios
            </h5>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.accent
                e.currentTarget.style.color = "white"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ padding: "1.5rem", overflowY: "auto", flexGrow: 1 }}>
            <AdministrarUsuarios onClose={closeModal} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <header
        className="shadow-lg"
        style={{ backgroundColor: COLORS.primary, borderBottom: `3px solid ${COLORS.accent}` }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between py-3 px-4">
            {/* Logo y título */}
            <div className="d-flex align-items-center gap-3">
              <div
                style={styles.logoContainer}
                onMouseEnter={(e) => handleLogoHover(e, true)}
                onMouseLeave={(e) => handleLogoHover(e, false)}
              >
                <i className="bi bi-bar-chart-fill text-white" style={{ fontSize: "1.75rem" }}></i>
              </div>
              <div>
                <h4 className="text-white mb-0 fw-bold" style={{ letterSpacing: "0.5px" }}>
                  Sistema Power BI
                </h4>
                <small className="text-white-50">Analytics Dashboard</small>
              </div>
            </div>

            {/* Usuario y logout */}
            <div className="d-flex align-items-center gap-3">
              <div className="dropdown position-relative">
                <button
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                  type="button"
                  onClick={toggleDropdown}
                  style={{
                    borderRadius: "10px",
                    border: "1.5px solid rgba(255, 255, 255, 0.2)",
                    fontSize: "14px",
                    padding: "10px 16px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.accent
                    e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <div className="d-flex align-items-center gap-2 text-white">
                    <User size={20} />
                    <div className="d-flex flex-column align-items-start">
                      <strong className="mb-0" style={{ fontSize: "14px" }}>
                        {getUserDisplayName()}
                      </strong>
                      <small className="text-white-50" style={{ fontSize: "11px" }}>
                        {currentUser?.role?.name} • {currentUser?.areas?.[0]?.name || "Sin área"}
                      </small>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    style={{
                      transition: "transform 0.3s ease",
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {isDropdownOpen && (
                  <ul
                    className="dropdown-menu dropdown-menu-end show position-absolute"
                    style={{
                      backgroundColor: COLORS.cardBg,
                      border: `1px solid ${COLORS.accent}`,
                      borderRadius: "10px",
                      top: "calc(100% + 8px)",
                      right: 0,
                      zIndex: 1000,
                      minWidth: "220px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {authService.hasRole("administrador") && (
                      <li className="dropdown-item" style={{ padding: "8px 12px" }}>
                        <button
                          type="button"
                          className="btn w-100 text-white text-start d-flex align-items-center gap-2"
                          onClick={() => {
                            setIsUserMgmtOpen(true)
                            setIsDropdownOpen(false)
                          }}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.15)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                          }}
                        >
                          <i className="bi bi-people-fill" style={{ fontSize: "16px" }}></i>
                          <span>Gestionar Usuarios</span>
                        </button>
                      </li>
                    )}
                    {(authService.hasRole("administrador") || authService.hasRole("creador")) && (
                      <li className="dropdown-item" style={{ padding: "8px 12px" }}>
                        <button
                          type="button"
                          className="btn w-100 text-white text-start d-flex align-items-center gap-2"
                          onClick={() => {
                            setIsCreateDashboardOpen(true)
                            setIsDropdownOpen(false)
                          }}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.15)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                          }}
                        >
                          <i className="bi bi-grid-3x3-gap" style={{ fontSize: "16px" }}></i>
                          <span>Crear Dashboard</span>
                        </button>
                      </li>
                    )}
                    <li>
                      <hr
                        className="dropdown-divider"
                        style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "8px 0" }}
                      />
                    </li>
                    <li style={{ padding: "8px 12px" }}>
                      <button
                        className="btn w-100 text-white text-start d-flex align-items-center gap-2"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isLoggingOut) {
                            e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.2)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        {isLoggingOut ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                              style={{ width: "16px", height: "16px" }}
                            ></div>
                            <span>Cerrando...</span>
                          </>
                        ) : (
                          <>
                            <LogOut size={16} />
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
      <div className="position-relative" style={{ backgroundColor: COLORS.primary, overflow: "hidden" }}>
        {/* Decorative gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(255, 107, 0, 0.08) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />

        <div className="container-fluid py-5 position-relative" style={{ zIndex: 1 }}>
          <div className="container py-4">
            <div className="row justify-content-center text-center">
              <div className="col-lg-9">


                <h1 className="display-4 fw-bold mb-4 text-white" style={{ fontSize: "3rem", lineHeight: "1.2" }}>
                  Selecciona el{" "}
                  <span style={{ color: COLORS.accentLight, textShadow: "0 0 30px rgba(255, 107, 0, 0.4)" }}>Área</span>{" "}
                  de Análisis
                </h1>
                <p
                  className="lead mb-5 text-white-50"
                  style={{ fontSize: "1.15rem", maxWidth: "700px", margin: "0 auto" }}
                >
                  Accede a los dashboards especializados de cada departamento. Cada área contiene reportes y métricas
                  específicas para tu análisis estratégico.
                </p>

                {/* Features */}
                <div className="d-flex justify-content-center gap-5 flex-wrap mt-5">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-3 text-white"
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "all 0.3s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.1)"
                        e.currentTarget.style.borderColor = COLORS.accent
                        e.currentTarget.style.transform = "translateY(-2px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      <i className={feature.icon} style={{ fontSize: "1.5rem", color: COLORS.accentLight }}></i>
                      <span className="fw-semibold" style={{ fontSize: "15px" }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container-fluid py-5" style={{ backgroundColor: COLORS.secondary, minHeight: "100vh" }}>
        <div className="container py-4">
          {availableAreas.length > 0 ? (
            <div className="row justify-content-center g-4">
              {availableAreas.map((area) => (
                <div key={area.id} className="col-lg-5 col-md-6">
                  <div
                    className="card text-white p-4 d-flex flex-column align-items-center h-100 position-relative"
                    style={styles.card}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)"
                      e.currentTarget.style.boxShadow = `0 12px 36px rgba(0, 0, 0, 0.3), 0 0 0 1px ${area.iconColor}40`
                      e.currentTarget.style.backgroundColor = COLORS.cardHover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.backgroundColor = COLORS.cardBg
                    }}
                  >
                    {/* Decorative corner accent */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100px",
                        height: "100px",
                        background: `linear-gradient(135deg, transparent 50%, ${area.iconBg} 50%)`,
                        borderRadius: "0 16px 0 0",
                      }}
                    />

                    <div className="mt-3 mb-4">
                      <div
                        style={{
                          ...styles.iconCircle,
                          backgroundColor: area.iconBg,
                          color: area.iconColor,
                        }}
                      >
                        <i className={area.icon}></i>
                      </div>
                    </div>

                    <h4
                      className="mt-2 mb-3 text-center fw-bold"
                      style={{ fontSize: "1.4rem", letterSpacing: "0.5px" }}
                    >
                      {area.title}
                    </h4>
                    <p
                      className="text-center text-white-50 flex-grow-1 mb-4"
                      style={{ fontSize: "15px", lineHeight: "1.6" }}
                    >
                      {area.description}
                    </p>

                    <div
                      className="w-100 mb-3"
                      style={{
                        height: "2px",
                        background: `linear-gradient(90deg, transparent, ${area.iconColor}40, transparent)`,
                      }}
                    />

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
                          border: `2px solid ${area.iconColor}`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = area.iconColor
                          e.currentTarget.style.color = "white"
                          e.currentTarget.style.transform = "scale(1.1) rotate(90deg)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = area.iconBg
                          e.currentTarget.style.color = area.iconColor
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)"
                        }}
                      >
                        <i className="bi bi-arrow-right fw-bold"></i>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white py-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem", color: COLORS.accent }}></i>
              </div>
              <h3 className="mb-3">No tienes acceso a ningún área</h3>
              <p className="text-white-50">Contacta al administrador para obtener los permisos necesarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: COLORS.primary, borderTop: `2px solid ${COLORS.accent}` }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="mb-2">
                <i className="bi bi-code-slash" style={{ fontSize: "1.5rem", color: COLORS.accent }}></i>
              </div>
              <p className="mb-0 text-white-50" style={{ fontSize: "14px" }}>
                © 2025 Ing. Rafael Rojas, Orlando Bertel. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>


      <Modal />
      <UserMgmtModal />
      <CreateDashboardModal />
    </>
  )
}

export default Header
