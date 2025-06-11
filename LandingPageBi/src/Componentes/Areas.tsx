"use client"

import type React from "react"
import { LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css"

import logotecnologia from "../assets/icons8-laptop-100.png"
import logooperaciones from "../assets/icons8-pastillas-100.png"
import logoescudo from "../assets/icons8-escudo-100.png"
import logografico from "../assets/icons8-grafico-naranja-100.png"
import logo from "../assets/icons8-grafico-100.png"

// Constantes de colores para mantener consistencia
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
}


const areas = [
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

]


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
    const navigate = useNavigate() // Volvemos a usar React Router

    const handleLogout = () => {
        console.log("Cerrando sesión...")
        // Aquí puedes agregar la lógica de cierre de sesión
    }

    const handleLogoHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
        const target = e.target as HTMLElement
        target.style.transform = isEntering ? "scale(1.05)" : "scale(1)"
    }

    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEntering: boolean) => {
        const target = e.target as HTMLButtonElement
        if (isEntering) {
            target.style.backgroundColor = COLORS.accent
            target.style.borderColor = COLORS.accent
            target.style.color = "white"
            target.style.transform = "translateY(-1px)"
        } else {
            target.style.backgroundColor = "transparent"
            target.style.borderColor = "white"
            target.style.color = "white"
            target.style.transform = "translateY(0)"
        }
    }

    const navigateToArea = (route: string) => {
        navigate(route) // Usamos navigate de React Router
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
                                <img src={logo} alt="Sistema Power BI Logo" style={styles.logoImage} />
                            </div>
                            <h4 className="text-white mb-0 fw-bold">Sistema Power BI</h4>
                        </div>

                        {/* Usuario y logout */}
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2 text-white">
                                <User size={18} />
                                <strong>Administrador</strong>
                            </div>
                            <button
                                className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                                onClick={handleLogout}
                                style={styles.logoutButton}
                                onMouseEnter={(e) => handleButtonHover(e, true)}
                                onMouseLeave={(e) => handleButtonHover(e, false)}
                                aria-label="Cerrar sesión"
                            >
                                <LogOut size={16} />
                                <span className="d-none d-sm-inline">Cerrar Sesión</span>
                            </button>
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
                    <div className="row justify-content-center gap-4">
                        {areas.map((area) => (
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

            <div>
                
            </div>
        </>
    )
}

export default Header
