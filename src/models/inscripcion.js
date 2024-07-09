/**
 * Importación de módulos necesarios
 */
const pool = require('../data/db'); // Importa el pool de conexiones a la base de datos
const { get } = require('../routes/progresoRoute'); // Importa una función del archivo de rutas de progreso (posiblemente no usado aquí)

/**
 * Función para obtener todas las inscripciones
 * @returns {Promise<Array>} Lista de todas las inscripciones
 */
const getAllInscripciones = async () => {
    const res = await pool.query('SELECT * FROM Inscripcion'); // Consulta para obtener todas las inscripciones
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Función para obtener una inscripción por su ID
 * @param {number} id - ID de la inscripción
 * @returns {Promise<Object>} Inscripción encontrada
 */
const getInscripcionById = async (id) => {
    const res = await pool.query('SELECT * FROM Inscripcion WHERE id = $1', [id]); // Consulta para obtener una inscripción por ID
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para crear una nueva inscripción
 * @param {Object} inscripcion - Datos de la inscripción a crear
 * @param {number} inscripcion.idEstudiante - ID del estudiante
 * @param {number} inscripcion.curso_id - ID del curso
 * @returns {Promise<Object>} Inscripción creada
 */
const createInscripcion = async (inscripcion) => {
    const { idEstudiante, curso_id } = inscripcion;
    const res = await pool.query(
        'INSERT INTO Inscripcion (idEstudiante, curso_id) VALUES ($1, $2) RETURNING *',
        [idEstudiante, curso_id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila creada
};

/**
 * Función para actualizar una inscripción existente
 * @param {number} id - ID de la inscripción a actualizar
 * @param {Object} inscripcion - Datos de la inscripción a actualizar
 * @param {number} inscripcion.idEstudiante - ID del estudiante
 * @param {number} inscripcion.curso_id - ID del curso
 * @returns {Promise<Object>} Inscripción actualizada
 */
const updateInscripcion = async (id, inscripcion) => {
    const { idEstudiante, curso_id } = inscripcion;
    const res = await pool.query(
        'UPDATE Inscripcion SET idEstudiante = $1, curso_id = $2 WHERE id = $3 RETURNING *',
        [idEstudiante, curso_id, id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila actualizada
};

/**
 * Función para eliminar una inscripción
 * @param {number} id - ID de la inscripción a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 */
const deleteInscripcion = async (id) => {
    await pool.query('DELETE FROM Inscripcion WHERE id = $1', [id]); // Consulta para eliminar una inscripción por ID
    return { message: 'Inscripción eliminada' }; // Devuelve un mensaje de confirmación
};

/**
 * Función para obtener los cursos de un estudiante específico por su ID
 * @param {number} idEstudiante - ID del estudiante
 * @returns {Promise<Array>} Lista de cursos del estudiante
 */
const getCursosByEstudianteId = async (idEstudiante) => {
    const res = await pool.query(
        `SELECT c.id, c.nombreCurso, c.descripcion, c.imagenCurso 
         FROM Inscripcion i
         JOIN Curso c ON i.curso_id = c.id
         WHERE i.idEstudiante = $1`,
        [idEstudiante] // Parámetro de la consulta
    );
    return res.rows; // Devuelve todas las filas encontradas
};

/**
 * Función para obtener una inscripción por ID de estudiante y ID de curso
 * @param {number} idEstudiante - ID del estudiante
 * @param {number} curso_id - ID del curso
 * @returns {Promise<Object>} Inscripción encontrada
 */
const getInscripcionByEstudianteAndCurso = async (idEstudiante, curso_id) => {
    const res = await pool.query(
        'SELECT * FROM Inscripcion WHERE idEstudiante = $1 AND curso_id = $2',
        [idEstudiante, curso_id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para obtener los estudiantes inscritos en un curso específico por su ID de curso
 * @param {number} cursoId - ID del curso
 * @returns {Promise<Array>} Lista de estudiantes inscritos en el curso
 */
const getEstudiantesByCursoId = async (cursoId) => {
    const res = await pool.query(
        `SELECT Usuario.id AS idestudiante 
         FROM Inscripcion 
         JOIN Usuario ON Inscripcion.idEstudiante = Usuario.id 
         WHERE Inscripcion.curso_id = $1`,
        [cursoId] // Parámetro de la consulta
    );
    return res.rows; // Devuelve todas las filas encontradas
};

/**
 * Exportación de las funciones del módulo
 */
module.exports = {
    getAllInscripciones,
    getInscripcionById,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getCursosByEstudianteId,
    getInscripcionByEstudianteAndCurso, 
    getEstudiantesByCursoId
};
