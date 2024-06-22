const pool = require('../data/db');

const getAllInscripciones = async () => {
    const res = await pool.query('SELECT * FROM Inscripcion');
    return res.rows;
};

const getInscripcionById = async (id) => {
    const res = await pool.query('SELECT * FROM Inscripcion WHERE id = $1', [id]);
    return res.rows[0];
};

const createInscripcion = async (inscripcion) => {
    const { idEstudiante, curso_id } = inscripcion;
    const res = await pool.query(
        'INSERT INTO Inscripcion (idEstudiante, curso_id) VALUES ($1, $2) RETURNING *',
        [idEstudiante, curso_id]
    );
    return res.rows[0];
};

const updateInscripcion = async (id, inscripcion) => {
    const { idEstudiante, curso_id } = inscripcion;
    const res = await pool.query(
        'UPDATE Inscripcion SET idEstudiante = $1, curso_id = $2 WHERE id = $3 RETURNING *',
        [idEstudiante, curso_id, id]
    );
    return res.rows[0];
};

const deleteInscripcion = async (id) => {
    await pool.query('DELETE FROM Inscripcion WHERE id = $1', [id]);
    return { message: 'Inscripción eliminada' };
};

const getCursosByEstudianteId = async (idEstudiante) => {
    const res = await pool.query(
        `SELECT c.id, c.nombreCurso, c.descripcion, c.imagenCurso 
         FROM Inscripcion i
         JOIN Curso c ON i.curso_id = c.id
         WHERE i.idEstudiante = $1`,
        [idEstudiante]
    );
    return res.rows;
};

const getInscripcionByEstudianteAndCurso = async (idEstudiante, curso_id) => {
    const res = await pool.query(
        'SELECT * FROM Inscripcion WHERE idEstudiante = $1 AND curso_id = $2',
        [idEstudiante, curso_id]
    );
    return res.rows[0];
};

module.exports = {
    getAllInscripciones,
    getInscripcionById,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getCursosByEstudianteId,
    getInscripcionByEstudianteAndCurso
};
