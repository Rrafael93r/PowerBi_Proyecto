"use client"

import type React from "react"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../Servicios/auth"

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: string
    requiredArea?: string
}

const ProtectedRoute = ({ children, requiredRole, requiredArea }: ProtectedRouteProps) => {
    const navigate = useNavigate()

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            navigate("/login", { replace: true })
            return
        }

        // Verificar rol si es requerido
        if (requiredRole && !authService.hasRole(requiredRole)) {
            alert("No tienes permisos para acceder a esta área")
            navigate("/seleccion-area", { replace: true })
            return
        }

        // Verificar área si es requerida
        if (requiredArea && !authService.hasArea(requiredArea)) {
            alert("No tienes acceso a esta área")
            navigate("/seleccion-area", { replace: true })
            return
        }
    }, [navigate, requiredRole, requiredArea])

    // Solo renderizar si está autenticado
    if (!authService.isAuthenticated()) {
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute
