const inscripcionModel = require('../models/inscripcion');

const getInscripciones = async (req, res) => {
    try {
        const inscripciones = await inscripcionModel.getAllInscripciones();
        res.json(inscripciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInscripcion = async (req, res) => {
    try {
        const inscripcion = await inscripcionModel.getInscripcionById(req.params.id);
        if (inscripcion) {
            res.json(inscripcion);
        } else {
            res.status(404).json({ message: 'Inscripción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createInscripcion = async (req, res) => {
    try {
        const newInscripcion = await inscripcionModel.createInscripcion(req.body);
        res.status(201).json(newInscripcion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateInscripcion = async (req, res) => {
    try {
        const updatedInscripcion = await inscripcionModel.updateInscripcion(req.params.id, req.body);
        if (updatedInscripcion) {
            res.json(updatedInscripcion);
        } else {
            res.status(404).json({ message: 'Inscripción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteInscripcion = async (req, res) => {
    try {
        const result = await inscripcionModel.deleteInscripcion(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCursosByEstudiante = async (req, res) => {
    try {
        const cursos = await inscripcionModel.getCursosByEstudianteId(req.params.idEstudiante);
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getInscripciones,
    getInscripcion,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getCursosByEstudiante
};
