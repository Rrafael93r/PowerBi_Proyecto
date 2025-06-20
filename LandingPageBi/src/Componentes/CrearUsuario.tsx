"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, Mail, Lock, Shield, Building, Eye, EyeOff, Save, X, UserCheck } from "lucide-react"

// Constantes de colores para mantener consistencia
const COLORS = {
  primary: "#0f1419",
  accent: "#db6600",
  accentLight: "#f58634",
  secondary: "#242d36",
  cardBg: "#2c3842",
  inputBg: "#1a2027",
  inputBorder: "rgba(255, 255, 255, 0.2)",
  inputFocus: "#f58634",
}

// Estilos optimizados para modal
const styles = {
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "0.4rem",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  input: {
    backgroundColor: COLORS.inputBg,
    border: `1px solid ${COLORS.inputBorder}`,
    borderRadius: "6px",
    color: "white",
    padding: "0.6rem 0.8rem",
    fontSize: "13px",
    transition: "all 0.3s ease",
    width: "100%",
  },
  inputFocus: {
    borderColor: COLORS.inputFocus,
    boxShadow: `0 0 0 0.15rem rgba(245, 134, 52, 0.25)`,
    outline: "none",
  },
  select: {
    backgroundColor: COLORS.inputBg,
    border: `1px solid ${COLORS.inputBorder}`,
    borderRadius: "6px",
    color: "white",
    padding: "0.6rem 0.8rem",
    fontSize: "13px",
    transition: "all 0.3s ease",
    width: "100%",
  },
  button: {
    borderRadius: "6px",
    padding: "0.6rem 1rem",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    color: "white",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "white",
    border: `1px solid ${COLORS.inputBorder}`,
  },
  passwordToggle: {
    position: "absolute" as const,
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.6)",
    cursor: "pointer",
    padding: "4px",
  },
  inputGroup: {
    position: "relative" as const,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: "11px",
    marginTop: "0.25rem",
  },
  successText: {
    color: "#51cf66",
    fontSize: "12px",
    textAlign: "center" as const,
    padding: "0.5rem",
    backgroundColor: "rgba(81, 207, 102, 0.1)",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
}

// Interfaces que coinciden con tu backend
interface FormData {
  nombre: string
  segundo_nombre: string
  apellido_1: string
  apellido_2: string
  usuario: string
  correo: string
  contrasena: string
  confirmPassword: string
  roleId: string
  areaId: string
}

interface Role {
  id: number
  name: string
}

interface Area {
  id: number
  name: string
}

interface CrearUsuarioProps {
  onClose?: () => void
}

