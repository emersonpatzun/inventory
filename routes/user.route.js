'use strict'
const express = require('express');
const api = express.Router();
const middleAuth = require('../middlewares/autentication');
const userController = require('../controllers/user.controller');

api.post('/addUser',userController.createUser);
api.post('/login',userController.login);
api.get('/listUsers',middleAuth.ensureAuth,userController.listUsers);
api.delete('/deleteAccount/:id',middleAuth.ensureAuth,userController.deleteAccount);

module.exports = api;