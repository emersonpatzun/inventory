'use strict'
const express = require('express');
const api = express.Router();
const middleAuth = require('../middlewares/autentication');
const userPointController = require('../controllers/userPoint.controller');

api.post('/addUserPoint',middleAuth.ensureAuth,userPointController.createUserPoint);
api.get('/listUserPoints',middleAuth.ensureAuth,userPointController.listUserPoint);
api.delete('/deleteUserPoint/:idUserPoint',middleAuth.ensureAuth,userPointController.deleteUserPoint);

module.exports = api;