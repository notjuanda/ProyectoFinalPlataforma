const pool = require('../data/db');

const getAllUsuarios = async () => {
    const res = await pool.query('SELECT * FROM Usuario');
    return res.rows;
};

const getUsuarioById = async (id) => {
    const res = await pool.query('SELECT * FROM Usuario WHERE id = $1', [id]);
    return res.rows[0];
};

const getUsuarioByCorreo = async (correo) => {
    const res = await pool.query('SELECT * FROM Usuario WHERE correo = $1', [correo]);
    return res.rows[0];
};

const createUsuario = async (usuario) => {
    const { nombre, apellido, correo, contrasena, tipoUsuario } = usuario;
    const res = await pool.query(
        `INSERT INTO Usuario (nombre, apellido, correo, contrasena, tipoUsuario) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nombre, apellido, correo, contrasena, tipoUsuario]
    );
    return res.rows[0];
};


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
        [nombre, apellido, correo, contrasena, tipoUsuario, id]
    );
    return res.rows[0];
};

const deleteUsuario = async (id) => {
    await pool.query('DELETE FROM Usuario WHERE id = $1', [id]);
    return { message: 'Usuario eliminado' };
};

const getCursosByUsuarioId = async (usuarioId) => {
    const res = await pool.query(
        `SELECT Curso.id, Curso.nombreCurso, Curso.descripcion, Curso.imagenCurso 
         FROM Inscripcion
         JOIN Curso ON Inscripcion.curso_id = Curso.id
         WHERE Inscripcion.idEstudiante = $1`,
        [usuarioId]
    );
    return res.rows;
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByCorreo,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getCursosByUsuarioId
};
