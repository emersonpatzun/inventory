const Models = require('../models');
const Product = Models.product;

//constants
const constants = require('../constants/constants');

//messages
const messages = require('../constants/messagesProduct');

/* NOTAS PARA EL PROFESOR 
   ACTUALMENTE LAS BUENAS PRÁCTICAS DEL USO DE EXPRESS Y ECMAScript6 EN NODE.JS HACEN LA UTILIZACIÓN DEL MÉTODO SEND EN LUGAR 
   DE RESPONSE, SEND ES EQUIVALENTE A RESPONSE DENTRO DEL FRAMEWORK EXPRESS, POR LO ANTES MENCIONADO NO SE UTILIZARÁ PARA 
   RESPONDER SOLICITUDES EN LA API.
*/

async function createProduct(req,res) {
    let data = req.body;

    if (data.name && data.category && data.miniumStock){
        try {
            let productExists = await Product.findOne({
                where:{
                    name:data.name,
                    category:data.category,
                    miniumStock:data.miniumStock
                }
            });

            if(productExists) res.status(400).send({message: messages.EXISTING_PRODUCT});
            else {
                let createdProduct = await Product.create({name:data.name, category:data.category, miniumStock:data.miniumStock, state: Response(ACTIVE)});
                if(!createdProduct) res.send({message: messages.PRODUCT_NOT_ADDED});
                else res.send(createdProduct);
            }
        }catch(err){
            res.status(500).send(messages.INTERNAR_ERROR);
            console.log(err);
        }
    }else {
        res.send({message: messages.REQUIRED_FIELDS});
    }
}

async function updateProduct(req,res) {
    let id = req.params.id;
    let data = req.body;

    if(data.name || data.category || data.miniumStock || state.state){
        try {
            let productExists = await Product.findOne({
                where:{
                    [Op.or]:[{name:data.name},{category:data.category},{miniumStock:data.miniumStock},{state:data.state}]
                }
            });

            if(productExists) res.status(400).send({message:messages.EXISTING_PRODUCT});
            else {
                let productUpdate = await Product.update(data,{where:{idproduct:id}});
                if(!productUpdate) res.send({message: messages.COULD_NOT_EDIT_PRODUCT});
                else res.send(productUpdate);
            }
        }catch(err){
            res.status(500).send(messages.INTERNAR_ERROR);
            console.log(err);
        }
    }else {
        res.send({message: messages.REQUIRED_FIELDS});
    }
}

async function deleteProduct(req,res) {
    let id = req.params.id;

    try {
        let productExists = await Product.finById(id);

        if(!productExists) res.status(400).send({message: messages.WRONG_ID});
        else {
            let hasTransactions = await Transacion.findAll({where:{idproduct:id}});
            if(hasTransactions){
                await Product.update({state: constants.INACTIVE},{where:{idproduct:id}});
                res.send({message: messages.UPDATE});
            }else {
                let productDelete = await Product.destroy({where:{idproduct:id}});
                if(!productDelete) res.send({message: messages.CANNOT_DELETE_PRODUCT});
                else {
                    res.send({message: messages.DELETE_PRODUCT});
                }
            }
        }
    }catch(err){
        res.status(500).send(messages.INTERNAR_ERROR);
        console.log(err);
    }
}

async function listProduct(req,res) {
    try {
        let product = await Product.findAll({where:{ state: constantsACTIVE}});
        if(!product) res.status(400).send({message: messages.PRODUCT_NOT_AVAILABLE});
        else {
            if(product.length == 0) res.send({message: messages.PRODUCT_NOT_AVAILABLE});
            else {
                res.send(product);
            }
        }
    }catch(err) {
        res.status(500).send({message: messages.INTERNAL_ERROR});
        console.log(err);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    listProduct
}

//ESPECIFICACIONES
/*

Crear nuevos productos, 
editar productos, 
eliminar productos, 
listar todos los productos y obtener los datos especificos de un producto.

El codigo de la barra de producto debe ser Unico
Validar el nombre del producto para que no se repita
Validar el campo precio general no podra ser negtivo y no debe quedar vacio

*/