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
    const res = await pool.query(
        'INSERT INTO Progresion (usuario_id, leccion_id, estado) VALUES ($1, $2, $3) RETURNING *',
        [usuario_id, leccion_id, estado]
    );
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

module.exports = {
    getAllProgresos,
    getProgresoById,
    createProgreso,
    updateProgreso,
    deleteProgreso,
};
