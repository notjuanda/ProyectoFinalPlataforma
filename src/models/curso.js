const pool = require('../data/db');

const getAllCursos = async () => {
    const res = await pool.query('SELECT * FROM Curso');
    return res.rows;
};

const getCursoById = async (id) => {
    const res = await pool.query('SELECT * FROM Curso WHERE id = $1', [id]);
    return res.rows[0];
};

const createCurso = async (curso) => {
    const { nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id } = curso;
    const res = await pool.query(
        'INSERT INTO Curso (nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id]
    );
    return res.rows[0];
};

const updateCurso = async (id, curso) => {
    const { nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id } = curso;
    const res = await pool.query(
        'UPDATE Curso SET nombreCurso = $1, descripcion = $2, imagenCurso = $3, bannerCurso = $4, categoria_id = $5, usuario_id = $6 WHERE id = $7 RETURNING *',
        [nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id, id]
    );
    return res.rows[0];
};

const deleteCurso = async (id) => {
    await pool.query('DELETE FROM Curso WHERE id = $1', [id]);
    return { message: 'Curso eliminado' };
};

const getCursoConLecciones = async (id) => {
    const cursoRes = await pool.query('SELECT * FROM Curso WHERE id = $1', [id]);
    if (cursoRes.rows.length === 0) {
        return null;
    }

    const curso = cursoRes.rows[0];
    const leccionesRes = await pool.query('SELECT * FROM Leccion WHERE curso_id = $1', [id]);
    curso.lecciones = leccionesRes.rows;
    
    return curso;
};

module.exports = {
    getAllCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
    getCursoConLecciones
};
