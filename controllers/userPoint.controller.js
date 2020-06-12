const Models = require('../models');
const User = Models.User;
const UserPoint = Models.userPoint;
const PointOfSale = Models.pointOfSale;
const messages = require('../constants/messagesUserPoint');
const constants = require('../constants/constants');

/* NOTAS PARA EL PROFESOR 
   ACTUALMENTE LAS BUENAS PRÁCTICAS DEL USO DE EXPRESS Y ECMAScript6 EN NODE.JS HACEN LA UTILIZACIÓN DEL MÉTODO SEND EN LUGAR 
   DE RESPONSE, SEND ES EQUIVALENTE A RESPONSE DENTRO DEL FRAMEWORK EXPRESS, POR LO ANTES MENCIONADO NO SE UTILIZARÁ PARA 
   RESPONDER SOLICITUDES EN LA API.
*/

async function createUserPoint(req,res){
    let data = req.body;

    if(data.idUser && data.idPointOfSale){
        try{
            let userExists = await User.findById(idUser);
            let pointOfSaleExists = await PointOfSale.findById(idPointOfSale);
            if(!userExists) res.status(400).send({message:messages.EXISTING_USERPOINT});
            else if(!pointOfSaleExists) res.status(400).send({message:messages.WRONG_USER_ID});
            else{
                let userPointCreated = await UserPoint.create({user:data.idUser,pointOfSale:idPointOfSale});
                if(!userPointCreated) res.send({message:messages.COULD_NOT_CREATE_USERPOINT});
                else res.send(userPointCreated);
            }
        }catch(err){
           res.status(500).send({message:messages.INTERNAL_ERROR}); 
        }
    }else{
        res.status(400).send({message:messages.REQUIRED_FIELDS});
    }

}

async function deleteUserPoint(req,res){
    let idUser = req.body.idUser;
    let idUserPoint = req.params.idUserPoint;
    try {
        let userExists = await User.findById(idUser);

        if(!userExists) res.status(400).send({message:messages.WRONG_USER_ID});
        else{
           let userPointRemoved = await UserPoint.destroy({where:{idUserPoint:idUserPoint}});
           if(!userPointRemoved) res.send({message:messages.WRONG_POINT_ID});
           else res.send({message:messages.DELETED});
        }
    }catch(err){
        res.status(500).send({message:messages.INTERNAL_ERROR}); 
        console.log(err);
    }
}

async function listUserPoint(req,res){
    try{
        let userPoints = await UserPoint.findAll({});
        if(!userPoints) res.status(400).send({message:messages.COULD_NOT_GET_USERPOINT});
        else{
            if(userPoints.length == 0) res.send({message:messages.NO_USERPOINT_SEE});
            else res.send(userPoints);
        }
    }catch(err){
        res.status(500).send({message:messages.INTERNAL_ERROR}); 
    }
}

module.exports = {
    createUserPoint,
    deleteUserPoint,
    listUserPoint
}