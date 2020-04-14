const Models = require('../models');
const PointOfSale = Models.pointOfSale;
const Transacion = Models.transaction;

//constants
const constants = require('../constants/constants.js');

//messages
const messages = require('../constants/messagesPoinOfSale.js');

async function createPointOfSale(req,res) {
    let data = req.body;

    if(data.name){
        try {
            let pointOfSaleExists = await PointOfSale.findOne({
                where:{
                    name:data.name
                }
            });

            if(pointOfSaleExists) res.status(400).send({message: Response(EXISTING_POINT)});
            else {
                let createdPointOfSale = await PointOfSale.create({name:data.name,state: Response(ACTIVE)});
                if(!createdPointOfSale) res.send({message: Response(POINT_NOT_ADDED)});
                else res.send(createdPointOfSale);
            }
        }catch(err){
            res.status(500).send(Response(INTERNAR_ERROR));
            console.log(err);
        }
    }else {
        res.send({message: Response(REQUIRED_FIELDS)});
    }
}

async function updatePointOfSale(req,res){
    let id = req.params.id;
    let data = req.body;

    if(data.name || data.state){
        try {
            let pointExists = await PointOfSale.findOne({
                where:{
                    [Op.or]:[{name:data.name}, {state:data.state}]
                }
            });

            if(pointExists) res.status(400).send({message: Response(EXISTING_POINT)});
            else {
                let pointUpdate = await PointOfSale.update(data,{where:{idpointOfSale}});
                if(!pointUpdate) res.send ({message: Response(COULD_NOT_EDIT_POINT)});
                else res.send(pointUpdate);
            }
        }catch(err){
            res.status(500).send(Response(INTERNAR_ERROR));
            console.log(err);
        }
    }else {
        res.send({message: Response(REQUIRED_FIELDS)});
    }
}


async function deletePointOfSale(req,res) {
    let id = req.params.id;

    try {
        let pointExists = await PointOfSale.finById(id);

        if(!pointExists) res.status(400).send({message: Response(WRONG_ID)});
        else {
            let hasTransactions = await Transacion.findAll({where:{idpointOfSale:id}});
            if(hasTransactions){
                await PointOfSale.update({state: Response(INACTIVE)},{where:{idpointOfSale:id}});
                res.send({message: Response(UPDATE)});
            }else {
                let pointDeleted = await PointOfSale.destroy({where:{idpointOfSale:id}});
                if(!pointDeleted) res.send({message: Response(CANNOT_DELETE_POINT)});
                else {
                    res.send({message: Response(DELETE_POINT)});
                }
            }
        }
    }catch(err){
        res.status(500).send(Response(INTERNAR_ERROR));
        console.log(err);
    }
}

async function listPointOfSale(req,res){
    try {
        let point = await PointOfSale.findAll({where:{state: Response(ACTIVE)}});
        if(!point) res.status(400).send({message: Response(IMPOSSIBLE_TO_GET_POINTS)});
        else {
            if(USER.length == 0) res.send({message: Response(POINT_NOT_AVAILABLE)});
            else {
                res.send(users);
            }
        } 
    }catch(err){
        res.status(500).send(Response(INTERNAR_ERROR));
        console.log(err);
    }
}

module.exports = {
    createPointOfSale,
    updatePointOfSale,
    deletePointOfSale,
    listPointOfSale
}