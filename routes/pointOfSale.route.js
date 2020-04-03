'use strict'
const express = require('express');
const api = express.Router();
const middleAuth = require('../middlewares/autentication');
const pointController = require('../controllers/pointOfSale.controller');

api.post('/addPointOfSale',middleAuth.ensureAuth,pointController.createPointOfSale);
api.get('/listPointsOfSale',middleAuth.ensureAuth,pointController.listPointsOfSale);
api.delete('/deletePointOfSale/:id',middleAuth.ensureAuth,pointController.deletePointOfSale);

module.exports = api;