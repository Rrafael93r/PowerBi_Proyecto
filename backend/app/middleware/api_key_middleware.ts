import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class ApiKeyMiddleware {
    async handle({ request, response }: HttpContext, next: () => Promise<void>) {
        const apiKey = request.header('x-api-key')
        const expectedKey = process.env.API_KEY || 'default_secure_key_12345'

        // Allow public access to images (if we haven't already separated them in routes)
        // Actually, routes structure handles what middleware applies to what.
        // If applied globally, we might need exceptions. 
        // If applied per route group, we are fine.

        // Check key
        if (!apiKey || apiKey !== expectedKey) {
            return response.unauthorized({ message: 'API Key inválida o ausente' })
        }

        await next()
    }
}
