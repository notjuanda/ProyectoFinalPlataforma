/**
 * Importación de módulos necesarios
 */
const pool = require('../data/db'); // Importa el pool de conexiones a la base de datos

/**
 * Función para obtener todas las categorías
 * @returns {Promise<Array>} Lista de todas las categorías
 */
const getAllCategorias = async () => {
    const res = await pool.query('SELECT * FROM Categoria'); // Consulta para obtener todas las categorías
    return res.rows; // Devuelve todas las filas obtenidas
};

/**
 * Función para obtener una categoría por su ID
 * @param {number} id - ID de la categoría
 * @returns {Promise<Object>} Categoría encontrada
 */
const getCategoriaById = async (id) => {
    const res = await pool.query('SELECT * FROM Categoria WHERE id = $1', [id]); // Consulta para obtener una categoría por ID
    return res.rows[0]; // Devuelve la primera fila encontrada
};

/**
 * Función para crear una nueva categoría
 * @param {Object} categoria - Datos de la categoría a crear
 * @param {string} categoria.nombre - Nombre de la categoría
 * @param {string} categoria.descripcion - Descripción de la categoría
 * @param {string} categoria.imagenCategoria - URL de la imagen de la categoría
 * @param {number} categoria.usuario_id - ID del usuario que crea la categoría
 * @returns {Promise<Object>} Categoría creada
 */
const createCategoria = async (categoria) => {
    const { nombre, descripcion, imagenCategoria, usuario_id } = categoria;
    const res = await pool.query(
        'INSERT INTO Categoria (nombre, descripcion, imagenCategoria, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, descripcion, imagenCategoria, usuario_id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila creada
};

/**
 * Función para actualizar una categoría existente
 * @param {number} id - ID de la categoría a actualizar
 * @param {Object} categoria - Datos de la categoría a actualizar
 * @param {string} categoria.nombre - Nombre de la categoría
 * @param {string} categoria.descripcion - Descripción de la categoría
 * @param {string} categoria.imagenCategoria - URL de la imagen de la categoría
 * @param {number} categoria.usuario_id - ID del usuario que actualiza la categoría
 * @returns {Promise<Object>} Categoría actualizada
 */
const updateCategoria = async (id, categoria) => {
    const { nombre, descripcion, imagenCategoria, usuario_id } = categoria;
    const res = await pool.query(
        'UPDATE Categoria SET nombre = $1, descripcion = $2, imagenCategoria = $3, usuario_id = $4 WHERE id = $5 RETURNING *',
        [nombre, descripcion, imagenCategoria, usuario_id, id] // Parámetros de la consulta
    );
    return res.rows[0]; // Devuelve la fila actualizada
};

/**
 * Función para eliminar una categoría
 * @param {number} id - ID de la categoría a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 */
const deleteCategoria = async (id) => {
    await pool.query('DELETE FROM Categoria WHERE id = $1', [id]); // Consulta para eliminar una categoría por ID
    return { message: 'Categoría eliminada' }; // Devuelve un mensaje de confirmación
};

/**
 * Función para obtener una categoría junto con sus cursos por ID de la categoría
 * @param {number} categoriaId - ID de la categoría
 * @returns {Promise<Object|null>} Categoría con sus cursos o null si no se encuentra
 */
const getCategoriaConCursos = async (categoriaId) => {
    try {
        const res = await pool.query(`
            SELECT 
                c.id AS categoria_id,
                c.nombre AS categoria_nombre,
                c.descripcion AS categoria_descripcion,
                c.imagenCategoria AS categoria_imagen,
                cu.id AS curso_id,
                cu.nombreCurso AS curso_nombre,
                cu.descripcion AS curso_descripcion,
                cu.imagenCurso AS curso_imagen,
                cu.bannerCurso AS curso_banner
            FROM Categoria c
            LEFT JOIN Curso cu ON c.id = cu.categoria_id
            WHERE c.id = $1
        `, [categoriaId]); // Consulta para obtener una categoría junto con sus cursos por ID de la categoría
        console.log('Resultados de la consulta:', res.rows);

        if (res.rows.length === 0) {
            return null; // Devuelve null si no se encuentra la categoría
        }

        const categoria = {
            id: res.rows[0].categoria_id,
            nombre: res.rows[0].categoria_nombre,
            descripcion: res.rows[0].categoria_descripcion,
            imagenCategoria: res.rows[0].categoria_imagen,
            cursos: res.rows.filter(row => row.curso_id).map(row => ({
                id: row.curso_id,
                nombreCurso: row.curso_nombre,
                descripcion: row.curso_descripcion,
                imagenCurso: row.curso_imagen,
                bannerCurso: row.curso_banner
            })) // Filtra y mapea los cursos asociados a la categoría
        };

        return categoria; // Devuelve la categoría con sus cursos
    } catch (error) {
        console.error('Error en la consulta de categoría con cursos:', error); // Manejo de errores
        throw error;
    }
};

/**
 * Exportación de las funciones del módulo
 */
module.exports = {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoriaConCursos
};
