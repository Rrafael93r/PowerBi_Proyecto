import { Route, Routes } from "react-router-dom"
import PaginaDashboard from "../Paginas/PaginaDashboard"
import SeleccionArea from "../Paginas/PaginaSeleccionArea"
import PaginaLogin from "../Paginas/PaginaLogin"
import ProtectedRoute from "./ProteccionRutas"
import ListadoDashboards from "../Componentes/ListadoDashboards"

export const AppRutas = () => {
    return (
        <Routes>

            <Route path="/" element={<PaginaLogin />} />
            <Route path="/login" element={<PaginaLogin />} />

            <Route
                path="/seleccion-area"
                element={
                    <ProtectedRoute>
                        <SeleccionArea />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/dashboard-Tic"
                element={
                    <ProtectedRoute requiredArea="tecnologia">
                        <PaginaDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboards/:areaId"
                element={
                    <ProtectedRoute>
                        <ListadoDashboards />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRole="administrador">
                        <div>Panel de Administración</div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRutas
