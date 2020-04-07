'use strcit'

//modules 
const BCrypt = require('bcrypt-nodejs');
const {Op}= require('sequelize');
const jwt = require('../services/jwt');
g
//modeles
const Models = require('../models');
const User = Models.User;
const Transaction = Models.transaction;

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

            if(userExists) res.status(400).send({message: Response(EXISTING_USER)});
            else{
                user.name = data.name;
                user.lastName = data.lastName;
                user.userName = data.userName;
                user.email = data.email;
                user.role = Response(USER);
                user.state = Response(ACTIVE);
                if(data.password.match(blankSpace)) res.send({mesagge: Response(PASSWORD_WITHOUT_SPACE)});
                else{
                    BCrypt.hash(data.password,null,null,async (error,password)=>{
                        if(error){
                            res.send(500).send({message: Response(PASSWORD_CREATION_ERROR)});
                            console.log(error);
                        }else{
                            user.password = password;
                           
                            let userSaved = await User.create(user);
                            if(!userSaved) res.send({mesagge: Response(USER_CREATION_ERROR)});
                            else{
                                res.send(userSaved);
                            }
                        }
                    });
                }
                
            }
        }catch(err){
            res.status(500).send(Response(INTERNAL_ERROR));
            console.log(err);
        }
    }else{
        res.send({mesagge: Response(REQUIRED_FIELDS)});
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
                    res.send({mesagge: Response(USER_OR_EMAIL)});
                }
                else{
                    BCrypt.compare(params.password,userFound.password,(error,checked)=>{
                        if(error){
                            res.status(500).send({message: Response(ERROR)});
                            console.log(error);
                        }else if(checked){
                           if(params.gettoken){
                               res.send({token:jwt.createToken(userFound)});
                           }else{
                               res.send({user:userFound});
                           }
                        }else{
                            res.status(401).send({message: Response(INCORRECT_DATA)});
                            attempts = attempts++;
                            console.log(attempts);
                        }
                    });
                }
            }catch(err){
                res.status(500).send({message: Response(INTERNAL_ERROR)});
                console.log(err);
            }
        }else{
            res.status(400).send({message: Response(ENTER_PASSWORD)});
        }
    }else{
        res.status(400).send({message: Response(USER_OR_EMAIL)});
    }
}

async function deleteAccount(req,res){
    let id = req.params.id;

    try {
        let userExists = await User.findById(id);

        if(!userExists) res.status(400).send({message: Response(WRONG_ID)});
        else{
           let hasTransactions = await Transaction.findAll({where:{user:id}});
           if(hasTransactions){
                await User.update({state: Response(ACTIVE)},{where:{idUser:id}});
                res.send({message: Response(UPDATE)});
           }else{
                let userDeleted = await User.destroy({where:{idUser:id}});
                if(!userDeleted) res.send({message:Response(CANNOT_DELETE_USER)});
                else{
                    res.send({message: Response(DELETE_USER)});
                }
           }
        }
    }catch(err){
        res.status(500).send(Response(INTERNAL_ERROR));
        console.log(err);
    }
    
}

async function listUsers(req,res){
    try {
        let users = await User.findAll({where:{state: Response(ACTIVE)}});
        if(!users) res.send({message: Response(IMPOSSIBLE_TO_OBTAIN_USERS)});
        else{
            if(users.length == 0) res.send({message: Response(USERS_NOT_AVAILABLE)});
            else{
                res.send(users);
            }
        }
    }catch(err){
        res.status(500).send(Response(INTERNAL_ERROR));
        console.log(err);
    }
}

module.exports = {
    createUser,
    login,
    deleteAccount,
    listUsers
}
