const Models = require('../models');
const User = Models.User;
const UserPoint = Models.userPoint;
const PointOfSale = Models.pointOfSale;

async function createUserPoint(req,res){
    let data = req.body;

    if(data.idUser && data.idPointOfSale){
        try{
            let userExists = await User.findById(idUser);
            let pointOfSaleExists = await PointOfSale.findById(idPointOfSale);
            if(!userExists) res.status(400).send({message:'ID de usuario incorrecto.'});
            else if(!pointOfSaleExists) res.status(400).send({message:'ID de punto de venta incorrecto.'});
            else{
                let userPointCreated = await UserPoint.create({user:data.idUser,pointOfSale:idPointOfSale});
                if(!userPointCreated) res.send({message:'No se pudo crear el punto de usuario.'});
                else res.send(userPointCreated);
            }
        }catch(err){
           res.status(500).send({message:'Error interno del servidor.'}); 
        }
    }else{
        res.status(400).send({message:'Todos los campos son requeridos.'});
    }

}

async function deleteUserPoint(req,res){
    let idUser = req.body.idUser;
    let idUserPoint = req.params.idUserPoint;
    try {
        let userExists = await User.findById(idUser);

        if(!userExists) res.status(400).send({message:'ID de usuario incorrecto.'});
        else{
           let userPointRemoved = await UserPoint.destroy({where:{idUserPoint:idUserPoint}});
           if(!userPointRemoved) res.send({message:'ID de userPoint incorrecto'});
           else res.send({message:'UserPoint eliminado'});
        }
    }catch(err){
        res.status(500).send('Error interno del servidor');
        console.log(err);
    }
}

async function listUserPoint(req,res){
    try{
        let userPoints = await UserPoint.findAll({});
        if(!userPoints) res.status(400).send({message:'No se pudo obtener los userPoint'});
        else{
            if(userPoints.length == 0) res.send({message:'No hay userPoint que mostrar'});
            else res.send(userPoints);
        }
    }catch(err){
        res.status(500).send({message:'Error interno del servidor'});
    }
}

module.exports = {
    createUserPoint,
    deleteUserPoint,
    listUserPoint
}