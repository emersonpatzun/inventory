'use strcit'
// modules 
const BCrypt = require('bcrypt-nodejs');
const {Op}= require('sequelize');
const jwt = require('../services/jwt');
//modeles
const Models = require('../models');
const User = Models.User;

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

            if(userExists) res.status(400).send({message:'El usuario ya existe.'});
            else{
                user.name = data.name;
                user.lastName = data.lastName;
                user.userName = data.userName;
                user.email = data.email;
                user.role = 'USER';
                user.state = 'ACTIVE';
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
    var params = req.body;

    if(params.userName || params.email){
        if(params.password){
            try {
                let userFound = await User.findOne({
                    where:{
                        [Op.or]:[{userName:params.userName},{email:params.email}]
                    }
                });
                if(!userFound) console.log(userFound);
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

module.exports = {
    createUser,
    login
}