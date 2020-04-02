
const app = require('./app');
const db = require('./models');
const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
    console.log('\u001b[33m'+'Conexion con la BD establecida');    
    app.listen(PORT,(req,res)=>{
        console.log(`\u001b[33mServidor express levantado en el puerto: ${PORT}`);
    });
}).catch((error)=>{
    console.log('Error',error);
});


