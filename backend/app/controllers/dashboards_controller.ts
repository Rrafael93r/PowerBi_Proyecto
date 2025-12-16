import type { HttpContext } from '@adonisjs/core/http'
import Dashboard from '#models/dashboard'
import SftpService from '#services/sftp_service'
import Usuario from '#models/usuario'

export default class DashboardsController {

    public async index({ request, response }: HttpContext) {
        const areaId = request.input('area_id')

        let query = Dashboard.query().preload('area').preload('estado')

        if (areaId) {
            query = query.where('area_id', areaId)
        }

        const dashboards = await query
        return response.ok(dashboards)
    }

    public async store({ request, auth, response }: HttpContext) {
        const user = auth.user
        if (!user) return response.unauthorized('Usuario no autenticado')

        // Re-fetch user with relations to be sure
        const currentUser = await Usuario.query()
            .where('id', user.id)
            .preload('role')
            .preload('areaPrincipal')
            .first()

        if (!currentUser) return response.unauthorized('Usuario no encontrado')

        const data = request.only(['title', 'description', 'url', 'area_id', 'estado_id'])
        const thumbnailFile = request.file('thumbnail', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp']
        })

        // === VALIDATION LOGIC ===
        const isCreator = currentUser.role.name.toLowerCase() === 'creador'
        const isAdmin = currentUser.role.name.toLowerCase() === 'administrador'

        if (isCreator) {
            // Creators can ONLY create in their Principal Area
            if (!currentUser.areaPrincipalId) {
                return response.badRequest('El usuario creador no tiene un área principal asignada.')
            }

            if (Number(data.area_id) !== currentUser.areaPrincipalId) {
                return response.forbidden('Los creadores solo pueden crear dashboards en su área principal.')
            }
        } else if (!isAdmin) {
            // If not admin and not creator (e.g. Visor), cannot create
            return response.forbidden('No tiene permisos para crear dashboards.')
        }

        // === SFTP UPLOAD ===
        let thumbnailUrl = ''
        if (thumbnailFile) {
            if (!thumbnailFile.isValid) {
                return response.badRequest(thumbnailFile.errors)
            }

            try {
                const sftp = new SftpService()
                // returns filename like "123123_image.jpg"
                const fileName = await sftp.upload(thumbnailFile)
                // Construct full URL if accessible via HTTP, or just store the filename/path
                // If the SFTP server is mapped to a web URL, we might need to prepend it. 
                // For now storing the relative path/filename as requested by logic usually.
                // If the user wants to serve it back, we might need a getter.
                // Assuming we store what sftp returns.
                thumbnailUrl = fileName
            } catch (error) {
                return response.internalServerError({ message: 'Error subiendo imagen SFTP', error: error.message })
            }
        }

        // === CREATE RECORD ===
        const dashboard = await Dashboard.create({
            title: data.title,
            description: data.description,
            url: data.url,
            areaId: data.area_id,
            estadoId: data.estado_id || 1, // Default active
            thumbnail: thumbnailUrl
        })

        return response.created(dashboard)
    }

    public async update({ params, request, response }: HttpContext) {
        const dashboard = await Dashboard.find(params.id)
        if (!dashboard) return response.notFound('Dashboard no encontrado')

        const data = request.only(['title', 'description', 'url', 'area_id', 'estado_id'])

        // Optional: SFTP Update (if new file provided)
        const thumbnailFile = request.file('thumbnail', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp']
        })

        if (thumbnailFile && thumbnailFile.isValid) {
            const sftp = new SftpService()
            const fileName = await sftp.upload(thumbnailFile)
            dashboard.thumbnail = fileName
        }

        dashboard.merge(data)
        await dashboard.save()

        return response.ok(dashboard)
    }

    public async destroy({ params, response }: HttpContext) {
        const dashboard = await Dashboard.find(params.id)
        if (!dashboard) return response.notFound('Dashboard no encontrado')
        await dashboard.delete()
        return response.ok({ message: 'Dashboard eliminado' })
    }

    public async getImage({ params, response }: HttpContext) {
        const filename = params.filename
        if (!filename) return response.badRequest('Nombre de archivo requerido')

        try {
            const sftp = new SftpService()
            const fileBuffer = await sftp.getFile(filename)

            // Determine content type extension
            const ext = filename.split('.').pop()?.toLowerCase()
            let contentType = 'image/jpeg'
            if (ext === 'png') contentType = 'image/png'
            if (ext === 'webp') contentType = 'image/webp'

            response.header('Content-Type', contentType)
            return response.send(fileBuffer)
        } catch (error) {
            return response.notFound('Imagen no encontrada')
        }
    }
}