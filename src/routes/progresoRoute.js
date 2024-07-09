/**
 * Importación de módulos necesarios
 */
const { Router } = require('express'); // Importa el módulo Router de Express
const progresoController = require('../controllers/progresoController'); // Importa el controlador de progreso

/**
 * Creación de una instancia de Router
 */
const router = Router(); // Crea una nueva instancia de Router

/**
 * Rutas de Progreso
 */

// Ruta para obtener todos los progresos
// Método: GET
// URL: /
// Controlador: progresoController.getProgresos
router.get('/', progresoController.getProgresos);

// Ruta para obtener un progreso específico por ID
// Método: GET
// URL: /:id
// Controlador: progresoController.getProgreso
router.get('/:id', progresoController.getProgreso);

// Ruta para crear un nuevo progreso
// Método: POST
// URL: /
// Controlador: progresoController.createProgreso
router.post('/', progresoController.createProgreso);

// Ruta para actualizar un progreso existente por ID
// Método: PUT
// URL: /:id
// Controlador: progresoController.updateProgreso
router.put('/:id', progresoController.updateProgreso);

// Ruta para eliminar un progreso por ID
// Método: DELETE
// URL: /:id
// Controlador: progresoController.deleteProgreso
router.delete('/:id', progresoController.deleteProgreso);

// Ruta para obtener el progreso de un usuario específico
// Método: GET
// URL: /usuario/:id/progreso
// Controlador: progresoController.getProgressByUser
router.get('/usuario/:id/progreso', progresoController.getProgressByUser);

// Ruta para obtener el progreso de un usuario en un curso específico
// Método: GET
// URL: /usuario/:usuarioId/curso/:cursoId/progreso
// Controlador: progresoController.getProgressByCourse
router.get('/usuario/:usuarioId/curso/:cursoId/progreso', progresoController.getProgressByCourse);

// Ruta para obtener el progreso de un usuario en una lección específica
// Método: GET
// URL: /user/:userId/lesson/:lessonId
// Controlador: progresoController.getProgresoByUserAndLesson
router.get('/user/:userId/lesson/:lessonId', progresoController.getProgresoByUserAndLesson);

/**
 * Exportación del router
 */
module.exports = router; // Exporta el router para su uso en otros módulos
