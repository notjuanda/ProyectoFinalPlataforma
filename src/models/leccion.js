const pool = require('../data/db');

const getAllLecciones = async () => {
    const res = await pool.query('SELECT * FROM Leccion ORDER BY orden');
    return res.rows;
};

const getLeccionById = async (id) => {
    const res = await pool.query('SELECT * FROM Leccion WHERE id = $1', [id]);
    return res.rows[0];
};

const createLeccion = async (leccion) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id, orden } = leccion;
    const res = await pool.query(
        'INSERT INTO Leccion (nombre, descripcion, tipoContenido, contenido, curso_id, orden) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre, descripcion, tipoContenido, contenido, curso_id, orden]
    );
    return res.rows[0];
};

const updateLeccion = async (id, leccion) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id, orden } = leccion;
    const res = await pool.query(
        'UPDATE Leccion SET nombre = $1, descripcion = $2, tipoContenido = $3, contenido = $4, curso_id = $5, orden = $6 WHERE id = $7 RETURNING *',
        [nombre, descripcion, tipoContenido, contenido, curso_id, orden, id]
    );
    return res.rows[0];
};

const deleteLeccion = async (id) => {
    await pool.query('DELETE FROM Leccion WHERE id = $1', [id]);
    return { message: 'Lección eliminada' };
};

const getLeccionesByCursoId = async (cursoId) => {
    const res = await pool.query('SELECT * FROM Leccion WHERE curso_id = $1 ORDER BY orden', [cursoId]);
    return res.rows;
};

module.exports = {
    getAllLecciones,
    getLeccionById,
    createLeccion,
    updateLeccion,
    deleteLeccion,
    getLeccionesByCursoId
};
