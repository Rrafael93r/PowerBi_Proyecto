import router from '@adonisjs/core/services/router'
import RolesController from '../app/controllers/roles_controller.js'
import AuthController from '#controllers/auth_controller'
import UsuarioController from '../app/controllers/usuarios_controller.js'


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


