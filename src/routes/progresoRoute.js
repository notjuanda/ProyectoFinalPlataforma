const { Router } = require('express');
const progresoController = require('../controllers/progresoController');

const router = Router();

router.get('/', progresoController.getProgresos);
router.get('/:id', progresoController.getProgreso);
router.post('/', progresoController.createProgreso);
router.put('/:id', progresoController.updateProgreso);
router.delete('/:id', progresoController.deleteProgreso);
router.get('/usuario/:id/progreso', progresoController.getProgressByUser);
router.get('/usuario/:usuarioId/curso/:cursoId/progreso', progresoController.getProgressByCourse);

module.exports = router;
