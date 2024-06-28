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
        const existingInscripcion = await inscripcionModel.getInscripcionByEstudianteAndCurso(idEstudiante, curso_id);
        if (existingInscripcion) {
            return res.status(409).json({ message: 'El usuario ya está inscrito en este curso' });
        }

        const newInscripcion = await inscripcionModel.createInscripcion({ idEstudiante, curso_id });

        const lecciones = await leccionModel.getLeccionesByCursoId(curso_id);

        for (const leccion of lecciones) {
            const existingProgreso = await progresoModel.getProgresoByUserAndLeccion(idEstudiante, leccion.id);
            console.log(`Verificando progreso existente para usuario ${idEstudiante} y lección ${leccion.id}:`, existingProgreso);

            if (!existingProgreso) {
                const newProgreso = await progresoModel.createProgreso({
                    usuario_id: idEstudiante,
                    leccion_id: leccion.id,
                    estado: 'Marcado_Visto'
                });
                console.log(`Progreso creado para usuario ${idEstudiante} y lección ${leccion.id}:`, newProgreso);
            } else {
                console.log(`Progreso ya existente para usuario ${idEstudiante} y lección ${leccion.id}`);
            }
        }

        console.log('Inscripción creada:', newInscripcion);
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
        
        const existingInscripcion = await inscripcionModel.getInscripcionByEstudianteAndCurso(userId, courseId);
        const isEnrolled = !!existingInscripcion;
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
