/**
 * Importación de módulos necesarios
 */
const pool = require('../data/db'); // Importa el pool de conexiones a la base de datos

/**
 * Función para obtener todos los usuarios
 * @returns {Promise<Array>} Lista de todos los usuarios
 */
const getAllUsuarios = async () => {
    const res = await pool.query('SELECT * FROM Usuario'); // Consulta para obtener todos los usuarios
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Función para obtener un usuario por su ID
 * @param {number} id - ID del usuario
 * @returns {Promise<Object>} Usuario encontrado
 */
const getUsuarioById = async (id) => {
    const res = await pool.query('SELECT * FROM Usuario WHERE id = $1', [id]); // Consulta para obtener un usuario por ID
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para obtener un usuario por su correo electrónico
 * @param {string} correo - Correo electrónico del usuario
 * @returns {Promise<Object>} Usuario encontrado
 */
const getUsuarioByCorreo = async (correo) => {
    const res = await pool.query('SELECT * FROM Usuario WHERE correo = $1', [correo]); // Consulta para obtener un usuario por correo electrónico
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para crear un nuevo usuario
 * @param {Object} usuario - Datos del usuario a crear
 * @param {string} usuario.nombre - Nombre del usuario
 * @param {string} usuario.apellido - Apellido del usuario
 * @param {string} usuario.correo - Correo electrónico del usuario
 * @param {string} usuario.contrasena - Contraseña del usuario
 * @param {string} usuario.tipoUsuario - Tipo de usuario
 * @returns {Promise<Object>} Usuario creado
 */
const createUsuario = async (usuario) => {
    const { nombre, apellido, correo, contrasena, tipoUsuario } = usuario;
    const res = await pool.query(
        `INSERT INTO Usuario (nombre, apellido, correo, contrasena, tipoUsuario) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nombre, apellido, correo, contrasena, tipoUsuario] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila creada
};

/**
 * Función para actualizar un usuario existente
 * @param {number} id - ID del usuario a actualizar
 * @param {Object} usuario - Datos del usuario a actualizar
 * @param {string} usuario.nombre - Nombre del usuario
 * @param {string} usuario.apellido - Apellido del usuario
 * @param {string} usuario.correo - Correo electrónico del usuario
 * @param {string} usuario.contrasena - Contraseña del usuario
 * @param {string} usuario.tipoUsuario - Tipo de usuario
 * @returns {Promise<Object>} Usuario actualizado
 */
const updateUsuario = async (id, usuario) => {
    const { nombre, apellido, correo, contrasena, tipoUsuario } = usuario;
    const res = await pool.query(
        `UPDATE Usuario SET 
            nombre = $1, 
            apellido = $2, 
            correo = $3, 
            contrasena = crypt($4, gen_salt('bf')), 
            tipoUsuario = $5 
         WHERE id = $6 RETURNING *`,
        [nombre, apellido, correo, contrasena, tipoUsuario, id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila actualizada
};

/**
 * Función para eliminar un usuario
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 */
const deleteUsuario = async (id) => {
    await pool.query('DELETE FROM Usuario WHERE id = $1', [id]); // Consulta para eliminar un usuario por ID
    return { message: 'Usuario eliminado' }; // Devuelve un mensaje de confirmación
};

/**
 * Función para obtener los cursos de un usuario específico por su ID
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<Array>} Lista de cursos del usuario
 */
const getCursosByUsuarioId = async (usuarioId) => {
    const res = await pool.query(
        `SELECT Curso.id, Curso.nombreCurso, Curso.descripcion, Curso.imagenCurso 
         FROM Inscripcion
         JOIN Curso ON Inscripcion.curso_id = Curso.id
         WHERE Inscripcion.idEstudiante = $1`,
        [usuarioId] // Parámetro de la consulta
    );
    return res.rows; // Devuelve todas las filas encontradas
};

/**
 * Exportación de las funciones del módulo
 */
module.exports = {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByCorreo,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getCursosByUsuarioId
};
