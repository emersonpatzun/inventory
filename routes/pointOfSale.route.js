'use strict'

const express = require('express');
const api = express.Router();
const middleAuth = require('../middlewares/authentication');
const pointController = require('../controllers/pointOfSale.controllers');

api.post('/pointsOfSale',pointController.createPointOfSale);
api.get('/pointsOfSale',middleAuth.ensureAuth,pointController.listPointOfSale);
api.get('/pointsOfSale/:id',middleAuth.ensureAuth,pointController.listPointOfSale);
api.put('/pointsOfSale/:id',middleAuth.ensureAuth,pointController.updatePointOfSale);
api.delete('/pointsOfSale/:id', middleAuth.ensureAuth,pointController.deletePointOfSale);

module.exports = api;
