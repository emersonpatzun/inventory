const express = require('express');
const app = express();
const db = require('./models');
const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
    console.log('Conexion con la BD establecida');    
    app.listen(port,(req,res)=>{
        console.log('Servidor express levantado');
    });
}).catch((error)=>{
    console.log('Error');
});


