/**
 * Importación de módulos necesarios
 */
const { Router } = require('express'); // Importa el módulo Router de Express
const categoriaController = require('../controllers/categoriaController'); // Importa el controlador de categoría

/**
 * Creación de una instancia de Router
 */
const router = Router(); // Crea una nueva instancia de Router

/**
 * Rutas de Categoría
 */

// Ruta para obtener una categoría específica junto con sus cursos por ID de categoría
// Método: GET
// URL: /:id/cursos
// Controlador: categoriaController.getCategoriaConCursos
router.get('/:id/cursos', categoriaController.getCategoriaConCursos);

// Ruta para obtener todas las categorías
// Método: GET
// URL: /
// Controlador: categoriaController.getCategorias
router.get('/', categoriaController.getCategorias);

// Ruta para obtener una categoría específica por ID
// Método: GET
// URL: /:id
// Controlador: categoriaController.getCategoria
router.get('/:id', categoriaController.getCategoria);

// Ruta para crear una nueva categoría
// Método: POST
// URL: /
// Controlador: categoriaController.createCategoria
router.post('/', categoriaController.createCategoria);

// Ruta para actualizar una categoría existente por ID
// Método: PUT
// URL: /:id
// Controlador: categoriaController.updateCategoria
router.put('/:id', categoriaController.updateCategoria);

// Ruta para eliminar una categoría por ID
// Método: DELETE
// URL: /:id
// Controlador: categoriaController.deleteCategoria
router.delete('/:id', categoriaController.deleteCategoria);

/**
 * Exportación del router
 */
module.exports = router; // Exporta el router para su uso en otros módulos
