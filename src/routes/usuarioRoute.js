const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.post('/login', usuarioController.loginUsuario);
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuario);
router.post('/', usuarioController.createUsuario);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);
router.post('/logout', usuarioController.logoutUsuario);
router.get('/:id/cursos', usuarioController.getCursosByUsuario);

module.exports = router;
