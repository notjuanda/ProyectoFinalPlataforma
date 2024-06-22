const progresoModel = require('../models/progreso');

const getProgresos = async (req, res) => {
    try {
        const progresos = await progresoModel.getAllProgresos();
        res.json(progresos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProgreso = async (req, res) => {
    try {
        const progreso = await progresoModel.getProgresoById(req.params.id);
        if (progreso) {
            res.json(progreso);
        } else {
            res.status(404).json({ message: 'Progreso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProgreso = async (req, res) => {
    try {
        const newProgreso = await progresoModel.createProgreso(req.body);
        res.status(201).json(newProgreso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProgreso = async (req, res) => {
    try {
        const updatedProgreso = await progresoModel.updateProgreso(req.params.id, req.body);
        if (updatedProgreso) {
            res.json(updatedProgreso);
        } else {
            res.status(404).json({ message: 'Progreso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProgreso = async (req, res) => {
    try {
        const result = await progresoModel.deleteProgreso(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProgressByUser = async (req, res) => {
    try {
        const progress = await progresoModel.getProgressByUserId(req.params.id);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProgressByCourse = async (req, res) => {
    try {
        const { usuarioId, cursoId } = req.params;
        const progress = await progresoModel.getProgressByCourse(usuarioId, cursoId);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getProgresos,
    getProgreso,
    createProgreso,
    updateProgreso,
    deleteProgreso,
    getProgressByUser,
    getProgressByCourse, 
};
