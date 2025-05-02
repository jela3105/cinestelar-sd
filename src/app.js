const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const { router: adminRoutes } = require('./routes/admin.routes');
//const { router: employeeRoutes } = require('./routes/employee.routes');
const { router: clientRoutes } = require('./routes/client.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos (CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de sesión 
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Inyectar usuario a las vistas si hay sesión
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Rutas
app.use('/', clientRoutes);        // Cliente (cartelera, compra sin login)
//app.use('/empleado', employeeRoutes); // Empleado (ventas)
app.use('/admin', adminRoutes);    // Admin (CRUDs)

// Ruta 404
//app.use((req, res) => {
//    res.status(404).render('partials/404', { mensaje: 'Página no encontrada' });
//});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
