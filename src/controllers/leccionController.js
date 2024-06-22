const leccionModel = require('../models/leccion');
const inscripcionModel = require('../models/inscripcion');
const progresoModel = require('../models/progreso');

const getLecciones = async (req, res) => {
    try {
        const lecciones = await leccionModel.getAllLecciones();
        res.json(lecciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLeccion = async (req, res) => {
    try {
        const leccion = await leccionModel.getLeccionById(req.params.id);
        if (leccion) {
            res.json(leccion);
        } else {
            res.status(404).json({ message: 'Lección no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createLeccion = async (req, res) => {
    const { nombre, descripcion, tipoContenido, contenido, curso_id } = req.body;
    try {
        const newLeccion = await leccionModel.createLeccion({ nombre, descripcion, tipoContenido, contenido, curso_id });

        // Obtener todos los estudiantes inscritos en el curso
        const estudiantes = await inscripcionModel.getEstudiantesByCursoId(curso_id);

        // Crear progresión para cada estudiante con la nueva lección, si no existe
        for (const estudiante of estudiantes) {
            const existingProgreso = await progresoModel.getProgresoByUserAndLeccion(estudiante.idestudiante, newLeccion.id);
            if (!existingProgreso) {
                await progresoModel.createProgreso({
                    usuario_id: estudiante.idestudiante,
                    leccion_id: newLeccion.id,
                    estado: 'Marcado_Visto' // Estado inicial de no visto
                });
            }
        }

        res.status(201).json(newLeccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateLeccion = async (req, res) => {
    try {
        const updatedLeccion = await leccionModel.updateLeccion(req.params.id, req.body);
        if (updatedLeccion) {
            res.json(updatedLeccion);
        } else {
            res.status(404).json({ message: 'Lección no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLeccion = async (req, res) => {
    try {
        const result = await leccionModel.deleteLeccion(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getLecciones,
    getLeccion,
    createLeccion,
    updateLeccion,
    deleteLeccion,
};
