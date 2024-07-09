/**
 * Importación de módulos necesarios
 */
const pool = require('../data/db'); // Importa el pool de conexiones a la base de datos

/**
 * Función para obtener todos los progresos
 * @returns {Promise<Array>} Lista de todos los progresos
 */
const getAllProgresos = async () => {
    const res = await pool.query('SELECT * FROM Progresion'); // Consulta para obtener todos los progresos
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Función para obtener un progreso por su ID
 * @param {number} id - ID del progreso
 * @returns {Promise<Object>} Progreso encontrado
 */
const getProgresoById = async (id) => {
    const res = await pool.query('SELECT * FROM Progresion WHERE id = $1', [id]); // Consulta para obtener un progreso por ID
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para crear un nuevo progreso
 * @param {Object} progreso - Datos del progreso a crear
 * @param {number} progreso.usuario_id - ID del usuario
 * @param {number} progreso.leccion_id - ID de la lección
 * @param {string} progreso.estado - Estado del progreso
 * @returns {Promise<Object>} Progreso creado
 */
const createProgreso = async (progreso) => {
    const { usuario_id, leccion_id, estado } = progreso;

    // Verificar si ya existe un progreso para este usuario y lección
    const existingProgreso = await getProgresoByUserAndLeccion(usuario_id, leccion_id);
    if (existingProgreso) {
        console.log(`Progreso ya existente para usuario_id: ${usuario_id}, leccion_id: ${leccion_id}`);
        return existingProgreso; // Devuelve el progreso existente
    }

    console.log(`Intentando crear progreso para usuario_id: ${usuario_id}, leccion_id: ${leccion_id}`);
    const res = await pool.query(
        'INSERT INTO Progresion (usuario_id, leccion_id, estado) VALUES ($1, $2, $3) RETURNING *',
        [usuario_id, leccion_id, estado] // Parámetros de la consulta
    );
    console.log(`Progreso creado:`, res.rows[0]);
    return res.rows[0]; // Devuelve la fila creada
};

/**
 * Función para actualizar un progreso existente
 * @param {number} id - ID del progreso a actualizar
 * @param {Object} progreso - Datos del progreso a actualizar
 * @param {number} progreso.usuario_id - ID del usuario
 * @param {number} progreso.leccion_id - ID de la lección
 * @param {string} progreso.estado - Estado del progreso
 * @returns {Promise<Object>} Progreso actualizado
 */
const updateProgreso = async (id, progreso) => {
    const { usuario_id, leccion_id, estado } = progreso;
    const res = await pool.query(
        'UPDATE Progresion SET usuario_id = $1, leccion_id = $2, estado = $3 WHERE id = $4 RETURNING *',
        [usuario_id, leccion_id, estado, id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila actualizada
};

/**
 * Función para eliminar un progreso
 * @param {number} id - ID del progreso a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 */
const deleteProgreso = async (id) => {
    await pool.query('DELETE FROM Progresion WHERE id = $1', [id]); // Consulta para eliminar un progreso por ID
    return { message: 'Progreso eliminado' }; // Devuelve un mensaje de confirmación
};

/**
 * Función para obtener el progreso de un usuario específico por su ID
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<Array>} Lista de progresos del usuario
 */
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
        [usuarioId] // Parámetro de la consulta
    );
    return res.rows; // Devuelve todas las filas encontradas
};

/**
 * Función para obtener el progreso de un usuario en un curso específico
 * @param {number} usuarioId - ID del usuario
 * @param {number} cursoId - ID del curso
 * @returns {Promise<Object>} Progreso del usuario en el curso
 */
const getProgressByCourse = async (usuarioId, cursoId) => {
    const totalLeccionesRes = await pool.query(
        `SELECT COUNT(*) AS total
         FROM Leccion
         WHERE curso_id = $1`,
        [cursoId] // Parámetro de la consulta
    );

    const leccionesVistasRes = await pool.query(
        `SELECT COUNT(*) AS vistas
         FROM Progresion
         JOIN Leccion ON Progresion.leccion_id = Leccion.id
         WHERE Progresion.usuario_id = $1 AND Leccion.curso_id = $2 AND Progresion.estado = 'Visto'`,
        [usuarioId, cursoId] // Parámetros de la consulta
    );

    const totalLecciones = totalLeccionesRes.rows[0].total;
    const leccionesVistas = leccionesVistasRes.rows[0].vistas;

    if (totalLecciones === 0) {
        return { cursoId, progreso: 0 }; // Si no hay lecciones, progreso es 0
    }

    const progreso = (leccionesVistas / totalLecciones) * 100; // Calcula el progreso como porcentaje

    return { cursoId, progreso }; // Devuelve el progreso en porcentaje
};

/**
 * Función para obtener el progreso de un usuario en una lección específica
 * @param {number} usuario_id - ID del usuario
 * @param {number} leccion_id - ID de la lección
 * @returns {Promise<Object>} Progreso del usuario en la lección
 */
const getProgresoByUserAndLeccion = async (usuario_id, leccion_id) => {
    const res = await pool.query(
        'SELECT * FROM Progresion WHERE usuario_id = $1 AND leccion_id = $2',
        [usuario_id, leccion_id] // Parámetros de la consulta
    );
    console.log(`Resultado de la consulta para progreso usuario_id: ${usuario_id}, leccion_id: ${leccion_id}`, res.rows[0]);
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Exportación de las funciones del módulo
 */
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


