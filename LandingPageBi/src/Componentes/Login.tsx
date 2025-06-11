

import type React from "react"
import Fondo from "../assets/fondo.png"
import LogoPharmaserv from "../assets/pharmaser.png"

const Login = () => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center position-relative">
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ backgroundImage: `url(${Fondo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="bg-dark bg-opacity-50 w-100 h-100 position-absolute"></div>
            </div>
            <div className="container position-relative" style={{ zIndex: 10 }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div className="card bg-dark bg-opacity-85 border-primary border-opacity-75 shadow-lg rounded-4">
                            {/* Header with logo */}
                            <div className="card-header bg-transparent border-primary border-opacity-50 text-center py-4">
                                <img
                                    src={LogoPharmaserv || "/placeholder.svg"}
                                    alt="Pharmaserv Logo"
                                    className="img-fluid"
                                    style={{ maxHeight: "80px", maxWidth: "200px" }}
                                />

                            </div>

                            {/* Form body */}
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-light fw-medium mb-2" htmlFor="email">
                                            Usuario
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-dark bg-opacity-75 border-primary border-opacity-75 text-primary">
                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                    />
                                                </svg>
                                            </span>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control bg-dark bg-opacity-75 border-primary border-opacity-75 text-white fs-6"
                                                placeholder="Ingresa tu email"
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
                                                className="form-control bg-dark bg-opacity-75 border-primary border-opacity-75 text-white fs-6"
                                                placeholder="Ingresa tu contraseña"
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

                                    <div className="d-grid gap-2 mb-3">
                                        <button type="submit" className="btn btn-primary btn-lg fw-semibold shadow-lg py-3">
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
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <small className="text-white-50">
                                © 2025 Ing. Rafael Rojas, Orlando Bertel. All rights reserved.

                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
