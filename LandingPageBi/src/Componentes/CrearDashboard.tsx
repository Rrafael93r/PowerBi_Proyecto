"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileImage, LinkIcon, Type } from "lucide-react"
import { authService } from "../Servicios/auth"
import { API_BASE_URL, getAuthHeaders } from "../config/api"

const COLORS = {
    primary: "#0f1419",
    accent: "#db6600",
    secondary: "#242d36",
    inputBg: "#1a2027",
    inputBorder: "rgba(255, 255, 255, 0.2)",
}

const styles = {
    label: { color: "white", fontSize: "13px", marginBottom: "0.4rem", display: "flex", gap: "0.4rem" },
    input: {
        backgroundColor: COLORS.inputBg,
        border: `1px solid ${COLORS.inputBorder}`,
        borderRadius: "6px",
        color: "white",
        padding: "0.6rem 0.8rem",
        width: "100%",
    },
    select: {
        backgroundColor: COLORS.inputBg,
        border: `1px solid ${COLORS.inputBorder}`,
        borderRadius: "6px",
        color: "white",
        padding: "0.6rem 0.8rem",
        width: "100%",
    },
}

interface CrearDashboardProps {
    onClose: () => void
    currentUser: any
}

const CrearDashboard = ({ onClose, currentUser }: CrearDashboardProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        areaId: "",
        estadoId: "1",
    })
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [areas, setAreas] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await authService.authenticatedRequest("/areas")
                if (response.ok) {
                    const allAreas = await response.json()

                    if (currentUser?.role?.name?.toLowerCase() === "creador") {
                        if (currentUser.areaPrincipal) {
                            setAreas([currentUser.areaPrincipal])
                            setFormData((prev) => ({ ...prev, areaId: currentUser.areaPrincipal.id.toString() }))
                        }
                    } else {
                        setAreas(allAreas)
                    }
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchAreas()
    }, [currentUser])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("url", formData.url)
            data.append("area_id", formData.areaId)
            data.append("estado_id", formData.estadoId)
            if (thumbnail) {
                data.append("thumbnail", thumbnail)
            }

            const headers: any = getAuthHeaders()
            delete headers["Content-Type"]

            const response = await fetch(`${API_BASE_URL}/dashboards`, {
                method: "POST",
                headers: headers,
                body: data,
            })

            if (response.ok) {
                onClose()
            } else {
                const errData = await response.json()
                setError(errData.message || "Error al crear dashboard")
            }
        } catch (err) {
            setError("Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ color: "white" }}>
            <h5 className="mb-4">Nuevo Dashboard</h5>
            {error && (
                <div className="alert alert-danger p-2" style={{ fontSize: "13px" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label style={styles.label}>
                        <Type size={14} /> Título
                    </label>
                    <input
                        style={styles.input}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label style={styles.label}>Descripción</label>
                    <textarea
                        style={{ ...styles.input, minHeight: "80px" }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label style={styles.label}>
                        <LinkIcon size={14} /> URL Reporte PBI
                    </label>
                    <input
                        style={styles.input}
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        required
                        placeholder="https://app.powerbi.com/..."
                    />
                </div>

                <div className="mb-3">
                    <label style={styles.label}>Área</label>
                    <select
                        style={styles.select}
                        value={formData.areaId}
                        onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                        required
                        disabled={currentUser?.role?.name?.toLowerCase() === "creador"}
                    >
                        <option value="">Seleccionar Área</option>
                        {areas.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label style={styles.label}>
                        <FileImage size={14} /> Miniatura (Imagen)
                    </label>
                    <input
                        type="file"
                        style={styles.input}
                        onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                        accept="image/*"
                    />
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" onClick={onClose} className="btn btn-outline-light btn-sm">
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-warning btn-sm" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar Dashboard"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CrearDashboard
