
const Models = require('../models');
const PointOfSale = Models.pointOfSale;


async function createPointOfSale(req,res){
    let data =  req.body;

    if(data.name){
        try {
            let pointOfSaleExists = await PointOfSale.findOne({
                where:{
                    name:data.name
                }
            });

            if(pointOfSaleExists) res.status(400).send({message:'El punto de venta ya existe.'});
            else{
               let createdPointofSale = await PointOfSale.create({name:data.name,state:'ACTIVE'});
                if(!createdPointofSale) res.send({message:'No se pudo agregar el punto de venta'});
                else res.send(createdPointofSale);
            }
        }catch(err){
            res.status(500).send('Error interno del servidor');
            console.log(err);
        }
    }else{
        res.send({mesagge:"Todos los campos son requeridos"});
    }
}

async function deletePointOfSale(req,res){
    let id = req.params.id;

    try {
        let pointExists = await PointOfSale.findById(id);

        if(!pointExists) res.status(400).send({message:'ID de punto de venta incorrecto.'});
        else{
           let hasTransactions = await Transaction.findAll({where:{pointOfSale:id}});
           if(hasTransactions){
                await PointOfSale.update({state:'INACTIVE'},{where:{idpointOfSale:id}});
                res.send({message:'Estado Actualizado'});
           }else{
                let pointDeleted = await PointOfSale.destroy({where:{idpointOfSale:id}});
                if(!pointDeleted) res.send({message:'No se pudo borrar el punto de venta'});
                else{
                    res.send({message:'Punto de Venta Eliminado'});
                }
           }
        }
    }catch(err){
        res.status(500).send('Error interno del servidor');
        console.log(err);
    }
    
}

async function listPointsOfSale(req,res){
    try {
        let users = await User.findAll({where:{state:'ACTIVE'}});
        if(!users) res.send({message:'No se pudo obtener los usuarios'});
        else{
            if(users.length == 0) res.send({message:'No hay usuarios disponibles'});
            else{
                res.send(users);
            }
        }
    }catch(err){
        res.status(500).send('Error interno del servidor');
        console.log(err);
    }
}

module.exports = {
    listPointsOfSale,
    createPointOfSale,
    deletePointOfSale
}