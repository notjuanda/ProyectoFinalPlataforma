const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuario');

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsuario = async (req, res) => {
    try {
        const usuario = await usuarioModel.getUsuarioById(req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUsuario = async (req, res) => {
    const { nombre, apellido, correo, contrasena, tipoUsuario } = req.body;

    // Validar longitud de la contraseña
    if (contrasena.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        // Verificar si el correo ya está registrado
        const existingUsuario = await usuarioModel.getUsuarioByCorreo(correo);
        if (existingUsuario) {
            return res.status(400).json({ message: 'Este correo ya está registrado. Por favor, ingresa con otro.' });
        }

        console.log('Contraseña sin encriptar:', contrasena); // Mostrar la contraseña en la consola

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const newUsuario = await usuarioModel.createUsuario({ nombre, apellido, correo, contrasena: hashedPassword, tipoUsuario });

        res.status(201).json(newUsuario);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const updatedUsuario = await usuarioModel.updateUsuario(req.params.id, req.body);
        if (updatedUsuario) {
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const result = await usuarioModel.deleteUsuario(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUsuario = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await usuarioModel.getUsuarioByCorreo(correo);
        if (!usuario) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isMatch) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        console.log('Inicio de sesión exitoso para el usuario:', correo);
        res.cookie('userRegistered', 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true });
        res.status(200).json({ message: 'Inicio de sesión exitoso.', usuario: { id: usuario.id, nombre: usuario.nombre, tipoUsuario: usuario.tipousuario} });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: error.message });
    }
};

const logoutUsuario = async (req, res) => {
    try {
        res.clearCookie('userRegistered', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(200).json({ message: 'Cierre de sesión exitoso.' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ error: error.message });
    }
};

const getCursosByUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const cursos = await usuarioModel.getCursosByUsuarioId(usuarioId);
        res.json(cursos);
    } catch (error) {
        console.error('Error al obtener cursos por usuario:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario,
    logoutUsuario,
    getCursosByUsuario
};
