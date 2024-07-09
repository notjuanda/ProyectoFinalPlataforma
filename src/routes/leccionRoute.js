/**
 * Importación de módulos necesarios
 */
const { Router } = require('express'); // Importa el módulo Router de Express
const leccionController = require('../controllers/leccionController'); // Importa el controlador de lección

/**
 * Creación de una instancia de Router
 */
const router = Router(); // Crea una nueva instancia de Router

/**
 * Rutas de Lección
 */

// Ruta para obtener todas las lecciones
// Método: GET
// URL: /
// Controlador: leccionController.getLecciones
router.get('/', leccionController.getLecciones);

// Ruta para obtener una lección específica por ID
// Método: GET
// URL: /:id
// Controlador: leccionController.getLeccion
router.get('/:id', leccionController.getLeccion);

// Ruta para crear una nueva lección
// Método: POST
// URL: /
// Controlador: leccionController.createLeccion
router.post('/', leccionController.createLeccion);

// Ruta para actualizar una lección existente por ID
// Método: PUT
// URL: /:id
// Controlador: leccionController.updateLeccion
router.put('/:id', leccionController.updateLeccion);

// Ruta para eliminar una lección por ID
// Método: DELETE
// URL: /:id
// Controlador: leccionController.deleteLeccion
router.delete('/:id', leccionController.deleteLeccion);

/**
 * Exportación del router
 */
module.exports = router; // Exporta el router para su uso en otros módulos
