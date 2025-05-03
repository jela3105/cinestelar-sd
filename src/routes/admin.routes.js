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
/*
router.post('/peliculas/eliminar/:id', adminController.eliminarPelicula);
// Empleados
router.get('/empleados', adminController.listarEmpleados);
router.get('/empleados/nuevo', adminController.formNuevoEmpleado);
router.post('/empleados/nuevo', adminController.guardarEmpleado);
router.get('/empleados/editar/:id', adminController.formEditarEmpleado);
router.post('/empleados/editar/:id', adminController.actualizarEmpleado);
router.post('/empleados/eliminar/:id', adminController.eliminarEmpleado);

// Funciones
router.get('/funciones', adminController.listarFunciones);
router.get('/funciones/nueva', adminController.formNuevaFuncion);
router.post('/funciones/nueva', adminController.guardarFuncion);
router.get('/funciones/editar/:id', adminController.formEditarFuncion);
router.post('/funciones/editar/:id', adminController.actualizarFuncion);
router.post('/funciones/eliminar/:id', adminController.eliminarFuncion);
*/

module.exports = { router };
