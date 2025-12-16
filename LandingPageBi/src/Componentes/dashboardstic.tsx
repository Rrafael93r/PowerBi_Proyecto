import { useState } from "react"
import imgbitacora from "../assets/BITACORAIMG.png"
import imgmesadeayuda from "../assets/MESADEAYUDA.png"
import imgmodems from "../assets/MODEMSIMG.png"
import flechaatras from "../assets/FLECHA-ATRAS.png"
import fondonarnaja from "../assets/Circuitos Contrastantes en Naranja y Azul.png"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"

interface Dashboard {
  id: number
  title: string
  description: string
  thumbnail: string
  category: string
  lastUpdated: string
  embedUrl?: string
}

const dashboards: Dashboard[] = [
  {
    id: 1,
    title: "Bitácora Incidencias de Internet",
    description: "Dashboard de incidencias y métricas de conectividad",
    thumbnail: imgbitacora,
    category: "Bitacora",
    lastUpdated: "2025-05-27",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiMzBkNGExOTAtNDNhYS00Y2VmLWJhMjMtNjVkYWE2MjRlZGU3IiwidCI6IjUzYzBiMjUyLTFhZDEtNGI2MC1hZDU1LTIzMGM4MTM3MDEwZiJ9&pageName=3721d9830b6136039751",
  },
  {
    id: 2,
    title: "Mesa de Ayuda Departamento TIC",
    description: "Dashboard de Tickets y Metricas de Soporte",
    thumbnail: imgmesadeayuda,
    category: "Mesa de Ayuda",
    lastUpdated: "2025-05-27",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiYTIxYTRlMTEtYmQ5ZC00NDlkLWEwZGItMGYwNWIzYTY1M2IwIiwidCI6IjUzYzBiMjUyLTFhZDEtNGI2MC1hZDU1LTIzMGM4MTM3MDEwZiJ9",
  },
  {
    id: 3,
    title: "Análisis de Modems",
    description: "Métricas y KPIs de estado y ubicacion de nuestros Modems",
    thumbnail: imgmodems,
    category: "Modems",
    lastUpdated: "2025-05-27",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiYjU3NzlhZjEtY2M1YS00NzUxLThlMDctNjdmMzM3MTM0ZTZlIiwidCI6IjUzYzBiMjUyLTFhZDEtNGI2MC1hZDU1LTIzMGM4MTM3MDEwZiJ9",
  },
]

const categories = ["Todos", "Bitacora", "Modems", "Mesa de Ayuda"]

function Navbar() {
  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: "#0f1419" }}>
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1 d-flex align-items-center">
          <div
            className="me-3 d-flex align-items-center justify-content-center rounded"
            style={{
              backgroundColor: "#ff6b35",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <Link to="/seleccion-area">
              <button style={{ backgroundColor: "rgba(0, 0, 0, 0)", border: "none" }}>
                <img style={{ height: "25px", width: "25px" }} src={flechaatras} alt="ATRAS" />
              </button>
            </Link>
          </div>
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>Tableros Power BI</span>
        </span>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#0f1419" }}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-4
              text-white">
              Dashboard de <span style={{ color: "#ff6b35" }}>Soporte TI</span> y Análisis
            </h1>
            <p className="lead mb-4 text-white">
              Explora nuestros tableros interactivos de Power BI con métricas de soporte técnico, análisis de
              incidencias, proveedores y mucho más.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setSelectedCategory(category)}
                style={{
                  backgroundColor: selectedCategory === category ? "#ff6b35" : "transparent",
                  borderColor: "#ff6b35",
                  color: selectedCategory === category ? "white" : "#ff6b35",
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  dashboard: Dashboard
  onClick: (dashboard: Dashboard) => void
}

function DashboardCard({ dashboard, onClick }: DashboardCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="col-lg-4 col-md-6">
      <div
        className="card h-100 shadow-lg"
        style={{
          backgroundColor: "#2a3441",
          border: "1px solid #3a4651",
          cursor: "pointer",
        }}
        onClick={() => onClick(dashboard)}
      >
        <div className="position-relative">
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div
                  className="card-img-top d-flex align-items-center justify-content-center"
                  style={{
                    height: "200px",
                    backgroundColor: "#1a2332",
                    color: "#ff6b35",
                  }}
                >
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
              <img
                src={dashboard.thumbnail || "/placeholder.svg"}
                className="card-img-top"
                alt={dashboard.title}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  display: imageLoaded ? "block" : "none",
                }}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div
              className="card-img-top d-flex align-items-center justify-content-center flex-column"
              style={{
                height: "200px",
                backgroundColor: "#1a2332",
                color: "#ff6b35",
              }}
            >
              <div style={{ fontSize: "48px" }}>📊</div>
              <div>Vista previa no disponible</div>
            </div>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: dashboard.category === "Soporte TI" ? "#28a745" : "#ff6b35",
              }}
            >
              {dashboard.category}
            </span>
            <small className="text-white">{dashboard.lastUpdated}</small>
          </div>
          <h5 className="card-title text-white">{dashboard.title}</h5>
          <p className="card-text text-light flex-grow-1">{dashboard.description}</p>
          <button className="btn mt-auto" style={{ backgroundColor: "#4a90e2", color: "white" }}>
            Ver Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

interface DashboardGalleryProps {
  dashboards: Dashboard[]
  openModal: (dashboard: Dashboard) => void
}

function DashboardGallery({ dashboards, openModal }: DashboardGalleryProps) {
  return (
    <div className="container my-5">
      <div className="row g-4">
        {dashboards.map((dashboard) => (
          <DashboardCard key={dashboard.id} dashboard={dashboard} onClick={openModal} />
        ))}
      </div>
    </div>
  )
}

interface DashboardModalProps {
  dashboard: Dashboard
  closeModal: () => void
}

function DashboardModal({ dashboard, closeModal }: DashboardModalProps) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }} onClick={closeModal}>
      <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ backgroundColor: "#2a3441" }}>
          <div className="modal-header">
            <h5 className="modal-title text-white">{dashboard.title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
          </div>
          <div className="modal-body p-0">
            <div className="ratio ratio-16x9">
              <iframe
                src={dashboard.embedUrl}
                frameBorder="0"
                allowFullScreen={true}
                title={dashboard.title}
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            </div>
          </div>
          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100 align-items-center">
              <div>
                <span className="badge me-2" style={{ backgroundColor: "#ff6b35" }}>
                  {dashboard.category}
                </span>
                <small className="text-white">Última actualización: {dashboard.lastUpdated}</small>
              </div>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-5 py-4" style={{ backgroundColor: "#0f1419" }}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-white">
              © 2025 Ing. Rafael Rojas, Orlando Bertel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null)

  const filteredDashboards =
    selectedCategory === "Todos"
      ? dashboards
      : dashboards.filter((d) => d.category === selectedCategory)

  return (
    <div
      style={{
        backgroundImage: `url(${fondonarnaja})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        fontFamily: "'Roboto', sans-serif",
        display: "flex",
        flexDirection: "column",

      }}
    >
      <Navbar />
      <Hero />
      <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <DashboardGallery dashboards={filteredDashboards} openModal={setSelectedDashboard} />
      {selectedDashboard && (
        <DashboardModal dashboard={selectedDashboard} closeModal={() => setSelectedDashboard(null)} />
      )}
      <Footer />
    </div>
  )
}
