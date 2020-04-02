'use strict'
//modulos
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//rutas
const userRoutes = require('./routes/user.route');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.use('/',userRoutes);
 
module.exports = app;