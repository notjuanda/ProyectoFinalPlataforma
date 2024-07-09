/**
 * Importación de módulos necesarios
 */
const express = require('express'); // Framework de servidor web
const bodyParser = require('body-parser'); // Middleware para analizar cuerpos de solicitud
const app = express(); // Creación de una instancia de Express
const morgan = require('morgan'); // Middleware para registro de solicitudes HTTP
const cors = require('cors'); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
require('dotenv').config(); // Cargar variables de entorno desde un archivo .env
const path = require('path'); // Módulo para trabajar con rutas de archivos y directorios

/**
 * Configuraciones del servidor
 */
app.set('port', process.env.PORT || 3001); // Establece el puerto en el que el servidor escuchará, tomando de las variables de entorno o por defecto 3001
app.set('json spaces', 2); // Configuración para formatear las respuestas JSON con una indentación de 2 espacios

/**
 * Middlewares para el análisis del cuerpo de las solicitudes
 */
app.use(bodyParser.json({ limit: '50mb' })); // Analizar solicitudes con cuerpos JSON, aumentando el tamaño máximo permitido a 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Analizar solicitudes con datos URL-encoded, aumentando el tamaño máximo permitido a 50MB

/**
 * Otros middlewares
 */
app.use(morgan('dev')); // Middleware para registro de solicitudes HTTP en consola con formato 'dev'
app.use(cors({
    origin: '*', // Permitir solicitudes CORS desde este origen específico
    credentials: true // Habilitar el envío de cookies en solicitudes cross-origin
}));
app.use(express.urlencoded({ extended: false })); // Analizar cuerpos URL-encoded con la opción extended en false
app.use(express.json()); // Analizar cuerpos JSON

/**
 * Middleware para deshabilitar el almacenamiento en caché
 */
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store'); // Establecer encabezado para deshabilitar el almacenamiento en caché
    next(); // Continuar al siguiente middleware
});

/**
 * Servir archivos estáticos
 */
app.use(express.static(path.join(__dirname, '..', 'public'))); // Servir archivos estáticos desde el directorio 'public'

/**
 * Rutas de la API
 */
app.use('/api/usuarios', require('./routes/usuarioRoute')); // Rutas relacionadas con usuarios
app.use('/api/cursos', require('./routes/cursoRoute')); // Rutas relacionadas con cursos
app.use('/api/progresos', require('./routes/progresoRoute')); // Rutas relacionadas con progresos
app.use('/api/lecciones', require('./routes/leccionRoute')); // Rutas relacionadas con lecciones
app.use('/api/categorias', require('./routes/categoriaRoute')); // Rutas relacionadas con categorías
app.use('/api/inscripciones', require('./routes/inscripcionRoute')); // Rutas relacionadas con inscripciones

/**
 * Ruta por defecto para servir el archivo HTML principal
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); // Servir el archivo 'index.html' como respuesta
});

/**
 * Ruta para el panel de usuario registrado
 */
app.get('/registered', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'registered.html')); // Servir el archivo 'registered.html' como respuesta
});

/**
 * Inicio del servidor
 */
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`); // Imprimir en consola el puerto en el que el servidor está escuchando
});
