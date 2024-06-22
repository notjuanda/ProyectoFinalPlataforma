const categoriaModel = require('../models/categoria');

const getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.getAllCategorias();
        // Codificar imagenCategoria a Base64
        categorias.forEach(categoria => {
            if (categoria.imagencategoria) {
                categoria.imagencategoria = categoria.imagencategoria.toString('base64');
            }
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategoria = async (req, res) => {
    try {
        const categoria = await categoriaModel.getCategoriaById(req.params.id);
        if (categoria) {
            //aqui se passan a base 64
            if (categoria.imagencategoria) {
                categoria.imagencategoria = categoria.imagencategoria.toString('base64');
            }
            res.json(categoria);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCategoria = async (req, res) => {
    try {
        let { nombre, descripcion, imagenCategoria, usuario_id } = req.body;
        // Decodificar imagenCategoria de Base64
        if (imagenCategoria) {
            imagenCategoria = Buffer.from(imagenCategoria, 'base64');
        }
        const newCategoria = await categoriaModel.createCategoria({ nombre, descripcion, imagenCategoria, usuario_id });
        res.status(201).json(newCategoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCategoria = async (req, res) => {
    try {
        let { nombre, descripcion, imagenCategoria, usuario_id } = req.body;
        // Decodificar imagenCategoria de Base64
        if (imagenCategoria) {
            imagenCategoria = Buffer.from(imagenCategoria, 'base64');
        }
        const updatedCategoria = await categoriaModel.updateCategoria(req.params.id, { nombre, descripcion, imagenCategoria, usuario_id });
        if (updatedCategoria) {
            // Codificar imagenCategoria a Base64
            if (updatedCategoria.imagencategoria) {
                updatedCategoria.imagencategoria = updatedCategoria.imagencategoria.toString('base64');
            }
            res.json(updatedCategoria);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        const result = await categoriaModel.deleteCategoria(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getCategoriaConCursos = async (req, res) => {
    try {
        const categoriaId = req.params.id;
        const categoria = await categoriaModel.getCategoriaConCursos(categoriaId);
        if (categoria) {
            categoria.cursos.forEach(curso => {
                if (curso.imagenCurso && Buffer.isBuffer(curso.imagenCurso)) {
                    curso.imagenCursoLength = curso.imagenCurso.toString('base64').length;
                    delete curso.imagenCurso; // Eliminamos la imagen original
                }
                if (curso.bannerCurso && Buffer.isBuffer(curso.bannerCurso)) {
                    curso.bannerCursoLength = curso.bannerCurso.toString('base64').length;
                    delete curso.bannerCurso; // Eliminamos la imagen original
                }
            });
            if (categoria.imagenCategoria && Buffer.isBuffer(categoria.imagenCategoria)) {
                categoria.imagenCategoriaLength = categoria.imagenCategoria.toString('base64').length;
                delete categoria.imagenCategoria; // Eliminamos la imagen original
            }
            res.json(categoria);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error obteniendo categoría con cursos:', error);
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getCategoriaConCursos,
    getCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
