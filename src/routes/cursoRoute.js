const { Router } = require('express');
const cursoController = require('../controllers/cursoController');

const router = Router();

router.get('/:id/lecciones', cursoController.getCursoConLecciones);
router.get('/', cursoController.getCursos);
router.get('/:id', cursoController.getCurso);
router.post('/', cursoController.createCurso);
router.put('/:id', cursoController.updateCurso);
router.delete('/:id', cursoController.deleteCurso);

module.exports = router;
