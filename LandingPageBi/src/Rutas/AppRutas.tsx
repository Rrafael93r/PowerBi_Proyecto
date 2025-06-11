import { Route, Routes } from "react-router-dom"
import PaginaDashboard from "../Paginas/PaginaDashboard"
import SeleccionArea from "../Paginas/PaginaSeleccionArea"
import PaginaLogin from "../Paginas/PaginaLogin"

export const AppRutas = () => {
    return (
        <Routes>
            <Route path="/" element={<PaginaLogin />} />




            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/seleccion-area" element={<SeleccionArea />} />
            <Route path="/dashboard-Tic" element={<PaginaDashboard />} />


        </Routes>


    )
}
export default AppRutas