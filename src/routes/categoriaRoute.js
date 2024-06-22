const { Router } = require('express');
const categoriaController = require('../controllers/categoriaController');

const router = Router();

router.get('/:id/cursos', categoriaController.getCategoriaConCursos);
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoria);
router.post('/', categoriaController.createCategoria);
router.put('/:id', categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;
