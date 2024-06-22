const inscripcionModel = require('../models/inscripcion');
const progresoModel = require('../models/progreso');
const leccionModel = require('../models/leccion');

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
    const { idEstudiante, curso_id } = req.body;
    try {
        const newInscripcion = await inscripcionModel.createInscripcion({ idEstudiante, curso_id });

        // Obtener todas las lecciones del curso
        const lecciones = await leccionModel.getLeccionesByCursoId(curso_id);

        // Crear progresión para cada lección en el curso
        for (const leccion of lecciones) {
            const existingProgreso = await progresoModel.getProgresoByUserAndLeccion(idEstudiante, leccion.id);
            if (!existingProgreso) {
                await progresoModel.createProgreso({
                    usuario_id: idEstudiante,
                    leccion_id: leccion.id,
                    estado: 'Marcado_Visto' // Estado inicial de no visto
                });
            }
        }

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

const checkEnrollment = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        console.log(`Checking enrollment for user ${userId} and course ${courseId}`);
        
        const inscripciones = await inscripcionModel.getCursosByEstudianteId(userId);
        console.log('Inscripciones obtenidas:', inscripciones);
        
        const isEnrolled = inscripciones.some(inscripcion => inscripcion.id == courseId);
        console.log('¿Está inscrito?', isEnrolled);
        
        res.json({ isEnrolled });
    } catch (error) {
        console.error('Error checking enrollment:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getInscripciones,
    getInscripcion,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getCursosByEstudiante,
    checkEnrollment
};
