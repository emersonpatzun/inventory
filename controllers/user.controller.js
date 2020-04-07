'use strcit'
// modules 
const BCrypt = require('bcrypt-nodejs');
const {Op}= require('sequelize');
const jwt = require('../services/jwt');
//modeles
const Models = require('../models');
const User = Models.User;
const Transaction = Models.transaction;
// utilities
const Utilities = require("../util/const.util");

async function createUser(req,res){
    let data =  req.body;
    let blankSpace = Utilities.BLANKSPACE;
    let user = {};

    if(data.name && data.lastName && data.email && data.password && data.userName){
        try {
            let userExists = await User.findOne({
                where:{
                    [Op.or]:[{userName:data.userName},{email:data.email}]
                }
            });

            if(userExists) res.status(400).send({message:'El usuario ya existe.'});
            else{
                user.name = data.name;
                user.lastName = data.lastName;
                user.userName = data.userName;
                user.email = data.email;
                user.role = Utilities.USER;
                user.state = Utilities.ACTIVE;
                if(data.password.match(blankSpace)) res.send({mesagge:'La contraseña no puede contener espacios.'});
                else{
                    BCrypt.hash(data.password,null,null,async (error,password)=>{
                        if(error){
                            res.send(500).send({message:'Error de creacion de password.'});
                            console.log(error);
                        }else{
                            user.password = password;
                            let userSaved = await User.create(user);
                            if(!userSaved) res.send({mesagge:'No se pudo crear el usuario'});
                            else{
                                res.send(userSaved);
                            }
                        }
                    });
                }
                
            }
        }catch(err){
            res.status(500).send('Error interno del servidor');
            console.log(err);
        }
    }else{
        res.send({mesagge:"Todos los campos son requeridos"});
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
                    res.send({mesagge:'Usario o correo incorrecto'});
                }
                else{
                    BCrypt.compare(params.password,userFound.password,(error,checked)=>{
                        if(error){
                            res.status(500).send({message:'Error'});
                            console.log(error);
                        }else if(checked){
                           if(params.gettoken){
                               res.send({token:jwt.createToken(userFound)});
                           }else{
                               res.send({user:userFound});
                           }
                        }else{
                            res.status(401).send({message:'Contraseña incorrecta'});
                            attempts = attempts++;
                            console.log(attempts);
                        }
                    });
                }
            }catch(err){
                res.status(500).send({message:'Error interno del servidor.'});
                console.log(err);
            }
        }else{
            res.status(400).send({message:'Ingresa la contraseña'});
        }
    }else{
        res.status(400).send({message:'Ingresa el nombre de usuario o correo.'});
    }
}

async function deleteAccount(req,res){
    let id = req.params.id;

    try {
        let userExists = await User.findById(id);

        if(!userExists) res.status(400).send({message:'ID de usuario incorrecto.'});
        else{
           let hasTransactions = await Transaction.findAll({where:{user:id}});
           if(hasTransactions){
                await User.update({state:Utilities.INACTIVE},{where:{idUser:id}});
                res.send({message:'Estado Actualizado'});
           }else{
                let userDeleted = await User.destroy({where:{idUser:id}});
                if(!userDeleted) res.send({message:'No se pudo borrar el usuario'});
                else{
                    res.send({message:'Usuario Eliminado'});
                }
           }
        }
    }catch(err){
        res.status(500).send('Error interno del servidor');
        console.log(err);
    }
    
}

async function listUsers(req,res){
    try {
        let users = await User.findAll({where:{state:Utilities.ACTIVE}});
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
    createUser,
    login,
    deleteAccount,
    listUsers
}