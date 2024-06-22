const pool = require('../data/db');

const getAllCategorias = async () => {
    const res = await pool.query('SELECT * FROM Categoria');
    return res.rows;
};

const getCategoriaById = async (id) => {
    const res = await pool.query('SELECT * FROM Categoria WHERE id = $1', [id]);
    return res.rows[0];
};

const createCategoria = async (categoria) => {
    const { nombre, descripcion, imagenCategoria, usuario_id } = categoria;
    const res = await pool.query(
        'INSERT INTO Categoria (nombre, descripcion, imagenCategoria, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, descripcion, imagenCategoria, usuario_id]
    );
    return res.rows[0];
};

const updateCategoria = async (id, categoria) => {
    const { nombre, descripcion, imagenCategoria, usuario_id } = categoria;
    const res = await pool.query(
        'UPDATE Categoria SET nombre = $1, descripcion = $2, imagenCategoria = $3, usuario_id = $4 WHERE id = $5 RETURNING *',
        [nombre, descripcion, imagenCategoria, usuario_id, id]
    );
    return res.rows[0];
};

const deleteCategoria = async (id) => {
    await pool.query('DELETE FROM Categoria WHERE id = $1', [id]);
    return { message: 'Categoría eliminada' };
};
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
        `, [categoriaId]);
        console.log('Resultados de la consulta:', res.rows);

        if (res.rows.length === 0) {
            return null;
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
            }))
        };

        return categoria;
    } catch (error) {
        console.error('Error en la consulta de categoría con cursos:', error);
        throw error;
    }
};

module.exports = {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoriaConCursos
};
