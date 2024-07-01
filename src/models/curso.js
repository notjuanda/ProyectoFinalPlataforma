/**
 * Importación de módulos necesarios
 */
const pool = require('../data/db'); // Importa el pool de conexiones a la base de datos

/**
 * Función para obtener todos los cursos
 * @returns {Promise<Array>} Lista de todos los cursos
 */
const getAllCursos = async () => {
    const res = await pool.query('SELECT * FROM Curso'); // Consulta para obtener todos los cursos
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Función para obtener un curso por su ID
 * @param {number} id - ID del curso
 * @returns {Promise<Object>} Curso encontrado
 */
const getCursoById = async (id) => {
    const res = await pool.query('SELECT * FROM Curso WHERE id = $1', [id]); // Consulta para obtener un curso por ID
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para crear un nuevo curso
 * @param {Object} curso - Datos del curso a crear
 * @param {string} curso.nombreCurso - Nombre del curso
 * @param {string} curso.descripcion - Descripción del curso
 * @param {string} curso.imagenCurso - URL de la imagen del curso
 * @param {string} curso.bannerCurso - URL del banner del curso
 * @param {number} curso.categoria_id - ID de la categoría del curso
 * @param {number} curso.usuario_id - ID del usuario creador del curso
 * @returns {Promise<Object>} Curso creado
 */
const createCurso = async (curso) => {
    const { nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id } = curso;
    const res = await pool.query(
        'INSERT INTO Curso (nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila creada
};

/**
 * Función para actualizar un curso existente
 * @param {number} id - ID del curso a actualizar
 * @param {Object} curso - Datos del curso a actualizar
 * @param {string} curso.nombreCurso - Nombre del curso
 * @param {string} curso.descripcion - Descripción del curso
 * @param {number} curso.categoria_id - ID de la categoría del curso
 * @param {string} curso.imagenCurso - URL de la imagen del curso
 * @returns {Promise<Object>} Curso actualizado
 */
const updateCurso = async (id, curso) => {
    const { nombreCurso, descripcion, categoria_id, imagenCurso } = curso;
    const res = await pool.query(
        'UPDATE Curso SET nombreCurso = $1, descripcion = $2, categoria_id = $3, imagenCurso = $4 WHERE id = $5 RETURNING *',
        [nombreCurso, descripcion, categoria_id, imagenCurso, id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila actualizada
};

/**
 * Función para eliminar un curso
 * @param {number} id - ID del curso a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 */
const deleteCurso = async (id) => {
    await pool.query('DELETE FROM Curso WHERE id = $1', [id]); // Consulta para eliminar un curso por ID
    return { message: 'Curso eliminado' }; // Devuelve un mensaje de confirmación
};

/**
 * Función para obtener un curso junto con sus lecciones por ID del curso
 * @param {number} id - ID del curso
 * @returns {Promise<Object|null>} Curso con sus lecciones o null si no se encuentra
 */
const getCursoConLecciones = async (id) => {
    const cursoRes = await pool.query('SELECT * FROM Curso WHERE id = $1', [id]); // Consulta para obtener un curso por ID
    if (cursoRes.rows.length === 0) {
        return null; // Devuelve null si no se encuentra el curso
    }

    const curso = cursoRes.rows[0];
    const leccionesRes = await pool.query('SELECT * FROM Leccion WHERE curso_id = $1', [id]); // Consulta para obtener las lecciones del curso
    curso.lecciones = leccionesRes.rows; // Añade las lecciones al curso

    return curso; // Devuelve el curso con sus lecciones
};

/**
 * Función para buscar cursos por nombre
 * @param {string} nombre - Nombre del curso a buscar
 * @returns {Promise<Array>} Lista de cursos encontrados
 */
const searchCursosByName = async (nombre) => {
    const res = await pool.query(
        'SELECT * FROM Curso WHERE LOWER(nombreCurso) LIKE LOWER($1)',
        [`%${nombre}%`] // Parámetro de la consulta
    );
    return res.rows; // Devuelve todas las filas encontradas
};

/**
 * Exportación de las funciones del módulo
 */
module.exports = {
    getAllCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
    getCursoConLecciones, 
    searchCursosByName
};
