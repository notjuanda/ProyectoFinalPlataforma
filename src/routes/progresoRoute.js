const { Router } = require('express');
const progresoController = require('../controllers/progresoController');

const router = Router();

router.get('/', progresoController.getProgresos);
router.get('/:id', progresoController.getProgreso);
router.post('/', progresoController.createProgreso);
router.put('/:id', progresoController.updateProgreso);
router.delete('/:id', progresoController.deleteProgreso);

module.exports = router;
