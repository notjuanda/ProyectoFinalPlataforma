/**
 * Importación de módulos necesarios
 */
const { Router } = require('express'); // Importa el módulo Router de Express
const inscripcionController = require('../controllers/inscripcionController'); // Importa el controlador de inscripción

/**
 * Creación de una instancia de Router
 */
const router = Router(); // Crea una nueva instancia de Router

/**
 * Rutas de Inscripción
 */

// Ruta para obtener todas las inscripciones
// Método: GET
// URL: /
// Controlador: inscripcionController.getInscripciones
router.get('/', inscripcionController.getInscripciones);

// Ruta para obtener una inscripción específica por ID
// Método: GET
// URL: /:id
// Controlador: inscripcionController.getInscripcion
router.get('/:id', inscripcionController.getInscripcion);

// Ruta para crear una nueva inscripción
// Método: POST
// URL: /
// Controlador: inscripcionController.createInscripcion
router.post('/', inscripcionController.createInscripcion);

// Ruta para actualizar una inscripción existente por ID
// Método: PUT
// URL: /:id
// Controlador: inscripcionController.updateInscripcion
router.put('/:id', inscripcionController.updateInscripcion);

// Ruta para eliminar una inscripción por ID
// Método: DELETE
// URL: /:id
// Controlador: inscripcionController.deleteInscripcion
router.delete('/:id', inscripcionController.deleteInscripcion);

// Ruta para obtener todos los cursos de un estudiante específico por ID de estudiante
// Método: GET
// URL: /estudiante/:idEstudiante
// Controlador: inscripcionController.getCursosByEstudiante
router.get('/estudiante/:idEstudiante', inscripcionController.getCursosByEstudiante);

// Ruta para verificar la inscripción de un usuario en un curso específico por ID de usuario y ID de curso
// Método: GET
// URL: /check-enrollment/:userId/:courseId
// Controlador: inscripcionController.checkEnrollment
router.get('/check-enrollment/:userId/:courseId', inscripcionController.checkEnrollment);

/**
 * Exportación del router
 */
module.exports = router; // Exporta el router para su uso en otros módulos
