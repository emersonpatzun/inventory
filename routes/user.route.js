'use strict'

const express = require('express');
const api = express.Router();
const middleAuth = require('../middlewares/authentication');
const userController = require('../controllers/user.controllers');

api.post('/login',userController.login);
api.post('/users',userController.createUser);
api.get('/users',middleAuth.ensureAuth,userController.listUsers);
api.get('/users/:id',middleAuth.ensureAuth,userController.listUsers);
api.put('/users/:id',middleAuth.ensureAuth,userController.updateUser);
api.delete('/users/:id',middleAuth.ensureAuth,userController.deleteAccount);


module.exports = api;
