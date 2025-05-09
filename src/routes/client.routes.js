const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

router.get('/', clientController.verCartelera);
router.get('/comprar/:funcionId', clientController.comprar);
router.post('/reservar', clientController.reservar);
router.get('/ticket', (req, res) => { res.render("client/ticket"); });
router.post('/ticket', clientController.detalleTicket);
router.get('/ticket/cancel/:id', clientController.cancelarTicket);

module.exports = { router };
