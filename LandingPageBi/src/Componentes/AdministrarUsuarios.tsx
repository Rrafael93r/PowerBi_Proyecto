"use client"

import { useState, useEffect } from "react"
import { Edit, User, Search } from "lucide-react"
import CrearUsuario from "./CrearUsuario"
import { authService } from "../Servicios/auth"

interface Usuario {
    id: number
    nombre: string
    segundo_nombre: string
    apellido_1: string
    apellido_2: string
    usuario: string
    correo: string
    role: {
        id: number
        name: string
    }
    areas: {
        id: number
        name: string
    }[]
    estado: {
        id: number
        name: string
    }
}

const COLORS = {
    primary: "#0f1419",
    accent: "#ff6b00",
    secondary: "#1a1f26",
    cardBg: "#242b33",
    text: "white",
    textMuted: "rgba(255, 255, 255, 0.6)",
    border: "rgba(255, 255, 255, 0.1)",
}

const AdministrarUsuarios = ({ onClose }: { onClose: () => void }) => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<Usuario | null>(null)
    const [showForm, setShowForm] = useState(false)

    const fetchUsuarios = async () => {
        try {
            setIsLoading(true)
            const response = await authService.authenticatedRequest("/usuarios")
            if (response.ok) {
                const data = await response.json()
                setUsuarios(data)
                setFilteredUsuarios(data)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    useEffect(() => {
        const term = searchTerm.toLowerCase()
        const filtered = usuarios.filter(
            (user) =>
                user.nombre.toLowerCase().includes(term) ||
                user.apellido_1.toLowerCase().includes(term) ||
                user.usuario.toLowerCase().includes(term) ||
                user.correo.toLowerCase().includes(term),
        )
        setFilteredUsuarios(filtered)
    }, [searchTerm, usuarios])

    const handleEdit = (user: Usuario) => {
        setEditingUser(user)
        setShowForm(true)
    }

    const handleCreate = () => {
        setEditingUser(null)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingUser(null)
        fetchUsuarios()
    }

    if (showForm) {
        return (
            <div style={{ height: "100%" }}>
                <button
                    onClick={() => setShowForm(false)}
                    className="btn btn-link text-white text-decoration-none mb-3 p-0"
                    style={{
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(-4px)"
                        e.currentTarget.style.color = COLORS.accent
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)"
                        e.currentTarget.style.color = "white"
                    }}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver a la lista
                </button>
                <CrearUsuario onClose={handleCloseForm} userToEdit={editingUser} />
            </div>
        )
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                        Gestión de cuentas y permisos
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn d-flex align-items-center gap-2"
                    style={{
                        backgroundColor: COLORS.accent,
                        color: "white",
                        border: "none",
                        borderRadius: "10px", // bordes más redondeados
                        padding: "10px 18px", // padding mejorado
                        fontSize: "14px",
                        fontWeight: "500", // peso de fuente
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // transición suave
                        boxShadow: "0 2px 8px rgba(255, 107, 0, 0.2)", // sombra inicial
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)" // elevación
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 0, 0.4)" // sombra intensa
                        e.currentTarget.style.backgroundColor = "#ff7a1f" // color más claro
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 0, 0.2)"
                        e.currentTarget.style.backgroundColor = COLORS.accent
                    }}
                >
                    <i className="bi bi-person-plus-fill"></i>
                    Nuevo Usuario
                </button>
            </div>

            <div className="mb-4 position-relative">
                <Search
                    size={18}
                    style={{
                        position: "absolute",
                        left: "14px", // posición ajustada
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: COLORS.textMuted,
                        pointerEvents: "none", // evitar interferencia con input
                    }}
                />
                <input
                    type="text"
                    placeholder="Buscar por nombre, usuario o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: "100%",
                        backgroundColor: COLORS.secondary,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: "10px", // bordes más redondeados
                        padding: "12px 14px 12px 44px", // padding mejorado
                        color: "white",
                        fontSize: "14px",
                        transition: "all 0.3s ease", // transición suave
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = COLORS.accent // borde de color al focus
                        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(255, 107, 0, 0.1)` // sombra de focus
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = COLORS.border
                        e.currentTarget.style.boxShadow = "none"
                    }}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-light"
                        role="status"
                        style={{
                            width: "3rem", // tamaño aumentado
                            height: "3rem",
                            borderWidth: "3px", // borde más grueso
                        }}
                    ></div>
                    <p className="mt-3 text-white-50">Cargando usuarios...</p>
                </div>
            ) : (
                <div
                    style={{
                        overflowX: "auto",
                        borderRadius: "12px", // bordes redondeados en contenedor
                        border: `1px solid ${COLORS.border}`, // borde sutil
                    }}
                >
                    <table
                        className="table table-hover"
                        style={{
                            color: "white",
                            fontSize: "14px",
                            marginBottom: 0, // sin margen inferior
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    borderBottom: `2px solid ${COLORS.border}`, // borde más grueso
                                    backgroundColor: "rgba(255, 255, 255, 0.02)", // fondo sutil
                                }}
                            >
                                <th
                                    style={{
                                        backgroundColor: "transparent",
                                        color: COLORS.textMuted,
                                        fontWeight: "600", // peso aumentado
                                        padding: "16px 12px", // padding mejorado
                                        textTransform: "uppercase", // mayúsculas
                                        fontSize: "12px", // tamaño reducido
                                        letterSpacing: "0.5px", // espaciado
                                    }}
                                >
                                    Usuario
                                </th>
                                <th
                                    style={{
                                        backgroundColor: "transparent",
                                        color: COLORS.textMuted,
                                        fontWeight: "600",
                                        padding: "16px 12px",
                                        textTransform: "uppercase",
                                        fontSize: "12px",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    Rol
                                </th>
                                <th
                                    style={{
                                        backgroundColor: "transparent",
                                        color: COLORS.textMuted,
                                        fontWeight: "600",
                                        padding: "16px 12px",
                                        textTransform: "uppercase",
                                        fontSize: "12px",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    Áreas
                                </th>
                                <th
                                    style={{
                                        backgroundColor: "transparent",
                                        color: COLORS.textMuted,
                                        fontWeight: "600",
                                        textAlign: "right",
                                        padding: "16px 12px",
                                        textTransform: "uppercase",
                                        fontSize: "12px",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((user) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: `1px solid ${COLORS.border}`,
                                        verticalAlign: "middle",
                                        transition: "background-color 0.2s ease", // transición suave
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)" // hover sutil
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "transparent"
                                    }}
                                >
                                    <td style={{ backgroundColor: "transparent", padding: "16px 12px" }}>
                                        {" "}
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                style={{
                                                    width: "38px", // tamaño aumentado
                                                    height: "38px",
                                                    borderRadius: "50%",
                                                    backgroundColor: COLORS.secondary,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: COLORS.accent,
                                                    border: `2px solid ${COLORS.accent}30`, // borde de color
                                                    transition: "all 0.3s ease", // transición
                                                }}
                                            >
                                                <User size={18} /> {/* tamaño aumentado */}
                                            </div>
                                            <div>
                                                <div className="fw-medium">
                                                    {user.nombre} {user.apellido_1}
                                                </div>
                                                <div className="text-white-50" style={{ fontSize: "12px" }}>
                                                    {user.correo}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ backgroundColor: "transparent", padding: "16px 12px" }}>
                                        {" "}
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                color: "white",
                                                fontWeight: "500", // peso mejorado
                                                padding: "6px 12px", // padding mejorado
                                                borderRadius: "6px", // bordes redondeados
                                                fontSize: "12px", // tamaño ajustado
                                            }}
                                        >
                                            {user.role?.name || "Sin rol"}
                                        </span>
                                    </td>
                                    <td style={{ backgroundColor: "transparent", padding: "16px 12px" }}>
                                        {" "}
                                        <div className="d-flex gap-1 flex-wrap">
                                            {user.areas?.slice(0, 2).map((area) => (
                                                <span
                                                    key={area.id}
                                                    style={{
                                                        fontSize: "11px",
                                                        padding: "4px 8px", // padding mejorado
                                                        borderRadius: "5px", // bordes más redondeados
                                                        backgroundColor: "#2d3542",
                                                        color: "#a0aec0",
                                                        fontWeight: "500", // peso mejorado
                                                    }}
                                                >
                                                    {area.name}
                                                </span>
                                            ))}
                                            {user.areas?.length > 2 && (
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: COLORS.textMuted,
                                                        padding: "4px 8px", // padding para consistencia
                                                    }}
                                                >
                                                    +{user.areas.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ backgroundColor: "transparent", textAlign: "right", padding: "16px 12px" }}>
                                        {" "}
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="btn btn-sm btn-link text-white-50 p-2" // padding aumentado
                                            title="Editar"
                                            style={{
                                                transition: "all 0.2s ease", // transición suave
                                                borderRadius: "6px", // bordes redondeados
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = COLORS.accent // color accent
                                                e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.1)" // fondo sutil
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"
                                                e.currentTarget.style.backgroundColor = "transparent"
                                            }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdministrarUsuarios
