'use strict'
const express = require('express');
const api = express.Router();
//const middleAuth = require('../middleware/autentication');
const userController = require('../controllers/user.controller');

api.post('/addUser',userController.createUser);
api.post('/login',userController.login);

module.exports = api;