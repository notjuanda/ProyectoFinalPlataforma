/**
 * Importación de módulos necesarios
 */
const pool = require('../data/db'); // Importa el pool de conexiones a la base de datos

/**
 * Función para obtener todas las lecciones
 * @returns {Promise<Array>} Lista de todas las lecciones ordenadas por su orden
 */
const getAllLecciones = async () => {
    const res = await pool.query('SELECT * FROM Leccion ORDER BY orden'); // Consulta para obtener todas las lecciones ordenadas por su orden
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Función para obtener una lección por su ID
 * @param {number} id - ID de la lección
 * @returns {Promise<Object>} Lección encontrada
 */
const getLeccionById = async (id) => {
    const res = await pool.query('SELECT * FROM Leccion WHERE id = $1', [id]); // Consulta para obtener una lección por ID
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para crear una nueva lección
 * @param {Object} leccion - Datos de la lección a crear
 * @param {string} leccion.nombre - Nombre de la lección
 * @param {string} leccion.descripcion - Descripción de la lección
 * @param {string} leccion.tipoContenido - Tipo de contenido de la lección
 * @param {string} leccion.contenido - Contenido de la lección
 * @param {number} leccion.curso_id - ID del curso al que pertenece la lección
 * @param {number} leccion.orden - Orden de la lección dentro del curso
 * @returns {Promise<Object>} Lección creada
 */
const createLeccion = async (leccion) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id, orden } = leccion;
    const res = await pool.query(
        'INSERT INTO Leccion (nombre, descripcion, tipoContenido, contenido, curso_id, orden) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre, descripcion, tipoContenido, contenido, curso_id, orden] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila creada
};

/**
 * Función para actualizar una lección existente
 * @param {number} id - ID de la lección a actualizar
 * @param {Object} leccion - Datos de la lección a actualizar
 * @param {string} leccion.nombre - Nombre de la lección
 * @param {string} leccion.descripcion - Descripción de la lección
 * @param {string} leccion.tipoContenido - Tipo de contenido de la lección
 * @param {string} leccion.contenido - Contenido de la lección
 * @param {number} leccion.curso_id - ID del curso al que pertenece la lección
 * @param {number} leccion.orden - Orden de la lección dentro del curso
 * @returns {Promise<Object>} Lección actualizada
 */
const updateLeccion = async (id, leccion) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id, orden } = leccion;
    const res = await pool.query(
        'UPDATE Leccion SET nombre = $1, descripcion = $2, tipoContenido = $3, contenido = $4, curso_id = $5, orden = $6 WHERE id = $7 RETURNING *',
        [nombre, descripcion, tipoContenido, contenido, curso_id, orden, id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila actualizada
};

/**
 * Función para eliminar una lección
 * @param {number} id - ID de la lección a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 */
const deleteLeccion = async (id) => {
    await pool.query('DELETE FROM Leccion WHERE id = $1', [id]); // Consulta para eliminar una lección por ID
    return { message: 'Lección eliminada' }; // Devuelve un mensaje de confirmación
};

/**
 * Función para obtener las lecciones de un curso específico por su ID
 * @param {number} cursoId - ID del curso
 * @returns {Promise<Array>} Lista de lecciones del curso
 */
const getLeccionesByCursoId = async (cursoId) => {
    const res = await pool.query('SELECT * FROM Leccion WHERE curso_id = $1 ORDER BY orden', [cursoId]); // Consulta para obtener las lecciones de un curso específico ordenadas por su orden
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Exportación de las funciones del módulo
 */
module.exports = {
    getAllLecciones,
    getLeccionById,
    createLeccion,
    updateLeccion,
    deleteLeccion,
    getLeccionesByCursoId
};
