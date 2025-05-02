const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
//const { isAdmin } = require('../middlewares/auth.middleware');

// Películas
router.get('/peliculas', adminController.listarPeliculas);
/*
router.get('/peliculas/nueva', isAdmin, adminController.formNuevaPelicula);
router.post('/peliculas/nueva', isAdmin, adminController.guardarPelicula);
router.get('/peliculas/editar/:id', isAdmin, adminController.formEditarPelicula);
router.post('/peliculas/editar/:id', isAdmin, adminController.actualizarPelicula);
router.post('/peliculas/eliminar/:id', isAdmin, adminController.eliminarPelicula);

// Empleados
router.get('/empleados', isAdmin, adminController.listarEmpleados);
router.get('/empleados/nuevo', isAdmin, adminController.formNuevoEmpleado);
router.post('/empleados/nuevo', isAdmin, adminController.guardarEmpleado);
router.get('/empleados/editar/:id', isAdmin, adminController.formEditarEmpleado);
router.post('/empleados/editar/:id', isAdmin, adminController.actualizarEmpleado);
router.post('/empleados/eliminar/:id', isAdmin, adminController.eliminarEmpleado);

// Funciones
router.get('/funciones', isAdmin, adminController.listarFunciones);
router.get('/funciones/nueva', isAdmin, adminController.formNuevaFuncion);
router.post('/funciones/nueva', isAdmin, adminController.guardarFuncion);
router.get('/funciones/editar/:id', isAdmin, adminController.formEditarFuncion);
router.post('/funciones/editar/:id', isAdmin, adminController.actualizarFuncion);
router.post('/funciones/eliminar/:id', isAdmin, adminController.eliminarFuncion);
*/

module.exports = { router };
