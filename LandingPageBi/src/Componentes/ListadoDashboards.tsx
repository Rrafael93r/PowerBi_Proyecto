import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ExternalLink, Calendar, X, Maximize2 } from "lucide-react"

import { authService } from "../Servicios/auth"
import { API_BASE_URL } from "../config/api"

interface Dashboard {
    id: number
    title: string
    description: string
    url: string
    thumbnail: string
    updatedAt: string
}

const COLORS = {
    primary: "#0f1419",
    accent: "#db6600",
    secondary: "#242d36",
    cardBg: "#2c3842",
    textMuted: "rgba(255, 255, 255, 0.6)",
}

const ListadoDashboards = () => {
    const { areaId } = useParams<{ areaId: string }>()
    const navigate = useNavigate()
    const [dashboards, setDashboards] = useState<Dashboard[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [areaName, setAreaName] = useState("")
    const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Fetch Dashboards
                const dashResponse = await authService.authenticatedRequest(`/dashboards?area_id=${areaId}`)
                if (dashResponse.ok) {
                    const data = await dashResponse.json()
                    setDashboards(data)
                }

                // Fetch Area Info
                const areaResponse = await authService.authenticatedRequest(`/areas/${areaId}`)
                if (areaResponse.ok) {
                    const areaData = await areaResponse.json()
                    setAreaName(areaData.name)
                }

            } catch (error) {
                console.error("Error fetching data", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (areaId) fetchData()
    }, [areaId, navigate])

    return (
        <div style={{ minHeight: "100vh", backgroundColor: COLORS.primary, color: "white", padding: "2rem" }}>
            <div className="container">
                {/* Header */}
                <div className="d-flex align-items-center mb-5">
                    <button
                        onClick={() => navigate("/seleccion-area")}
                        className="btn btn-link text-white text-decoration-none me-3 p-0"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="fw-bold mb-1">Dashboards de {areaName || "Área"}</h1>
                        <p className="text-white-50 mb-0">Reportes y análisis disponibles</p>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-light" role="status"></div>
                    </div>
                ) : dashboards.length === 0 ? (
                    <div className="text-center py-5 text-white-50">
                        <p className="lead">No hay dashboards disponibles en esta área todavía.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {dashboards.map(dash => (
                            <div key={dash.id} className="col-md-6 col-lg-4">
                                <div
                                    className="card h-100 border-0 shadow-sm"
                                    style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", overflow: "hidden", transition: "transform 0.2s" }}
                                >
                                    {/* Thumbnail */}
                                    <div style={{ height: "160px", backgroundColor: "#1e252b", overflow: "hidden", position: "relative" }}>
                                        {dash.thumbnail ? (
                                            <img
                                                src={dash.thumbnail.startsWith("http") ? dash.thumbnail : `${API_BASE_URL}/dashboards/image/${encodeURIComponent(dash.thumbnail)}`}
                                                alt={dash.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                onError={(e) => {
                                                    console.error("Error cargando imagen:", e.currentTarget.src);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-white-50">
                                                <i className="bi bi-bar-chart-fill fs-1"></i>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        <h5 className="card-title text-white fw-bold mb-2">{dash.title}</h5>
                                        <p className="card-text text-white-50 small mb-3" style={{ minHeight: "40px" }}>
                                            {dash.description}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <small className="text-white-50 d-flex align-items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(dash.updatedAt).toLocaleDateString()}
                                            </small>
                                            <button
                                                onClick={() => setSelectedDashboard(dash)}
                                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
                                                style={{ borderColor: COLORS.accent, color: COLORS.accent }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.backgroundColor = COLORS.accent
                                                    e.currentTarget.style.color = "white"
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.backgroundColor = "transparent"
                                                    e.currentTarget.style.color = COLORS.accent
                                                }}
                                            >
                                                Ver Reporte <Maximize2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dashboard View Modal */}
            {selectedDashboard && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.9)",
                    zIndex: 2000,
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: COLORS.secondary }}>
                        <h5 className="mb-0 text-white gap-2 d-flex align-items-center">
                            <i className="bi bi-bar-chart-fill" style={{ color: COLORS.accent }}></i>
                            {selectedDashboard.title}
                        </h5>
                        <div className="d-flex gap-3">
                            <a
                                href={selectedDashboard.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
                            >
                                <ExternalLink size={16} /> Abrir en Tab
                            </a>
                            <button
                                onClick={() => setSelectedDashboard(null)}
                                className="btn btn-sm btn-light d-flex align-items-center"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div style={{ flex: 1, position: "relative" }}>
                        <iframe
                            title={selectedDashboard.title}
                            src={selectedDashboard.url}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            allowFullScreen={true}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListadoDashboards
