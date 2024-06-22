const { Router } = require('express');
const leccionController = require('../controllers/leccionController');

const router = Router();

router.get('/', leccionController.getLecciones);
router.get('/:id', leccionController.getLeccion);
router.post('/', leccionController.createLeccion);
router.put('/:id', leccionController.updateLeccion);
router.delete('/:id', leccionController.deleteLeccion);

module.exports = router;
