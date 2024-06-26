const pool = require('../data/db');

const getAllProgresos = async () => {
    const res = await pool.query('SELECT * FROM Progresion');
    return res.rows;
};

const getProgresoById = async (id) => {
    const res = await pool.query('SELECT * FROM Progresion WHERE id = $1', [id]);
    return res.rows[0];
};

const createProgreso = async (progreso) => {
    const { usuario_id, leccion_id, estado } = progreso;

    // Verificar si ya existe un progreso para este usuario y lección
    const existingProgreso = await getProgresoByUserAndLeccion(usuario_id, leccion_id);
    if (existingProgreso) {
        console.log(`Progreso ya existente para usuario_id: ${usuario_id}, leccion_id: ${leccion_id}`);
        return existingProgreso;
    }

    console.log(`Intentando crear progreso para usuario_id: ${usuario_id}, leccion_id: ${leccion_id}`);
    const res = await pool.query(
        'INSERT INTO Progresion (usuario_id, leccion_id, estado) VALUES ($1, $2, $3) RETURNING *',
        [usuario_id, leccion_id, estado]
    );
    console.log(`Progreso creado:`, res.rows[0]);
    return res.rows[0];
};

const updateProgreso = async (id, progreso) => {
    const { usuario_id, leccion_id, estado } = progreso;
    const res = await pool.query(
        'UPDATE Progresion SET usuario_id = $1, leccion_id = $2, estado = $3 WHERE id = $4 RETURNING *',
        [usuario_id, leccion_id, estado, id]
    );
    return res.rows[0];
};

const deleteProgreso = async (id) => {
    await pool.query('DELETE FROM Progresion WHERE id = $1', [id]);
    return { message: 'Progreso eliminado' };
};

const getProgressByUserId = async (usuarioId) => {
    const res = await pool.query(
        `SELECT 
            Curso.id AS curso_id,
            Curso.nombreCurso AS nombre_curso,
            Leccion.id AS leccion_id,
            Leccion.nombre AS nombre_leccion,
            Leccion.descripcion AS descripcion_leccion,
            Leccion.tipoContenido AS tipo_contenido,
            Progresion.estado AS estado_progreso
        FROM 
            Progresion
        JOIN 
            Leccion ON Progresion.leccion_id = Leccion.id
        JOIN 
            Curso ON Leccion.curso_id = Curso.id
        JOIN 
            Inscripcion ON Curso.id = Inscripcion.curso_id
        JOIN 
            Usuario ON Inscripcion.idEstudiante = Usuario.id
        WHERE 
            Usuario.id = $1`,
        [usuarioId]
    );
    return res.rows;
};

const getProgressByCourse = async (usuarioId, cursoId) => {
    const totalLeccionesRes = await pool.query(
        `SELECT COUNT(*) AS total
         FROM Leccion
         WHERE curso_id = $1`,
        [cursoId]
    );

    const leccionesVistasRes = await pool.query(
        `SELECT COUNT(*) AS vistas
         FROM Progresion
         JOIN Leccion ON Progresion.leccion_id = Leccion.id
         WHERE Progresion.usuario_id = $1 AND Leccion.curso_id = $2 AND Progresion.estado = 'Visto'`,
        [usuarioId, cursoId]
    );

    const totalLecciones = totalLeccionesRes.rows[0].total;
    const leccionesVistas = leccionesVistasRes.rows[0].vistas;

    if (totalLecciones === 0) {
        return { cursoId, progreso: 0 };
    }

    const progreso = (leccionesVistas / totalLecciones) * 100;

    return { cursoId, progreso };
};

const getProgresoByUserAndLeccion = async (usuario_id, leccion_id) => {
    const res = await pool.query(
        'SELECT * FROM Progresion WHERE usuario_id = $1 AND leccion_id = $2',
        [usuario_id, leccion_id]
    );
    console.log(`Resultado de la consulta para progreso usuario_id: ${usuario_id}, leccion_id: ${leccion_id}`, res.rows[0]);
    return res.rows[0];
};

module.exports = {
    getAllProgresos,
    getProgresoById,
    createProgreso,
    updateProgreso,
    deleteProgreso,
    getProgressByUserId,
    getProgressByCourse,
    getProgresoByUserAndLeccion
};

