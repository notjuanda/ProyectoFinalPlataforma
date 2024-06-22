const { Router } = require('express');
const inscripcionController = require('../controllers/inscripcionController');

const router = Router();

router.get('/', inscripcionController.getInscripciones);
router.get('/:id', inscripcionController.getInscripcion);
router.post('/', inscripcionController.createInscripcion);
router.put('/:id', inscripcionController.updateInscripcion);
router.delete('/:id', inscripcionController.deleteInscripcion);
router.get('/estudiante/:idEstudiante', inscripcionController.getCursosByEstudiante);

module.exports = router;
