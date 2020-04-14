'use strict'

const express = require('express');
const api = express.Router();
const middleAuth = require('../middlewares/autentication');
const productController = require('../controllers/product.controller');

api.post('/product', productController.createProduct);
api.get('/product', middleAuth.ensureAuth,productController.listProduct);
api.get('/product/:id', middleAuth.ensureAuth,productController.listProduct);
api.put('/product/:id', middleAuth.ensureAuth,productController.updateProduct);
api.delete('/product/:id', middleAuth.ensureAuth,productController.deleteProduct);

module.exports = api;