const CrearUsuario = ({ onClose }: CrearUsuarioProps) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    segundo_nombre: "",
    apellido_1: "",
    apellido_2: "",
    usuario: "",
    correo: "",
    contrasena: "",
    confirmPassword: "",
    roleId: "",
    areaId: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Partial<FormData & { general: string }>>({})
  const [success, setSuccess] = useState("")

  // Estados para datos del backend
  const [roles, setRoles] = useState<Role[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  // URL base de tu API - ajusta según tu configuración
  const API_BASE_URL = "http://localhost:3333"

  // Cargar roles y áreas al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)

        // Cargar roles y áreas en paralelo
        const [rolesResponse, areasResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/roles`),
          fetch(`${API_BASE_URL}/areas`),
        ])

        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json()
          setRoles(rolesData)
        }

        if (areasResponse.ok) {
          const areasData = await areasResponse.json()
          setAreas(areasData)
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error)
        setErrors({ general: "Error cargando datos del servidor" })
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }))
    }

    // Limpiar mensaje de éxito
    if (success) {
      setSuccess("")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.apellido_1.trim()) newErrors.apellido_1 = "El primer apellido es requerido"
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El nombre de usuario es requerido"
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres"
    }
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido"
    }
    if (!formData.contrasena) {
      newErrors.contrasena = "La contraseña es requerida"
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres"
    }
    if (formData.contrasena !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }
    if (!formData.roleId) newErrors.roleId = "El rol es requerido"
    if (!formData.areaId) newErrors.areaId = "El área es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Preparar datos para enviar (sin confirmPassword y con estadoId por defecto)
      const dataToSend = {
        nombre: formData.nombre.trim(),
        segundo_nombre: formData.segundo_nombre.trim() || null,
        apellido_1: formData.apellido_1.trim(),
        apellido_2: formData.apellido_2.trim() || null,
        usuario: formData.usuario.trim(),
        correo: formData.correo.trim(),
        contrasena: formData.contrasena,
        roleId: Number.parseInt(formData.roleId),
        areaId: Number.parseInt(formData.areaId),
        estadoId: 1, // Asumiendo que 1 es "activo" - ajusta según tu base de datos
      }

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        const newUser = await response.json()
        console.log("Usuario creado exitosamente:", newUser)

        setSuccess("Usuario creado exitosamente")

        // Limpiar formulario
        setFormData({
          nombre: "",
          segundo_nombre: "",
          apellido_1: "",
          apellido_2: "",
          usuario: "",
          correo: "",
          contrasena: "",
          confirmPassword: "",
          roleId: "",
          areaId: "",
        })

        // Cerrar modal después de un breve delay para mostrar el mensaje de éxito
        setTimeout(() => {
          if (onClose) {
            onClose()
          }
        }, 1500)
      } else {
        // Manejar errores del servidor
        const errorData = await response.json()

        if (response.status === 422) {
          // Errores de validación
          const validationErrors: Partial<FormData> = {}
          if (errorData.errors) {
            // AdonisJS devuelve errores en formato específico
            errorData.errors.forEach((error: any) => {
              validationErrors[error.field as keyof FormData] = error.message
            })
          }
          setErrors(validationErrors)
        } else {
          setErrors({ general: errorData.message || "Error al crear el usuario" })
        }
      }
    } catch (error) {
      console.error("Error al crear usuario:", error)
      setErrors({ general: "Error de conexión con el servidor" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: "",
      segundo_nombre: "",
      apellido_1: "",
      apellido_2: "",
      usuario: "",
      correo: "",
      contrasena: "",
      confirmPassword: "",
      roleId: "",
      areaId: "",
    })
    setErrors({})
    setSuccess("")

    if (onClose) {
      onClose()
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
        <div className="spinner-border" role="status" aria-hidden="true"></div>
        <p style={{ marginTop: "1rem", fontSize: "14px" }}>Cargando datos...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header del formulario */}
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "13px", margin: 0 }}>
          Complete la información para crear un nuevo usuario
        </p>
      </div>

      {/* Mensaje de éxito */}
      {success && <div style={styles.successText}>{success}</div>}

      {/* Error general */}
      {errors.general && <div style={styles.errorText}>{errors.general}</div>}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          {/* Nombre y Segundo Nombre */}
          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <User size={14} />
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                placeholder="Nombre"
                disabled={isSubmitting}
              />
              {errors.nombre && <div style={styles.errorText}>{errors.nombre}</div>}
            </div>
          </div>

          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <User size={14} />
                Segundo Nombre
              </label>
              <input
                type="text"
                name="segundo_nombre"
                value={formData.segundo_nombre}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                placeholder="Segundo nombre"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Apellidos */}
          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <User size={14} />
                Primer Apellido *
              </label>
              <input
                type="text"
                name="apellido_1"
                value={formData.apellido_1}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                placeholder="Primer apellido"
                disabled={isSubmitting}
              />
              {errors.apellido_1 && <div style={styles.errorText}>{errors.apellido_1}</div>}
            </div>
          </div>

          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <User size={14} />
                Segundo Apellido
              </label>
              <input
                type="text"
                name="apellido_2"
                value={formData.apellido_2}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                placeholder="Segundo apellido"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Usuario */}
          <div className="col-12">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <UserCheck size={14} />
                Nombre de Usuario *
              </label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                placeholder="Nombre de usuario único"
                disabled={isSubmitting}
              />
              {errors.usuario && <div style={styles.errorText}>{errors.usuario}</div>}
            </div>
          </div>

          {/* Email */}
          <div className="col-12">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Mail size={14} />
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                placeholder="usuario@ejemplo.com"
                disabled={isSubmitting}
              />
              {errors.correo && <div style={styles.errorText}>{errors.correo}</div>}
            </div>
          </div>

          {/* Contraseñas */}
          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={14} />
                Contraseña *
              </label>
              <div style={styles.inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.inputBorder
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Contraseña"
                  disabled={isSubmitting}
                />
                <button type="button" style={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.contrasena && <div style={styles.errorText}>{errors.contrasena}</div>}
            </div>
          </div>

          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={14} />
                Confirmar *
              </label>
              <div style={styles.inputGroup}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.inputBorder
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Confirmar"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Rol y Área */}
          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Shield size={14} />
                Rol *
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleInputChange}
                style={styles.select}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                disabled={isSubmitting}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id.toString()}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && <div style={styles.errorText}>{errors.roleId}</div>}
            </div>
          </div>

          <div className="col-6">
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Building size={14} />
                Área *
              </label>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleInputChange}
                style={styles.select}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder
                  e.target.style.boxShadow = "none"
                }}
                disabled={isSubmitting}
              >
                <option value="">Seleccionar área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id.toString()}>
                    {area.name}
                  </option>
                ))}
              </select>
              {errors.areaId && <div style={styles.errorText}>{errors.areaId}</div>}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-end mt-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "transparent"
              }
            }}
          >
            <X size={14} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = COLORS.accentLight
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = COLORS.accent
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                Creando...
              </>
            ) : (
              <>
                <Save size={14} />
                Crear Usuario
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CrearUsuario
