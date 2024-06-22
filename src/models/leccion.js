const pool = require('../data/db');

const getAllLecciones = async () => {
    const res = await pool.query('SELECT * FROM Leccion');
    return res.rows;
};

const getLeccionById = async (id) => {
    const res = await pool.query('SELECT * FROM Leccion WHERE id = $1', [id]);
    return res.rows[0];
};

const createLeccion = async (leccion) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id } = leccion;
    const res = await pool.query(
        'INSERT INTO Leccion (nombre, descripcion, tipoContenido, contenido, curso_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, descripcion, tipoContenido, contenido, curso_id]
    );
    return res.rows[0];
};

const updateLeccion = async (id, leccion) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id } = leccion;
    const res = await pool.query(
        'UPDATE Leccion SET nombre = $1, descripcion = $2, tipoContenido = $3, contenido = $4, curso_id = $5 WHERE id = $6 RETURNING *',
        [nombre, descripcion, tipoContenido, contenido, curso_id, id]
    );
    return res.rows[0];
};

const deleteLeccion = async (id) => {
    await pool.query('DELETE FROM Leccion WHERE id = $1', [id]);
    return { message: 'Lección eliminada' };
};

module.exports = {
    getAllLecciones,
    getLeccionById,
    createLeccion,
    updateLeccion,
    deleteLeccion,
};
