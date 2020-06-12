'use strcit'

//modules 
const BCrypt = require('bcrypt-nodejs');
const {Op}= require('sequelize');
const jwt = require('../services/jwt');
const UserMessages = require('../constants/messagesUser');
const CONSTANTS = require('../constants/constants');

//modeles
const Models = require('../models');
const User = Models.User;
const Transaction = Models.transaction;


/* NOTAS PARA EL PROFESOR 
   ACTUALMENTE LAS BUENAS PRÁCTICAS DEL USO DE EXPRESS Y ECMAScript6 EN NODE.JS HACEN LA UTILIZACIÓN DEL MÉTODO SEND EN LUGAR 
   DE RESPONSE, SEND ES EQUIVALENTE A RESPONSE DENTRO DEL FRAMEWORK EXPRESS, POR LO ANTES MENCIONADO NO SE UTILIZARÁ PARA 
   RESPONDER SOLICITUDES EN LA API.
*/

async function createUser(req,res){
    let data =  req.body;
    let blankSpace  = /^.+\s.*$/g;
    let user = {};

    if(data.name && data.lastName && data.email && data.password && data.userName){
        try {
            let userExists = await User.findOne({
                where:{
                    [Op.or]:[{userName:data.userName},{email:data.email}]
                }
            });

            if(userExists) res.status(400).send({message: UserMessages.EXISTING_USER});
            else{
                user.name = data.name;
                user.lastName = data.lastName;
                user.userName = data.userName;
                user.email = data.email;
                user.role = CONSTANTS.USER
                user.state = CONSTANTS.ACTIVE;
                if(data.password.match(blankSpace)) res.send({mesagge: UserMessages.PASSWORD_WITHOUT_SPACE});
                else{
                    BCrypt.hash(data.password,null,null,async (error,password)=>{
                        if(error){
                            res.send(500).send({message: UserMessages.PASSWORD_CREATION_ERROR});
                            console.log(error);
                        }else{
                            user.password = password;
                           
                            let userSaved = await User.create(user);
                            if(!userSaved) res.send({mesagge: UserMessages.USER_CREATION_ERROR});
                            else{
                                res.send(userSaved);
                            }
                        }
                    });
                }
                
            }
        }catch(err){
            res.status(500).send({mesagge:UserMessages.INTERNAL_ERROR});
            console.log(err);
        }
    }else{
        res.send({mesagge:UserMessages.REQUIRED_FIELDS});
    }
}

async function login(req,res){
    let params = req.body;
    let attempts = 0;

    if(params.userName || params.email){
        if(params.password){
            try {
                let userFound = await User.findOne({
                    where:{
                        userName:params.userName
                    }
                });
                if(!userFound){
                    res.send({mesagge: UserMessages.USER_OR_EMAIL});
                }
                else{
                    BCrypt.compare(params.password,userFound.password,(error,checked)=>{
                        if(error){
                            res.status(500).send({message: UserMessages.ERROR});
                            console.log(error);
                        }else if(checked){
                           if(params.gettoken){
                               res.send({token:jwt.createToken(userFound)});
                           }else{
                               res.send({user:userFound});
                           }
                        }else{
                            res.status(401).send({message: UserMessages.INCORRECT_DATA});
                            attempts = attempts++;
                            console.log(attempts);
                        }
                    });
                }
            }catch(err){
                res.status(500).send({message:UserMessages.INTERNAL_ERROR});
                console.log(err);
            }
        }else{
            res.status(400).send({message: UserMessages.ENTER_PASSWORD});
        }
    }else{
        res.status(400).send({message: UserMessages.USER_OR_EMAIL});
    }
}

async function deleteAccount(req,res){
    let id = req.params.id;

    try {
        let userExists = await User.findById(id);

        if(!userExists) res.status(400).send({message: UserMessages.WRONG_ID});
        else{
           let hasTransactions = await Transaction.findAll({where:{user:id}});
           if(hasTransactions){
                await User.update({state: CONSTANTS.ACTIVE},{where:{idUser:id}});
                res.send({message: UserMessages.UPDATE});
           }else{
                let userDeleted = await User.destroy({where:{idUser:id}});
                if(!userDeleted) res.send({message:UserMessages.CANNOT_DELETE_USER});
                else{
                    res.send({message: UserMessages.DELETE_USER});
                }
           }
        }
    }catch(err){
        res.status(500).send({message:UserMessages.INTERNAL_ERROR});
        console.log(err);
    }
    
}

async function listUsers(req,res){
    try {
        let users = await User.findAll({where:{state: CONSTANTS.ACTIVE}});
        if(!users) res.send({message: UserMessages.IMPOSSIBLE_TO_OBTAIN_USERS});
        else{
            if(users.length == 0) res.send({message: UserMessages.USERS_NOT_AVAILABLE});
            else{
                res.send(users);
            }
        }
    }catch(err){
        res.status(500).send({message:UserMessages.INTERNAL_ERROR});
        console.log(err);
    }
}

async function updateUser(req,res){
    let id = req.params.id;
    let data =  req.body;
    
    if(data.name || data.lastName || data.email || data.userName){
        try {
            let userExists = await User.findOne({
                where:{
                    [Op.or]:[{userName:data.userName},{email:data.email}]
                }
            });

            if(userExists) res.status(400).send({message:UserMessages.EXISTING_USER});
            else{
                let userUpdated = await User.update(data,{where:{idUser:id}});
                if(!userUpdated) res.send({mesagge:UserMessages.COULD_NOT_EDIT_USER});
                else res.send(userUpdated);
            }
        }catch(err){
            res.status(500).send({message:UserMessages.INTERNAL_ERROR});
            console.log(err);
        }
    }else{
        res.send({mesagge: UserMessages.REQUIRED_FIELDS});
    }
}

module.exports = {
    createUser,
    login,
    deleteAccount,
    listUsers,
    updateUser
}
