import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import RolesController from '../app/controllers/roles_controller.js'
import AuthController from '#controllers/auth_controller'
import UsuarioController from '../app/controllers/usuarios_controller.js'
import EstadosController from '../app/controllers/estados_controller.js'
import AreasController from '../app/controllers/areas_controller.js'
import DashboardsController from '#controllers/dashboards_controller'


// === GRUPO PROTEGIDO POR API KEY ===
router.group(() => {

    // Rutas usuarios
    router.get('/usuarios', [UsuarioController, 'index'])
    router.post('/usuarios', [UsuarioController, 'store'])
    router.get('/usuarios/:id', [UsuarioController, 'show'])
    router.put('/usuarios/:id', [UsuarioController, 'update'])

    // Rutas de autenticación
    router.post('/login', [AuthController, 'login'])

    // Rutas Roles
    router.get('/roles', [RolesController, 'index'])
    router.post('/roles', [RolesController, 'store'])
    router.get('/roles/:id', [RolesController, 'show'])
    router.put('/roles/:id', [RolesController, 'update'])

    // Rutas Areas
    router.get('/areas', [AreasController, 'index'])
    router.post('/areas', [AreasController, 'store'])
    router.get('/areas/:id', [AreasController, 'show'])
    router.put('/areas/:id', [AreasController, 'update'])

    // Rutas Estados
    router.get('/estados', [EstadosController, 'index'])
    router.post('/estados', [EstadosController, 'store'])
    router.get('/estados/:id', [EstadosController, 'show'])
    router.put('/estados/:id', [EstadosController, 'update'])

    // Rutas Dashboards (Protegidas por Auth + API Key heredada)
    router.group(() => {
        router.get('/dashboards', [DashboardsController, 'index'])
        router.post('/dashboards', [DashboardsController, 'store'])
        router.put('/dashboards/:id', [DashboardsController, 'update'])
        router.delete('/dashboards/:id', [DashboardsController, 'destroy'])
    }).use(middleware.auth())

}).use(middleware.api_key())


// === RUTAS PUBLICAS (Proxy SFTP para imagenes) ===
router.get('/dashboards/image/:filename', [DashboardsController, 'getImage'])



