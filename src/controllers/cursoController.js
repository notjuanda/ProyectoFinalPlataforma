const cursoModel = require('../models/curso');

const getCursos = async (req, res) => {
    try {
        const cursos = await cursoModel.getAllCursos();
        // Codificar imagenCurso y bannerCurso a Base64
        cursos.forEach(curso => {
            if (curso.imagencurso) {
                curso.imagencurso = curso.imagencurso.toString('base64');
            }
            if (curso.bannercurso) {
                curso.bannercurso = curso.bannercurso.toString('base64');
            }
        });
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCurso = async (req, res) => {
    try {
        const curso = await cursoModel.getCursoById(req.params.id);
        if (curso) {
            // Codificar imagenCurso y bannerCurso a Base64
            if (curso.imagencurso) {
                curso.imagencurso = curso.imagencurso.toString('base64');
            }
            if (curso.bannercurso) {
                curso.bannercurso = curso.bannercurso.toString('base64');
            }
            res.json(curso);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCursoConLecciones = async (req, res) => {
    try {
        const curso = await cursoModel.getCursoConLecciones(req.params.id);
        if (curso) {
            // Codificar imagenCurso y bannerCurso a Base64
            if (curso.imagencurso) {
                curso.imagencurso = curso.imagencurso.toString('base64');
            }
            if (curso.bannercurso) {
                curso.bannercurso = curso.bannercurso.toString('base64');
            }
            res.json(curso);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCurso = async (req, res) => {
    try {
        let { nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id } = req.body;
        // Decodificar imagenCurso y bannerCurso de Base64
        if (imagenCurso) {
            imagenCurso = Buffer.from(imagenCurso, 'base64');
        }
        if (bannerCurso) {
            bannerCurso = Buffer.from(bannerCurso, 'base64');
        }
        const newCurso = await cursoModel.createCurso({ nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id });
        res.status(201).json(newCurso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCurso = async (req, res) => {
    try {
        let { nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id } = req.body;
        // Decodificar imagenCurso y bannerCurso de Base64
        if (imagenCurso) {
            imagenCurso = Buffer.from(imagenCurso, 'base64');
        }
        if (bannerCurso) {
            bannerCurso = Buffer.from(bannerCurso, 'base64');
        }
        const updatedCurso = await cursoModel.updateCurso(req.params.id, { nombreCurso, descripcion, imagenCurso, bannerCurso, categoria_id, usuario_id });
        if (updatedCurso) {
            // Codificar imagenCurso y bannerCurso a Base64
            if (updatedCurso.imagencurso) {
                updatedCurso.imagencurso = updatedCurso.imagencurso.toString('base64');
            }
            if (updatedCurso.bannercurso) {
                updatedCurso.bannercurso = updatedCurso.bannercurso.toString('base64');
            }
            res.json(updatedCurso);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCurso = async (req, res) => {
    try {
        const result = await cursoModel.deleteCurso(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCursos,
    getCurso,
    getCursoConLecciones,
    createCurso,
    updateCurso,
    deleteCurso,
};

