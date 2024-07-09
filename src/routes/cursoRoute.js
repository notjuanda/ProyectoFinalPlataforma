/**
 * Importación de módulos necesarios
 */
const { Router } = require('express'); // Importa el módulo Router de Express
const cursoController = require('../controllers/cursoController'); // Importa el controlador de curso

/**
 * Creación de una instancia de Router
 */
const router = Router(); // Crea una nueva instancia de Router

/**
 * Rutas de Curso
 */

// Ruta para buscar cursos basados en criterios de búsqueda
// Método: GET
// URL: /search
// Controlador: cursoController.searchCursos
router.get('/search', cursoController.searchCursos);

// Ruta para obtener un curso específico junto con sus lecciones por ID de curso
// Método: GET
// URL: /:id/lecciones
// Controlador: cursoController.getCursoConLecciones
router.get('/:id/lecciones', cursoController.getCursoConLecciones);

// Ruta para obtener todos los cursos
// Método: GET
// URL: /
// Controlador: cursoController.getCursos
router.get('/', cursoController.getCursos);

// Ruta para obtener un curso específico por ID
// Método: GET
// URL: /:id
// Controlador: cursoController.getCurso
router.get('/:id', cursoController.getCurso);

// Ruta para crear un nuevo curso
// Método: POST
// URL: /
// Controlador: cursoController.createCurso
router.post('/', cursoController.createCurso);

// Ruta para actualizar un curso existente por ID
// Método: PUT
// URL: /:id
// Controlador: cursoController.updateCurso
router.put('/:id', cursoController.updateCurso);

// Ruta para eliminar un curso por ID
// Método: DELETE
// URL: /:id
// Controlador: cursoController.deleteCurso
router.delete('/:id', cursoController.deleteCurso);

/**
 * Exportación del router
 */
module.exports = router; // Exporta el router para su uso en otros módulos
