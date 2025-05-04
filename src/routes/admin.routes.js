const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

//router.use(isAdmin);

// Películas
router.get("/", adminController.listarPeliculas);
router.get("/peliculas/nueva", (req, res) => { res.render("admin/nuevaPelicula"); });
router.post('/peliculas/nueva', adminController.guardarPelicula);
router.get('/peliculas/editar/:id', adminController.formEditarPelicula);
router.post('/peliculas/editar/:id', adminController.actualizarPelicula);
router.get('/peliculas/eliminar/:id', adminController.eliminarPelicula);

// Empleados
router.get('/empleados', adminController.listarEmpleados);
router.get('/empleados/nuevo', adminController.formNuevoEmpleado);
router.post('/empleados/nuevo', adminController.guardarEmpleado);//validar correo no repetido
router.get('/empleados/editar/:id', adminController.formEditarEmpleado);
router.post('/empleados/editar/:id', adminController.actualizarEmpleado);//validar correo no repetido
router.get('/empleados/eliminar/:id', adminController.eliminarEmpleado);

// Funciones
router.get('/funciones', adminController.listarFunciones);
/*
router.get('/funciones/nueva', adminController.formNuevaFuncion);
router.post('/funciones/nueva', adminController.guardarFuncion);
router.get('/funciones/editar/:id', adminController.formEditarFuncion);
router.post('/funciones/editar/:id', adminController.actualizarFuncion);
router.post('/funciones/eliminar/:id', adminController.eliminarFuncion);
*/

// Salas
router.get('/salas', adminController.listarSalas);
router.get('/salas/nueva', adminController.formNuevaSala);
router.post('/salas/nueva', adminController.guardarSala);
router.get('/salas/editar/:id', adminController.formEditarSala);
router.post('/salas/editar/:id', adminController.actualizarSala);
router.get('/salas/eliminar/:id', adminController.eliminarSala);

module.exports = { router };
