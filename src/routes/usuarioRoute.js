/**
 * Importación de módulos necesarios
 */
const { Router } = require('express'); // Importa el módulo Router de Express
const usuarioController = require('../controllers/usuarioController'); // Importa el controlador de usuario

/**
 * Creación de una instancia de Router
 */
const router = Router(); // Crea una nueva instancia de Router

/**
 * Rutas de Usuario
 */

// Ruta para el inicio de sesión del usuario
// Método: POST
// URL: /login
// Controlador: usuarioController.loginUsuario
router.post('/login', usuarioController.loginUsuario);

// Ruta para obtener todos los usuarios
// Método: GET
// URL: /
// Controlador: usuarioController.getUsuarios
router.get('/', usuarioController.getUsuarios);

// Ruta para obtener un usuario específico por ID
// Método: GET
// URL: /:id
// Controlador: usuarioController.getUsuario
router.get('/:id', usuarioController.getUsuario);

// Ruta para crear un nuevo usuario
// Método: POST
// URL: /
// Controlador: usuarioController.createUsuario
router.post('/', usuarioController.createUsuario);

// Ruta para actualizar un usuario existente por ID
// Método: PUT
// URL: /:id
// Controlador: usuarioController.updateUsuario
router.put('/:id', usuarioController.updateUsuario);

// Ruta para eliminar un usuario por ID
// Método: DELETE
// URL: /:id
// Controlador: usuarioController.deleteUsuario
router.delete('/:id', usuarioController.deleteUsuario);

// Ruta para cerrar sesión del usuario
// Método: POST
// URL: /logout
// Controlador: usuarioController.logoutUsuario
router.post('/logout', usuarioController.logoutUsuario);

// Ruta para obtener cursos asociados a un usuario por ID
// Método: GET
// URL: /:id/cursos
// Controlador: usuarioController.getCursosByUsuario
router.get('/:id/cursos', usuarioController.getCursosByUsuario);

/**
 * Exportación del router
 */
module.exports = router; // Exporta el router para su uso en otros módulos
