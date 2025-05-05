const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

router.get('/', clientController.verCartelera);
router.get('/comprar/:funcionId', clientController.comprar);
router.post('/reservar', clientController.reservar);

module.exports = { router };
