const Models = require('../models');
const PointOfSale = Models.pointOfSale;
const Transacion = Models.transaction;

//constants
const constants = require('../constants/constants.js');

//messages
const messages = require('../constants/messagesPoinOfSale.js');

/* NOTAS PARA EL PROFESOR 
   ACTUALMENTE LAS BUENAS PRÁCTICAS DEL USO DE EXPRESS Y ECMAScript6 EN NODE.JS HACEN LA UTILIZACIÓN DEL MÉTODO SEND EN LUGAR 
   DE RESPONSE, SEND ES EQUIVALENTE A RESPONSE DENTRO DEL FRAMEWORK EXPRESS, POR LO ANTES MENCIONADO NO SE UTILIZARÁ PARA 
   RESPONDER SOLICITUDES EN LA API.
*/

async function createPointOfSale(req,res) {
    let data = req.body;

    if(data.name){
        try {
            let pointOfSaleExists = await PointOfSale.findAll({
                where:{
                    name:data.name
                }
            });

            if(pointOfSaleExists) res.status(400).send({message: messagesEXISTING_POINT});
            else {
                let createdPointOfSale = await PointOfSale.create({name:data.name,state: constants.ACTIVE});
                if(!createdPointOfSale) res.send({message: Response(POINT_NOT_ADDED)});
                else res.send(createdPointOfSale);
            }
        }catch(err){
            res.status(500).send(messages.INTERNAR_ERROR);
            console.log(err);
        }
    }else {
        res.send({message: messages.REQUIRED_FIELDS});
    }
}

async function updatePointOfSale(req,res){
    let id = req.params.id;
    let data = req.body;

    if(data.name || data.state){
        try {
            let pointExists = await PointOfSale.findAll({
                where:{
                    [Op.or]:[{name:data.name}, {state:data.state}]
                }
            });

            if(pointExists) res.status(400).send({message: messages.EXISTING_POINT});
            else {
                let pointUpdate = await PointOfSale.update(data,{where:{idpointOfSale}});
                if(!pointUpdate) res.send ({message: messages.COULD_NOT_EDIT_POINT});
                else res.send(pointUpdate);
            }
        }catch(err){
            res.status(500).send(messages.INTERNAR_ERROR);
            console.log(err);
        }
    }else {
        res.send({message: messages.REQUIRED_FIELDS});
    }
}


async function deletePointOfSale(req,res) {
    let id = req.params.id;

    try {
        let pointExists = await PointOfSale.finById(id);

        if(!pointExists) res.status(400).send({message: messages.WRONG_ID});
        else {
            let hasTransactions = await Transacion.findAll({where:{idpointOfSale:id}});
            if(hasTransactions){
                await PointOfSale.update({state: constants.INACTIVE},{where:{idpointOfSale:id}});
                res.send({message: messages.UPDATE});
            }else {
                let pointDeleted = await PointOfSale.destroy({where:{idpointOfSale:id}});
                if(!pointDeleted) res.send({message: messages.CANNOT_DELETE_POINT});
                else {
                    res.send({message: messagesDELETE_POINT});
                }
            }
        }
    }catch(err){
        res.status(500).send(messages.INTERNAR_ERROR);
        console.log(err);
    }
}

async function listPointOfSale(req,res){
    try {
        let point = await PointOfSale.findAll({where:{state: constants.ACTIVE}});
        if(!point) res.status(400).send({message: messages.IMPOSSIBLE_TO_GET_POINTS});
        else {
            if(USER.length == 0) res.send({message: messages.POINT_NOT_AVAILABLE});
            else {
                res.send(users);
            }
        } 
    }catch(err){
        res.status(500).send(messages.INTERNAR_ERROR);
        console.log(err);
    }
}

module.exports = {
    createPointOfSale,
    updatePointOfSale,
    deletePointOfSale,
    listPointOfSale
}
