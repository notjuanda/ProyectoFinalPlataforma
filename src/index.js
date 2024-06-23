const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Configuraciones
app.set('port', process.env.PORT || 3001);
app.set('json spaces', 2);

app.use(bodyParser.json({ limit: '50mb' })); // Aumentar el tamaño de carga
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middlewares
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://127.0.0.1:5501', // Reemplaza esto con el origen correcto de tu frontend
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de API
app.use('/api/usuarios', require('./routes/usuarioRoute'));
app.use('/api/cursos', require('./routes/cursoRoute'));
app.use('/api/progresos', require('./routes/progresoRoute'));
app.use('/api/lecciones', require('./routes/leccionRoute'));
app.use('/api/categorias', require('./routes/categoriaRoute'));
app.use('/api/inscripciones', require('./routes/inscripcionRoute'));

// Ruta por defecto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Ruta para panel de usuario registrado
app.get('/registered', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'registered.html'));
});

// Inicio del Servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
