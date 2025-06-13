import router from '@adonisjs/core/services/router'


// Rutas de los usuarios
import UsuarioController from '../app/controllers/usuarios_controller.js'
router.get('/usuarios', [UsuarioController, 'index'])          
router.post('/usuarios', [UsuarioController, 'store'])         
router.get('/usuarios/:id', [UsuarioController, 'show'])       
router.put('/usuarios/:id', [UsuarioController, 'update'])     
router.delete('/usuarios/:id', [UsuarioController, 'destroy']) 


// Rutas Roles
import RolesController from '../app/controllers/roles_controller.js'
router.get('/roles', [RolesController, 'index'])               
router.post('/roles', [RolesController, 'store'])             
router.get('/roles/:id', [RolesController, 'show'])            
router.put('/roles/:id', [RolesController, 'update'])          
router.delete('/roles/:id', [RolesController, 'destroy'])      

